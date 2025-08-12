use once_cell::sync::OnceCell;
use std::sync::Mutex;
use std::time::Instant;
use tauri::Manager;
use tauri::path::BaseDirectory;

mod model;
use model::{YoloModelSession, Detection, YoloTimingStats};

use base64::Engine;

static YOLO_SESSION: OnceCell<Mutex<YoloModelSession>> = OnceCell::new();

use serde::Serialize;

#[derive(Serialize)]
pub struct InferResult {
    detections: Vec<Detection>,
    timing: YoloTimingStats,
}

fn log_result<T, E: std::fmt::Debug>(result: Result<T, E>, action: &str) -> Result<T, String> {
    match result {
        Ok(val) => {
            println!("success: {}", action);
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

fn get_or_init_yolo(model_path: &str) -> Result<&'static Mutex<YoloModelSession>, String> {
    YOLO_SESSION.get_or_try_init(|| {
        YoloModelSession::new(model_path, Some(0.5), Some(0.5))
            .map(Mutex::new)
            .map_err(|e| format!("Failed to initialize YOLO model: {e}"))
    })
}

#[tauri::command]
async fn infer(handle: tauri::AppHandle, base64: String) -> Result<InferResult, String> {
    let total_start = Instant::now();
    let mut timing = YoloTimingStats::default();

    let img_bytes = log_result(base64::engine::general_purpose::STANDARD.decode(&base64), "decode base64 image")?;
    let img_load_start = Instant::now();
    let img = log_result(image::load_from_memory(&img_bytes), "load image from memory")?;
    timing.load = img_load_start.elapsed().as_millis() as u16;

    let model_path = get_resource_path(&handle, "resources/models/foodseg103n.onnx")?;

    let model_init_start = Instant::now();
    let yolo_mutex = get_or_init_yolo(&model_path)?;
    let mut yolo = yolo_mutex.lock().map_err(|_| "Failed to lock YOLO session".to_string())?;
    timing.init = model_init_start.elapsed().as_millis() as u16;

    let detections = log_result(yolo.infer(&img, &mut timing), "model inference")?;

    timing.total = total_start.elapsed().as_millis() as u16;

    println!("YOLO TIMING STATISTICS:");
    println!("  Image Load:  {} ms", timing.load);
    println!("  Model Init:  {} ms", timing.init);
    println!("  Resize:      {} ms", timing.resize);
    println!("  Padding:     {} ms", timing.pad);
    println!("  ToTensor:    {} ms", timing.tensor);
    println!("  Inference:   {} ms", timing.infer);
    println!("  BBox:        {} ms", timing.bbox);
    println!("  NMS:         {} ms", timing.nms);
    println!("  Total:       {} ms\n", timing.total);

    Ok(InferResult { detections, timing })
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
        .invoke_handler(tauri::generate_handler![infer])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
