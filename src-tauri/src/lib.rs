use once_cell::sync::Lazy;
use std::sync::Mutex;
use std::time::Instant;
use tauri::Manager;
use tauri::path::BaseDirectory;

mod model;
use model::{YoloModelSession, Detection, YoloTimingStats};

use base64::Engine;

static YOLO_SESSION: Lazy<Mutex<Option<YoloModelSession>>> = Lazy::new(|| Mutex::new(None));
static LAST_MODEL_PATH: Lazy<Mutex<String>> = Lazy::new(|| Mutex::new(String::new()));

fn get_or_init_yolo(model_path: &str) -> Result<std::sync::MutexGuard<'_, Option<YoloModelSession>>, String> {
    let mut last_path = LAST_MODEL_PATH.lock().map_err(|_| "Failed to lock LAST_MODEL_PATH")?;
    let mut session = YOLO_SESSION.lock().map_err(|_| "Failed to lock YOLO_SESSION")?;

    if last_path.as_str() != model_path {
        // Reinitialize session if model_path changed
        *session = Some(YoloModelSession::new(model_path, Some(0.5), Some(0.5))
            .map_err(|e| format!("Failed to initialize YOLO model: {e}"))?);
        *last_path = model_path.to_string();
    } else if session.is_none() {
        // Initialize if not already
        *session = Some(YoloModelSession::new(model_path, Some(0.5), Some(0.5))
            .map_err(|e| format!("Failed to initialize YOLO model: {e}"))?);
        *last_path = model_path.to_string();
    }

    Ok(session)
}

use serde::Serialize;

#[derive(Serialize)]
pub struct InferResult {
    detections: Vec<Detection>,
    timing: YoloTimingStats,
}

#[derive(Serialize)]
pub struct ModelInfo {
    input_shape: String,
    output_shape: String,
    file_size_mb: String,
}

// #[derive(serde::Serialize)]
// pub struct Info {
//     success: bool,
//     pub score: f32,
//     pub bbox: [f32; 4], // [x, y, width, height]
// }

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

#[tauri::command]
async fn infer(handle: tauri::AppHandle, base64: String, model: String, conf: f32, iou: f32) -> Result<InferResult, String> {
    let total_start = Instant::now();
    let mut timing = YoloTimingStats::default();

    let img_bytes = log_result(base64::engine::general_purpose::STANDARD.decode(&base64), "decode base64 image")?;
    let img_load_start = Instant::now();
    let img = log_result(image::load_from_memory(&img_bytes), "load image from memory")?;
    timing.load = img_load_start.elapsed().as_millis() as u16;

    // Use the provided model file name
    let model_path = get_resource_path(&handle, &format!("resources/models/{}", model))?;

    let model_init_start = Instant::now();
    let mut yolo_guard = get_or_init_yolo(&model_path)?;
    let yolo = yolo_guard.as_mut().ok_or("YOLO session not initialized".to_string())?;
    yolo.set_prob_thresh(conf/100.0);
    yolo.set_iou_thresh(iou/100.0);
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

#[tauri::command]
async fn info(handle: tauri::AppHandle, model: String) -> Result<ModelInfo, String> {
    let model_path = get_resource_path(&handle, &format!("resources/models/{}", model))?;
    let session = YoloModelSession::new(&model_path, Some(0.5), Some(0.5))
        .map_err(|e| format!("Failed to initialize YOLO model: {e}"))?;

    // Get file size in MB
    let file_size_mb = match std::fs::metadata(&model_path) {
        Ok(metadata) => {
            let file_size_bytes = metadata.len();
            format!("{:.2} MB", file_size_bytes as f64 / (1024.0 * 1024.0))
        }
        Err(e) => format!("Failed to get model file size: {}", e),
    };

    let (input_shape, output_shape) = match session.get_info() {
        Ok((input_shape, output_shape)) => (input_shape, output_shape),
        Err(err_msg) => (err_msg.clone(), err_msg),
    };

    Ok(ModelInfo {
        input_shape,
        output_shape,
        file_size_mb,
    })
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
        .invoke_handler(tauri::generate_handler![infer, info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
