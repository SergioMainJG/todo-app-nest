#!/usr/bin/env -S cargo +nightly -Zscript
---
[dependencies]
reqwest = { version = "0.11", features = ["blocking", "json"] }
---

use std::error::Error;
use std::collections::HashMap;


fn main() -> Result<(), Box<dyn Error>> {
    let client = reqwest::blocking::Client::new();

    //let res = client.get("http://localhost:8080/user")?.send()?.text()?;
    
    let mut map = HashMap::new();

    map.insert("fullName", "Sergio Arce");
    map.insert("email", "algo@algo.com");
    map.insert("password", "Irelia2026!");


    let res = client
        .post("http://localhost:8080/auth/register")
        .json(&map)
        .send()?
        .text()?;

    println!("{:#?}", res);
    Ok(())
}
