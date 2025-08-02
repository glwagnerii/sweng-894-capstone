fn main() {
    println!("cargo:warning=-------------------------------");
    println!(
        "cargo:warning=ORT_IOS_XCFWK_LOCATION={}",
        std::env::var("ORT_IOS_XCFWK_LOCATION").unwrap_or_else(|_| "NOT SET".into())
    );
    println!(
        "cargo:warning=ORT_EXT_IOS_XCFWK_LOCATION={}",
        std::env::var("ORT_EXT_IOS_XCFWK_LOCATION").unwrap_or_else(|_| "NOT SET".into())
    );
    println!("cargo:warning=-------------------------------");
    tauri_build::build()
}
