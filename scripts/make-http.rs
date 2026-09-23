#!/usr/bin/env -S cargo +nightly -Zscript
---
[dependencies]
reqwest = { version = "0.11", features = ["blocking", "json"] }
---

use std::error::Error;
use std::collections::HashMap;

fn register_user() -> Result<(), Box<dyn Error>>{
    let client = reqwest::blocking::Client::new();

    let mut map = HashMap::new();
    map.insert("fullName", "User Testing");
    map.insert("email", "algo@algo.com");
    map.insert("password","!Irelia12345!");

    let res = client
        .post("http://localhost:8080/auth/register")
        .json(&map)
        .send()?
        .text()?;

    println!("{:#?}", res);
    Ok(())
}
fn find_todo_by_id() -> Result<(), Box<dyn Error>>{
    let client = reqwest::blocking::Client::new();

    let credential = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZnVsbE5hbWUiOiJVc2VyIFRlc3RpbmciLCJlbWFpbCI6ImFsZ29AYWxnby5jb20iLCJpYXQiOjE3OTAxMjYwNzgsImV4cCI6MTc5MTAyNjA3OCwiYXVkIjoidG9kby1hcHAtd2ViIiwiaXNzIjoidG9kby1hcHAtYXBpIn0.hp3LmBQj1QuFvvi-khRV6Rtj0OwOkJhh3KlzFu9xZGY";
    let res = client
        .get("http://localhost:8080/todos/8")
        .bearer_auth(credential)
        .send()?
        .text()?;

    println!("{:#?}", res);
    Ok(())
}

fn create_todo() -> Result<(), Box<dyn Error>>{
    let client = reqwest::blocking::Client::new();

    let credential = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZnVsbE5hbWUiOiJVc2VyIFRlc3RpbmciLCJlbWFpbCI6ImFsZ29AYWxnby5jb20iLCJpYXQiOjE3OTAxMjYwNzgsImV4cCI6MTc5MTAyNjA3OCwiYXVkIjoidG9kby1hcHAtd2ViIiwiaXNzIjoidG9kby1hcHAtYXBpIn0.hp3LmBQj1QuFvvi-khRV6Rtj0OwOkJhh3KlzFu9xZGY";

    let mut map = HashMap::new();
    map.insert("title", "Testing Title");
    map.insert("description", "Hola Mundo!");

    let res = client
        .post("http://localhost:8080/todos")
        .bearer_auth(credential)
        .json(&map)
        .send()?
        .text()?;

    println!("{:#?}", res);
    Ok(())
}

fn remove_todo() -> Result<(), Box<dyn Error>>{
    let client = reqwest::blocking::Client::new();

    let credential = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZnVsbE5hbWUiOiJVc2VyIFRlc3RpbmciLCJlbWFpbCI6ImFsZ29AYWxnby5jb20iLCJpYXQiOjE3OTAxMjYwNzgsImV4cCI6MTc5MTAyNjA3OCwiYXVkIjoidG9kby1hcHAtd2ViIiwiaXNzIjoidG9kby1hcHAtYXBpIn0.hp3LmBQj1QuFvvi-khRV6Rtj0OwOkJhh3KlzFu9xZGY";

    let mut map = HashMap::new();
    map.insert("title", "Testing Title");
    map.insert("description", "Hola Mundo!");

    let res = client
        .delete("http://localhost:8080/todos/7")
        .bearer_auth(credential)
        .json(&map)
        .send()?
        .text()?;

    println!("{:#?}", res);
    Ok(())
}

fn update_todo() -> Result<(), Box<dyn Error>>{
    let client = reqwest::blocking::Client::new();

    let credential = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZnVsbE5hbWUiOiJVc2VyIFRlc3RpbmciLCJlbWFpbCI6ImFsZ29AYWxnby5jb20iLCJpYXQiOjE3OTAxMjYwNzgsImV4cCI6MTc5MTAyNjA3OCwiYXVkIjoidG9kby1hcHAtd2ViIiwiaXNzIjoidG9kby1hcHAtYXBpIn0.hp3LmBQj1QuFvvi-khRV6Rtj0OwOkJhh3KlzFu9xZGY";

    let mut map = HashMap::new();
    map.insert("title", "Testing 2 Title");
    map.insert("description", "Hola 2 Mundo!");

    let res = client
        .patch("http://localhost:8080/todos/8")
        .bearer_auth(credential)
        .json(&map)
        .send()?
        .text()?;

    println!("{:#?}", res);
    Ok(())
}

fn main() -> Result<(), Box<dyn Error>> {
    return find_todo_by_id();
}
