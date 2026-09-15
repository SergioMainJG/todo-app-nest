#!/usr/bin/env -S cargo +nightly -Zscript
---
[package]
edition = "2024"
---

use std::env;
use std::fs;
use std::io;
use std::path::{Path, PathBuf};
use std::process::Command;

fn home() -> io::Result<PathBuf> {
    env::var_os("HOME")
        .map(PathBuf::from)
        .ok_or_else(|| io::Error::new(io::ErrorKind::NotFound, "HOME no está definido"))
}

fn project_root() -> io::Result<PathBuf> {
    Path::new(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .map(Path::to_path_buf)
        .ok_or_else(|| io::Error::new(io::ErrorKind::NotFound, "No se encontró la raíz del proyecto"))
}

fn copy_dir_recursive(src: &Path, dst: &Path) -> io::Result<()> {
    fs::create_dir_all(dst)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let from = entry.path();
        let to = dst.join(entry.file_name());

        if from.is_dir() {
            copy_dir_recursive(&from, &to)?;
        } else {
            fs::copy(&from, &to)?;
        }
    }
    Ok(())
}

fn main() -> io::Result<()> {
    let root = project_root()?;
    let app_name = root
        .file_name()
        .ok_or_else(|| io::Error::new(io::ErrorKind::InvalidData, "Nombre de proyecto inválido"))?;

    let origin = root.join("deploy");
    let target = home()?.join(".config/containers/systemd").join(app_name);

    if !origin.is_dir() {
        return Err(io::Error::new(
            io::ErrorKind::NotFound,
            format!("No existe {}", origin.display()),
        ));
    }
    
    copy_dir_recursive(&origin, &target)?;
    println!("{} sincronizado con {}", target.display(), origin.display());

    let status = Command::new("systemctl")
        .args(["--user", "daemon-reload"])
        .status()?;

    if !status.success() {
        return Err(io::Error::other(format!(
            "systemctl --user daemon-reload falló: {status}"
        )));
    }

    println!("Demonio recargado: {status}");
    Ok(())
}