// mod model2;

// use tauri::Manager;

// #[tauri::command]
// fn hello() -> String {
//     "bar".into()
// }

// #[tauri::command]
// fn greet(_name: &str) -> String {
//     "👋 Hello from YOLO USLS Tauri app!".into()
// }

// #[tauri::command]
// fn infer_image_from_path(image_path: String) -> Result<String, String> {
//     let model_path = "resources/models/yolo11n.onnx";
//     model2::infer_from_image_path(&image_path, model_path)
//         .map_err(|e| format!("❌ Inference failed: {}", e))
// }

// #[tauri::command]
// fn infer_image_from_base64(base64: String) -> Result<String, String> {
//     let model_path = "resources/models/yolo11n.onnx";
//     model2::infer_from_base64(&base64, model_path)
//         .map_err(|e| format!("❌ Inference failed: {}", e))
// }

// #[cfg_attr(mobile, tauri::mobile_entry_point)]
// pub fn run() {
//     let mut builder = tauri::Builder::default()
//         .plugin(tauri_plugin_clipboard_manager::init())
//         .plugin(tauri_plugin_dialog::init())
//         .plugin(tauri_plugin_fs::init())
//         .plugin(tauri_plugin_http::init())
//         .plugin(
//             tauri_plugin_log::Builder::default()
//                 .level(log::LevelFilter::Info)
//                 .build(),
//         )
//         .plugin(tauri_plugin_notification::init())
//         .plugin(tauri_plugin_opener::init())
//         .plugin(tauri_plugin_os::init())
//         .plugin(tauri_plugin_sql::Builder::new().build())
//         .plugin(tauri_plugin_store::Builder::new().build());

//     #[cfg(desktop)]
//     {
//         builder = builder.plugin(tauri_plugin_window_state::Builder::default().build());
//     }

//     builder
//         .invoke_handler(tauri::generate_handler![
//             hello,
//             greet,
//             infer_image_from_path,
//             infer_image_from_base64
//         ])
//         .run(tauri::generate_context!())
//         .expect("error while running Tauri application");
// }

// OLD lib
mod model;
use model::{YoloModelSession, Detection};

#[tauri::command]
fn greet(_name: &str) -> String {
    // Load YOLO model session with ONNX and YAML
    let yolo = match YoloModelSession::new("resources/models/yolo11n.onnx", Some("resources/models/coco8.yaml"), None, None) {
        Ok(session) => session,
        Err(e) => return format!("❌ Failed to load YOLO model session: {}", e),
    };

    let session = yolo.session();
    let mut info = String::new();

    let meta = match session.metadata() {
        Ok(m) => m,
        Err(e) => return format!("❌ Failed to get session metadata: {}", e),
    };

    if let Ok(x) = meta.name() { info.push_str(&format!("name: {x}\n")); }
    if let Ok(x) = meta.description() { info.push_str(&format!("description: {x}\n"));}
    if let Ok(x) = meta.producer() { info.push_str(&format!("producer: {x}\n")); }

    for (i, input) in session.inputs.iter().enumerate() {
        info.push_str(&format!("{i} {}: {}\n", input.name, input.input_type));
    }
    for (i, output) in session.outputs.iter().enumerate() {
        info.push_str(&format!("{i} {}: {}\n", output.name, output.output_type));
    }

    info.push_str("Labels (showing up to 10):\n");
    for (i, label) in yolo.labels().iter().take(10).enumerate() {
        info.push_str(&format!("{i}: {label}\n"));
    }

    info
}

#[tauri::command]
async fn infer_frame(base64: String) -> Result<Vec<Detection>, String> {
    println!("Starting inference...");

    // // Decode base64 string to bytes
    // let img_bytes = match base64::decode(&base64) {
    //     Ok(bytes) => {
    //         println!("img_bytes decoded properly");
    //         bytes
    //     },
    //     Err(e) => return Err(format!("Failed to decode base64 image: {}", e)),
    // };

    // // Load image from bytes
    // let img = match image::load_from_memory(&img_bytes) {
    //     Ok(img) => { 
    //         println!("img loaded properly from img_bytes");
    //         img
    //     },
    //     Err(e) => return Err(format!("Failed to decode image: {}", e)),
    // };

    let img_path = "resources/images/bailey.jpeg";
    let img = match image::open(img_path) {
        Ok(img) => {
            println!("Image loaded properly from {img_path}");
            img
        },
        Err(e) => return Err(format!("Failed to load image from {img_path}: {}", e)),
    };

    // Load or reuse your model session
    let mut yolo = match YoloModelSession::new(
        "resources/models/yolo11n.onnx",
        Some("resources/models/coco8.yaml"),
        Some(0.5),
        Some(0.5),
    ) {
        Ok(session) => {
            println!("YOLO model session loaded successfully.");
            session
        },
        Err(e) => {
            println!("Failed to load YOLO model session: {}", e);
            return Err(e.to_string());
        }
    };

    // Call the inference method
    let detections = match yolo.infer(&img) {
        Ok(dets) => {
            println!("Inference completed successfully. {} detections.", dets.len());
            for (i, det) in dets.iter().enumerate() {
                println!("Detection {}: class={}, score={}, bbox={:?}", i, det.class, det.score, det.bbox);
            }
            dets
        },
        Err(e) => {
            println!("Inference failed: {}", e);
            return Err(e.to_string());
        }
    };

    Ok(detections)
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
        .invoke_handler(tauri::generate_handler![greet, infer_frame])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
