use anyhow::Result;
use tauri::Manager;
use tauri::path::BaseDirectory;
use usls::{models::YOLO, Config, Version};

#[derive(serde::Serialize)]
pub struct Detection {
    pub class: String,
    pub score: f32,
    pub bbox: [f32; 4], // [x, y, width, height]
}
pub fn det_to_detections(y: &usls::Y) -> Vec<Detection> {
    let mut detections = Vec::new();
    if let Some(hbbs) = y.hbbs() {
        for hbb in hbbs {
            if let (Some(name), Some(score)) = (hbb.name(), hbb.confidence()) {
                let (x1, y1, x2, y2) = hbb.xyxy();
                let bbox = [x1, y1, x2 - x1, y2 - y1];
                detections.push(Detection { class: name.to_string(), score, bbox });
            }
        }
    }
    detections
}

fn log_result<T, E: std::fmt::Debug>(result: Result<T, E>, action: &str) -> Result<T, String> {
    match result {
        Ok(val) => {
            println!("success: {}", action);
            Ok(val)
        },
        Err(e) => {
            eprintln!("error: {}: {:?}", action, e);
            Err(format!("error: {}: {:?}", action, e))
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
fn infer(handle: tauri::AppHandle) -> Result<Vec<Detection>, String> {
    let model_path = get_resource_path(&handle, "resources/models/yolo11n.onnx")?;
    println!("Resolved model path: {}", model_path);

    let image_path = get_resource_path(&handle, "resources/images/bailey.jpeg")?;
    println!("Resolved image path: {}", image_path);

    let config = Config::yolo()
        .with_model_file(&model_path)
        .with_version(Version::new(11, 0))
        .with_class_confs(&[0.2, 0.15]);

    let mut model = log_result(YOLO::new(config), "load model")?;
    let img = log_result(image::open(&image_path), "load image")?;
    let detections = log_result(model.forward(&[img.into()]), "model inference")?;

    if let Some(det) = detections.first() {
        println!("success: convert detections");
        Ok(det_to_detections(det))
    } else {
        eprintln!("error: convert detections: No detections found");
        Err("error: convert detections: No detections found".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_log::Builder::default().level(log::LevelFilter::Info).build())
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
