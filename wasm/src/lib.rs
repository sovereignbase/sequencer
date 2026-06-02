use wasm_bindgen::prelude::*;

use std::cell::RefCell;
use std::collections::{HashMap};

pub struct Node {
    this: u128,
    prev: u128,
    next: u128,
    tomb: bool
}

thread_local! {
        static mut FIRST: Node,
    static mut CURRENT: Node,
    static mut TAIL_ID: Node,
    static INSTANCES: RefCell<HashMap<u128, HashMap<u128,Node>>> =
        RefCell::new(HashMap::new());
}

#[wasm_bindgen]

pub fn findIdFor(index: u32)-> u128 {

}

pub fn tombstoneIdOf(index: u32)->() {

}

pub fn merge(this:u128,prev:u128,tomb:u8)->()