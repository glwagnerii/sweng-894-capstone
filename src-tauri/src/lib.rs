use once_cell::sync::OnceCell;
use std::sync::Mutex;
use std::time::Instant;
use tauri::Manager;
use tauri::path::BaseDirectory;

mod model;
use model::{YoloModelSession, Detection};

static YOLO_SESSION: OnceCell<Mutex<YoloModelSession>> = OnceCell::new();

fn log_result<T, E: std::fmt::Debug>(result: Result<T, E>, action: &str) -> Result<T, String> {
    match result {
        Ok(val) => {
            println!("success: {}\n", action);
            Ok(val)
        },
        Err(e) => {
            let msg = format!("error: {}: {:?}", action, e);
            eprintln!("{}", msg);
            Err(msg)
        }
    }
}

fn get_resource_path(handle: &tauri::AppHandle, rel_path: &str) -> Result<String, String> {
    handle
        .path()
        .resolve(rel_path, BaseDirectory::Resource)
        .map_err(|e| e.to_string())?
        .to_str()
        .ok_or("Invalid UTF-8 in resource path".to_string())
        .map(|s| s.to_string())
}

fn get_or_init_yolo(model_path: &str, yaml_path: &str) -> Result<&'static Mutex<YoloModelSession>, String> {
    YOLO_SESSION.get_or_try_init(|| {
        YoloModelSession::new(model_path, Some(yaml_path), Some(0.5), Some(0.5))
            .map(Mutex::new)
            .map_err(|e| format!("Failed to initialize YOLO model: {e}"))
    })
}

#[tauri::command]
async fn infer(handle: tauri::AppHandle) -> Result<Vec<Detection>, String> {
    // Decode base64 string to bytes
    // let img_bytes = log_result(base64::decode(&base64), "decode base64 image")?;
    // let img = log_result(image::load_from_memory(&img_bytes), "load image from memory")?;
    let total_start = Instant::now();
    let img_path = get_resource_path(&handle, "resources/images/bailey.jpeg")?;
    let img_load_start = Instant::now();
    let img = log_result(image::open(&img_path), &format!("load image from {img_path}"))?;
    let img_load_time = img_load_start.elapsed();

    let model_path = get_resource_path(&handle, "resources/models/yolo11n.onnx")?;
    let yaml_path = get_resource_path(&handle, "resources/models/coco8.yaml")?;

    let model_init_start = Instant::now();
    let yolo_mutex = get_or_init_yolo(&model_path, &yaml_path)?;
    let mut yolo = yolo_mutex.lock().map_err(|_| "Failed to lock YOLO session".to_string())?;
    let model_init_time = model_init_start.elapsed();

    let infer_start = Instant::now();
    let detections = log_result(yolo.infer(&img), "model inference")?;
    let infer_time = infer_start.elapsed();

    let total_time = total_start.elapsed();

    println!("TIMING STATISTICS:");
    println!("  Image load:   {:.2?}", img_load_time);
    println!("  Model init:   {:.2?}", model_init_time);
    println!("  Inference:    {:.2?}", infer_time);
    println!("  Total:        {:.2?}\n", total_time);

    Ok(detections)
}

#[tauri::command]
async fn infer_base64(handle: tauri::AppHandle, base64: String) -> Result<Vec<Detection>, String> {
    use base64::Engine;
    let total_start = Instant::now();
    let img_bytes = log_result(base64::engine::general_purpose::STANDARD.decode(&base64), "decode base64 image")?;
    let img_load_start = Instant::now();
    let img = log_result(image::load_from_memory(&img_bytes), "load image from memory")?;
    let img_load_time = img_load_start.elapsed();

    let model_path = get_resource_path(&handle, "resources/models/yolo11n.onnx")?;
    let yaml_path = get_resource_path(&handle, "resources/models/coco8.yaml")?;

    let model_init_start = Instant::now();
    let yolo_mutex = get_or_init_yolo(&model_path, &yaml_path)?;
    let mut yolo = yolo_mutex.lock().map_err(|_| "Failed to lock YOLO session".to_string())?;
    let model_init_time = model_init_start.elapsed();

    let infer_start = Instant::now();
    let detections = log_result(yolo.infer(&img), "model inference")?;
    let infer_time = infer_start.elapsed();

    let total_time = total_start.elapsed();

    println!("TIMING STATISTICS:");
    println!("  Image load:   {:.2?}", img_load_time);
    println!("  Model init:   {:.2?}", model_init_time);
    println!("  Inference:    {:.2?}", infer_time);
    println!("  Total:        {:.2?}\n", total_time);

    Ok(detections)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        // .plugin(tauri_plugin_log::Builder::default().level(log::LevelFilter::Info).build())
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
        .invoke_handler(tauri::generate_handler![infer, infer_base64])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
