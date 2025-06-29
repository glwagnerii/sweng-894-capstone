mod model2;

use tauri::Manager;

#[tauri::command]
fn hello() -> String {
    "bar".into()
}

#[tauri::command]
fn greet(_name: &str) -> String {
    "👋 Hello from YOLO USLS Tauri app!".into()
}

#[tauri::command]
fn infer_image_from_path(image_path: String) -> Result<String, String> {
    let model_path = "resources/models/yolo11n.onnx";
    model2::infer_from_image_path(&image_path, model_path)
        .map_err(|e| format!("❌ Inference failed: {}", e))
}

#[tauri::command]
fn infer_image_from_base64(base64: String) -> Result<String, String> {
    let model_path = "resources/models/yolo11n.onnx";
    model2::infer_from_base64(&base64, model_path)
        .map_err(|e| format!("❌ Inference failed: {}", e))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(
            tauri_plugin_log::Builder::default()
                .level(log::LevelFilter::Info)
                .build(),
        )
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build());

    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_window_state::Builder::default().build());
    }

    builder
        .invoke_handler(tauri::generate_handler![
            hello,
            greet,
            infer_image_from_path,
            infer_image_from_base64
        ])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}

