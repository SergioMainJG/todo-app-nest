#!/usr/bin/env -S cargo +nightly -Zscript
---
[package]
edition = "2024"
---
//! scripts/sync-scripts.rs
//!
//! Lee el `.env` del proyecto y crea/actualiza los secrets de podman
//! (`podman secret create --replace`) sin newlines colados al final.

use std::collections::BTreeMap;
use std::env;
use std::fs;
use std::io::Write;
use std::path::Path;
use std::process::{Command, Stdio};

/// env key -> nombre del secret en podman
const SECRETS: &[(&str, &str)] = &[
    ("POSTGRES_PASSWORD", "todo-app-db-pass"),
    ("DATABASE_URL", "todo-app-db-url"),
    ("JWT_SECRET", "todo-app-jwt-secret"),
    ("JWT_EXPIRES_IN", "todo-app-jwt-expires-in"),
    ("HASH_MEMORY_COST", "todo-app-hash-memory-cost"),
    ("HASH_TIME_COST", "todo-app-hash-time-cost"),
    ("DOMAIN_ORIGIN", "todo-app-domain-origin"),
];

/// claves que fija el quadlet con Environment= (PORT va amarrado a PublishPort);
/// si vienen en el .env se ignoran
const QUADLET_ENV: &[&str] = &["NODE_ENV", "PORT"];

/// quita comillas envolventes: KEY="valor" o KEY='valor'
fn unquote(value: &str) -> &str {
    let v = value.trim();
    for q in ['"', '\''] {
        if v.len() >= 2 && v.starts_with(q) && v.ends_with(q) {
            return &v[1..v.len() - 1];
        }
    }
    v
}

fn parse_env(path: &Path) -> Result<BTreeMap<String, String>, String> {
    let content = fs::read_to_string(path).map_err(|e| {
        format!(
            "no pude leer {}: {e}\n¿Copiaste template.env a .env?",
            path.display()
        )
    })?;

    let mut map = BTreeMap::new();
    for (n, raw) in content.lines().enumerate() {
        let line = raw.trim();
        if line.is_empty() || line.starts_with('#') {
            continue;
        }
        let line = line.strip_prefix("export ").unwrap_or(line);
        let Some((key, value)) = line.split_once('=') else {
            eprintln!("⚠️  línea {} sin '=': {:?}", n + 1, raw);
            continue;
        };
        map.insert(key.trim().to_string(), unquote(value).to_string());
    }
    Ok(map)
}

fn create_secret(name: &str, value: &str) -> Result<(), String> {
    let mut child = Command::new("podman")
        .args(["secret", "create", "--replace", name, "-"])
        .stdin(Stdio::piped())
        .stdout(Stdio::null())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("no pude ejecutar podman: {e}"))?;

    // Escribimos los bytes EXACTOS del valor — sin '\n' final,
    // el clásico gotcha de `echo` que rompe passwords en postgres.
    child
        .stdin
        .take()
        .unwrap()
        .write_all(value.as_bytes())
        .map_err(|e| format!("escribiendo a stdin: {e}"))?;

    let out = child.wait_with_output().map_err(|e| e.to_string())?;
    if !out.status.success() {
        return Err(String::from_utf8_lossy(&out.stderr).trim().to_string());
    }
    Ok(())
}

fn main() {
    let path = env::args()
        .nth(1)
        .unwrap_or_else(|| ".env".to_string());

    let vars = match parse_env(Path::new(&path)) {
        Ok(v) => v,
        Err(e) => {
            eprintln!("❌ {e}");
            std::process::exit(1);
        }
    };

    let mut ok = 0usize;
    let mut failed: Vec<&str> = Vec::new();

    for (key, secret) in SECRETS {
        match vars.get(*key) {
            Some(value) if !value.is_empty() => match create_secret(secret, value) {
                Ok(()) => {
                    println!("✅ {secret}  ←  {key}");
                    ok += 1;
                }
                Err(e) => {
                    eprintln!("❌ {secret}: {e}");
                    failed.push(secret);
                }
            },
            _ => {
                eprintln!("⚠️  {key} falta o está vacío en {path} — se omite {secret}");
                failed.push(secret);
            }
        }
    }

    println!("\n{ok}/{} secrets listos.", SECRETS.len());

    for key in QUADLET_ENV {
        if vars.contains_key(*key) {
            println!("ℹ️  {key} lo fija el quadlet con Environment=; el valor del .env se ignora");
        }
    }

    println!("\nSiguiente paso:");
    println!("  systemctl --user daemon-reload");
    println!("  systemctl --user restart todo-app-nest.service");

    if !failed.is_empty() {
        eprintln!("\n⚠️  Revisa: {}", failed.join(", "));
        std::process::exit(1);
    }
}