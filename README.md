# Classi-Cam


## Notes

- ONNX model needs: IR version 9 and opset version 13


./build.sh --config <Release|Debug|RelWithDebInfo|MinSizeRel> --use_xcode --ios --apple_sysroot iphonesimulator --osx_arch arm64 --apple_deploy_target <minimal iOS version>


./build.sh --config Release --use_xcode --ios --apple_sysroot iphonesimulator --osx_arch arm64 --apple_deploy_target 13.0

ORT_LIB_LOCATION=/Users/Gerry.Wagner/develop/psueng/onnxruntime/build/iOS/Release



## Sample code

```javascript
const stream = await navigator.mediaDevices.getUserMedia({ video: true });
const video = document.querySelector('video');
video.srcObject = stream;

const canvas = document.createElement('canvas');
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;
canvas.getContext('2d').drawImage(video, 0, 0);
const base64Image = canvas.toDataURL('image/png').split(',')[1]; // Remove prefix

await window.__TAURI__.invoke("save_captured_image", { imageData: base64Image });
```

```rust
#[tauri::command]
fn save_captured_image(image_data: String) -> Result<(), String> {
    let bytes = base64::decode(image_data).map_err(|e| e.to_string())?;
    std::fs::write("captured_image.png", bytes).map_err(|e| e.to_string())?;
    Ok(())
}
```



