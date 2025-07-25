# Classifi-Cam: Algorithmic Component Proposal

**SWENG 894 Capstone - Group 5:** Victoria Reyna, Thomas Smiley, Gerald Wagner

---

## 1. Product Overview

**Classifi-Cam** is a cross-platform, AI-powered image classification application. Its core purpose is to enable users to capture, analyze, and explore visual content using domain-specific AI models, while maintaining full control over their data and device resources. The application is designed for iOS, Android, macOS, Windows, and Linux, leveraging Rust for backend logic, Svelte for the frontend, and the Tauri framework for deployment.

**Planned Features:**
- Capture or open images from camera, photo library, or cloud storage.
- Detect and classify objects in images using customizable AI models (e.g., YOLOv11n in ONNX format).
- Allow users to review, select, and explore detected objects in detail.
- Manage and switch between multiple AI models.
- Sync images and results with cloud storage (Google Drive, iCloud Drive).
- Export classification results in standard formats (JSON, CSV).
- Provide a user-friendly interface for browsing classification history and configuring app settings.
- Ensure offline-first operation, privacy, and extensibility via a plugin-based model system.

## 2. Algorithmic Solution Specification

### 2.1 Overview

The **significant algorithmic component** of Classifi-Cam is its AI-powered object detection and classification pipeline, implemented in Rust (`model.rs`). This pipeline leverages the YOLOv11n model in ONNX format, executed via the ORT (ONNX Runtime) Rust crate. The algorithmic flow includes image preprocessing, model inference, and postprocessing (including non-maximum suppression), all optimized for performance and extensibility.

### 2.2 Flow of Operations

**1. Image Preprocessing**
- Resize the input image to the model’s expected dimensions (640x640), preserving aspect ratio and applying padding as needed.
- Convert the image to a normalized tensor suitable for model input.

**2. Model Inference**
- Load the ONNX model (YOLOv11n) and associated label metadata.
- Run the model on the preprocessed image tensor using ONNX Runtime, optionally leveraging hardware acceleration (CUDA, Metal).

**3. Postprocessing**
- Parse the model output to extract bounding boxes and class probabilities.
- Apply a probability threshold to filter out low-confidence detections.
- Perform Non-Maximum Suppression (NMS) to eliminate overlapping boxes, ensuring only the most relevant detections are kept.
- Map detected class indices to human-readable labels.

**4. Result Generation**
- Return a list of detected objects, each with class label, confidence score, and bounding box coordinates.

### 2.3 Detailed Algorithm Techniques

In addition to selecting Rust, ONNX Runtime, and the YOLOv11n model, it will be essential to profile and optimize the speed of the core logic to ensure good performance across platforms. This involves:

- **Profiling the Pipeline:** Measuring the time spent in each stage (preprocessing, inference, postprocessing) to identify bottlenecks.
- **Image Preprocessing Optimization:** Evaluating and benchmarking different libraries and methods for resizing and padding images (e.g., evaluating `image`, `opencv`, or hardware-accelerated routines) to minimize latency while maintaining input quality.
- **Tensor Creation:** Exploring efficient ways to convert image data into tensors, including memory layout optimizations and minimizing unnecessary data copies.
- **Postprocessing Techniques:** Testing and tuning various implementations of postprocessing steps such as thresholding and Non-Maximum Suppression (NMS), possibly leveraging parallelism or SIMD instructions where available.
- **Hardware Acceleration:** Where possible, enabling hardware acceleration (e.g., CUDA, Metal) for both inference and preprocessing steps.
- **Caching:** Implementing caching strategies for model loading, preprocessed images, or intermediate results to avoid redundant computation and reduce latency where appropriate.

By systematically profiling and refining each component, we can ensure the algorithmic pipeline delivers the required speed and responsiveness for a good user experience with the application.

### 2.5 Process Flow Diagram
The process flow below illustrates how Classifi-Cam handles user interactions, image inference, and result display. It shows the sequence from image selection and AI-powered detection to presenting bounding boxes and recipe details in the app. Each step highlights the integration between the frontend, backend, and state management.

1. **Camera View**  or **Library View** --> button click --> convert image to base64 --> invoke the inference function
2. **Invoke (infer_base64)** --> rust backend function receives base64 from frontend and returns Detections[ ] array
3. **Results View** --> displays original image with svg overlay showing bounding boxes, and list of class buttons
4. **Matches View** --> after a class (ingredient) is clicked, call external API and show grid of returned recipes as cards
5. **Details View** --> after a recipe is clicked, call external API and show the full recipe w/ instructions and ingredients

The rust infer_base64 command is called by the frontend using Tauri's ivoke function (@tauri-apps/api/core), and passing the converted image's base64 string.  The inference returns a Detection array which includes the class, confidence and bounding box (top, left, width, height) of each detected object.

Application main view management is implemented by a ViewContainer that uses app state ("view.selected") to automatically display the correct, selected view.  App state is implemented with Redux and Svelte stores.  API calls are also implemented in Redux via RTKQuery.  The return type of the API's is a Meal or Meal array which includes the id, name, thumbnail, instructions, and ingredients.

<div style="display: flex; justify-content: center;"><div style="font-size: 0.9em; max-width:80%; line-height:1.4">

![Process Flow Diagram](../../images/infer-flow.svg)

</div></div>

The core logic is implemented in [`model.rs`](../../../../src-tauri/src/model.rs), specifically in the `YoloModelSession` struct and its methods:
- `infer`: Orchestrates preprocessing, model inference, and postprocessing.
- `preprocess`: Handles image resizing, padding, and tensor conversion.
- `postprocess`: Applies thresholds, NMS, and label mapping to model outputs.

### 2.5 Sample Process Flow Desription with Images
The user can begin by selecting an image in the Library View, which is then analyzed and the Results View is opened to display detected objects with bounding boxes. By clicking on a detected class (ingredient), the Matches View presents a grid of relevant recipes retrieved from an external API. Selecting a recipe leads to the Details View, where the full recipe—including instructions and ingredients and even a YouTube video—is shown to the user to begin cooking.

![Process Flow Images](../../images/flow-images.png)


### 2.6 Architecture Diagram
Below is the Classifi-Cam achitecture diagram.

![Architecture Diagram](../../images/arch.svg)

## 3. Rationale for the Solution

### 3.1 What is Proposed

The algorithmic component is a **modular, high-performance object detection and classification pipeline** based on the YOLOv11n model in ONNX format, implemented in Rust. It includes all steps from image preprocessing to postprocessing, with support for hardware acceleration and extensibility for new models.

### 3.2 Summary of AI Model Deployment Frameworks Evaluated
After reviewing the possible frameworks, we chose to go with ONNX Runtime and the ort crate because it supports all major platforms and provides available Rust support that can be leveraged by Tauri. Additionally, the ONNX format is well-established and popular, and models can easily be exported from PyTorch.

<div style="display: flex; justify-content: center;"><div style="font-size: 0.9em; max-width:85%; line-height:1.4">

| Framework          | Primary Supporter      | Supported Platforms                        | Primary Language     | Rust Support        |
|---------------------|-----------------------|--------------------------------------------|----------------------|---------------------|
| **ONNX Runtime**    | Microsoft             | Windows, Linux, macOS, iOS, Android        | C/C++                | Yes (ort crate)     |
| **TensorFlow Lite** | Google                | Android, iOS, Linux, Windows, macOS, Edge  | C++                  | Limited (community) |
| **Core ML**         | Apple                 | iOS, macOS, iPadOS, watchOS, tvOS          | Swift/Objective-C    | No (FFI possible)   |
| **TensorRT**        | NVIDIA                | Linux, Windows (NVIDIA GPUs only)          | C++                  | No (FFI possible)   |
| **TorchScript**     | Meta (Facebook)       | Windows, Linux, macOS, iOS, Android        | Python/C++           | No (FFI possible)   |
| **DirectML**        | Microsoft             | Windows 10/11 (DirectX 12 GPUs)            | C++                  | No (FFI possible)   |

</div></div>

### 3.3 Detection and Classification Model Comparison

Below is a comparison of leading detection with classification model families considered for Classifi-Cam. These models are widely used in research and industry, and each offers a different balance of speed, accuracy, architecture, and user/community support.

<div style="display: flex; justify-content: center;"><div style="font-size: 0.9em; max-width:85%; line-height:1.4">

| Model Family      | 1- or 2-Stage | Speed           | Accuracy         | Model Size (COCO) | User/Community Support      |
|-------------------|---------------|-----------------|------------------|----------------------------------------|----------------------------|
| **YOLOv11n**      | 1-stage       | Very Fast       | High             | ~7-12 MB                               | Very strong, many tutorials, active forums, supported by Ultralytics and open-source community |
| **Faster R-CNN (Detectron2)** | 2-stage       | Moderate        | Very High        | ~170–250 MB                             | Strong, research/industry, many pretrained models, active GitHub, supported by Meta (Facebook) |
| **EfficientDet**  | 1-stage       | Fast            | High             | ~52 MB                                  | Good, growing, supported by Google, TFLite/ONNX export      |
| **RetinaNet**     | 1-stage       | Moderate        | High             | ~145 MB                                 | Good, supported in Detectron2, Keras, PyTorch, backed by Meta (Facebook) and community         |

</div></div>

- **1-Stage:** Directly predicts bounding boxes and classes in a single pass (faster, often used for real-time).
- **2-Stage:** First proposes regions, then classifies/refines them (higher accuracy, slower).

**Summary:**  
YOLOv11n was chosen for Classifi-Cam due to its excellent balance of speed, accuracy, compact model size, ease of deployment (especially ONNX export), and strong user support.

### 3.4 Rust Image Resizing Libraries
To optimize image preprocessing performance, several Rust image resizing libraries will be evaluated, each offering different trade-offs in speed, quality, and ease of integration:

<div style="display: flex; justify-content: center;"><div style="font-size: 0.9em; max-width:85%; line-height:1.4">

| Library              | Speed         | Quality         | Popularity / Maintenance         | Notes                                      |
|----------------------|--------------|-----------------|----------------------------------|--------------------------------------------|
| **image**            | Moderate     | Good            | Most popular, well-maintained    | General-purpose, easy to use, many features|
| **fast_image_resize**| Very Fast    | High            | Actively maintained, growing     | SIMD-accelerated, focused on resizing      |
| **resize**           | Fast         | High            | Less popular, maintained         | Pure Rust, simple API, focused on resizing |
| **fir**              | Fast         | Very High       | Less popular, maintained         | High-quality, supports SIMD, focused on resizing |

</div></div>

OpenCV was not considered because it requires pre-installed native libraries on the host device or computer and has a relatively large library size, making it less suitable for lightweight, cross-platform deployment.

### 3.5 Input Tensor Creation Techniques - Rust Libraries
To further optimize the pipeline, several methods for converting images into input tensors will be evaluated. Each technique offers different trade-offs in speed, parallelism, and suitability for various image sizes and workloads:

<div style="display: flex; justify-content: center;"><div style="font-size: 0.9em; max-width:85%; line-height:1.4">

| Method                   | Speed         | Parallelism      | Typical Use Case                        | Notes                                                      |
|--------------------------|--------------|------------------|-----------------------------------------|------------------------------------------------------------|
| **enumerate_pixels**     | Slow         | No               | Simple, small images                    | Iterates pixel-by-pixel; not optimized for performance      |
| **ndarray::Zip**         | Fast         | No               | Most image-to-tensor conversions        | Efficient, good for medium sized multi-dimensional data             |
| **ndarray::parallel**    | Fastest      | Yes (Rayon)      | Large images, high-performance needs    | Uses Rayon for parallelism; best for large data |

</div></div>

### 3.6 Measuring Performance of `infer_base64`

To ensure the `infer_base64` function meets the application's speed and responsiveness targets, a systematic approach to performance measurement will be implemented:

- **Timing Each Stage:** The Rust backend (`model.rs`) already profiles the main stages—preprocessing, inference, and postprocessing—using `Instant::now()` and prints timing statistics for each. These timings will be logged and optionally exposed to the frontend for analysis.
- **End-to-End Latency:** The total time from receiving the base64 image to returning the detection results will be measured. This includes decoding, preprocessing, model inference, and postprocessing.
- **Profiling Tools:** Rust's built-in timing (e.g., `std::time::Instant`) will be supplemented with external profilers (such as `cargo-flamegraph` or `perf` on Linux/macOS) to identify bottlenecks and optimize hot paths.
- **Frontend Integration:** The frontend can record the time from invoking the Tauri command to receiving results, providing a user-perceived latency metric.
- **Metrics Tracked:**
  - Preprocessing time (resize, pad, tensor conversion)
  - Model inference time (ONNX Runtime)
  - Postprocessing time (NMS, label mapping)
  - Total pipeline time
  - Throughput (images/sec, for batch or repeated calls)
- **Reporting:** Performance metrics can be collected during development and testing, and summarized in logs or reports. Unit tests can include timing checks so that performance does not degrade over time.


### 4. Fit with Product Context
After evaluation and selecting the most suitable frameworks and libraries for model deployment, image preprocessing, and tensor creation, we also need to consider how the technical choices support the Classifi-Cam requirements. The following section explains how the algorithmic pipeline aligns with the product context.

- **Core Functionality:** Enables the primary use case of detecting and classifying objects in user images
- **Extensibility:** The modular design allows easy integration of new models and plugins
- **Performance:** Optimized for real-time or near-real-time inference on a wide range of devices, leveraging hardware acceleration where available
- **Privacy:** All processing is performed locally, supporting offline-first and privacy-respecting operation
- **Quality Attributes:** Addresses Classifi-Cam requirements for modifiability, testability, and security

### 4.1 Importantance of the Flow and Algorithm

- **Added Value:** The algorithmic pipeline drives the primary use cases of the application, transforming raw images into useful information for users.
- **Differentiation:** By supporting pluggable models and efficient local inference, Classifi-Cam differentiates itself from generic image viewers or cloud-dependent AI apps.
- **User Empowerment:** Enables users to choose or even create their own domain-specific models, and customize the detection results
- **Scalability:** The approach allows for future features, including new models, hardware backends, and integrations.

---

## 5. Conclusion

This algorithmic pipeline describes the foundation for Classifi-Cam’s object detection and classification features. By combining efficient Rust-based preprocessing, ONNX Runtime inference, and optimized processing, the system enables very fast analysis of user images entirely on-device. This approach supports the app’s privacy goals, allows users to work offline, and also makes it easy to add new models or hardware backends in the future. Integrations with local apps or web based API's are possible, but only limitted text content is shared (not images).  The design choices—such as modular components, hardware acceleration, and support for pluggable models—directly address the needs for extensibility, performance, and user control.