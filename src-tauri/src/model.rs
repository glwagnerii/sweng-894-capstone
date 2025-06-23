use std::borrow::Cow;
use std::fs::File;
use std::io::Read;
use std::path::Path;
use std::collections::BTreeMap;
use serde::Deserialize;

use ndarray::{s};

use ort::{ session::{Session, SessionOutputs}, value::TensorRef };

/// The YOLO model session.
///
/// Wraps an ONNX runtime session and YOLO labels, with configurable thresholds.
#[derive(Debug)]
pub struct YoloModelSession {
    session: ort::session::Session,
    labels: Vec<Cow<'static, str>>,
    prob_thresh: f32,
    iou_thresh: f32,
    onnx_path: String,
    yaml_path: Option<String>,
}

#[derive(serde::Serialize)]
pub struct Detection {
    pub class: String,
    pub score: f32,
    pub bbox: [f32; 4], // [x, y, width, height]
}

impl YoloModelSession {
    /// Create a new YoloModelSession loading ONNX model and optionally labels from file paths.
    /// 
    /// - `onnx_path`:   required ONNX model path
    /// - `yaml_path`:   optional YAML labels path -> labels = Vec::new() if no path provided
    /// - `prob_thresh`: optional (0.5) -> Filters out low-confidence detections.
    /// - `iou_thresh`:  optional (0.7) -> Controls how much overlap is allowed between boxes before suppression.
    pub fn new(
        onnx_path: impl AsRef<Path>,
        yaml_path: Option<impl AsRef<Path>>,
        prob_thresh: Option<f32>,
        iou_thresh: Option<f32>,
    ) -> Result<Self, YoloError> {
        let onnx_path_str = onnx_path.as_ref().to_string_lossy().to_string();
        let yaml_path_str = yaml_path
            .as_ref()
            .map(|p| p.as_ref().to_string_lossy().to_string());

        let builder = Session::builder()
            .map_err(|e| YoloError::Custom(format!("Failed to create session builder: {}", e)))?;
        let session = builder
            .commit_from_file(&onnx_path)
            .map_err(|e| YoloError::Custom(format!("Failed to load ONNX model: {e}")))?;
        let labels = if let Some(yaml) = yaml_path {
            load_labels_from_yaml(yaml)?
        } else {
            Vec::new()
        };

        Ok(Self {
            session,
            labels,
            prob_thresh: prob_thresh.unwrap_or(0.5),
            iou_thresh: iou_thresh.unwrap_or(0.7),
            onnx_path: onnx_path_str,
            yaml_path: yaml_path_str,
        })
    }

    /// Getters
    pub fn labels(&self) -> &[Cow<'static, str>]    { &self.labels }
    pub fn prob_thresh(&self) -> f32                { self.prob_thresh }
    pub fn iou_thresh(&self) -> f32                 { self.iou_thresh }
    pub fn session(&self) -> &ort::session::Session { &self.session }
    pub fn onnx_path(&self) -> &str                 { &self.onnx_path }
    pub fn yaml_path(&self) -> Option<&str>         { self.yaml_path.as_deref() }

    /// Setters
    pub fn set_prob_thresh(&mut self, value: f32)                { self.prob_thresh = value }
    pub fn set_iou_thresh(&mut self, value: f32)                 { self.iou_thresh = value }
    pub fn set_labels(&mut self, labels: Vec<Cow<'static, str>>) { self.labels = labels }

    /// Preprocess image: resize with aspect ratio, pad, and convert to input tensor
    fn preprocess(&self, image: &image::DynamicImage) -> Result<(ndarray::Array4<f32>, f32, u32, u32), YoloError> {
        use ndarray::Array4;
        use image::imageops::FilterType;
        use image::{RgbaImage, GenericImage};

        let (input_w, input_h) = (640, 640); // Set to yolo expected input size
        let orig_w = image.width() as f32;
        let orig_h = image.height() as f32;

        // Calculate scale and padding to preserve aspect ratio
        let scale = f32::min(input_w as f32 / orig_w, input_h as f32 / orig_h);
        let new_w = (orig_w * scale).round() as u32;
        let new_h = (orig_h * scale).round() as u32;
        let pad_w = input_w - new_w;
        let pad_h = input_h - new_h;
        let pad_left = pad_w / 2;
        let pad_top = pad_h / 2;

        // Resize with aspect ratio
        let resized = image.resize_exact(new_w, new_h, FilterType::CatmullRom);
        let mut padded = RgbaImage::from_pixel(input_w, input_h, image::Rgba([0, 0, 0, 255]));
        padded.copy_from(&resized.to_rgba8(), pad_left, pad_top)
            .map_err(|e| YoloError::Custom(format!("Failed to pad image: {e}")))?;

        // Prepare input tensor: [1, 3, H, W]
        let mut input = Array4::<f32>::zeros((1, 3, input_h as usize, input_w as usize));
        for (x, y, pixel) in padded.enumerate_pixels() {
            let [r, g, b, _] = pixel.0;
            input[[0, 0, y as usize, x as usize]] = r as f32 / 255.0;
            input[[0, 1, y as usize, x as usize]] = g as f32 / 255.0;
            input[[0, 2, y as usize, x as usize]] = b as f32 / 255.0;
        }

        Ok((input, scale, pad_left, pad_top))
    }

    // pub fn infer(&self) -> Result<Vec<Detection>, YoloError> {
    pub fn infer(&mut self, image: &image::DynamicImage) -> Result<Vec<Detection>, YoloError> {
        use ndarray::{Axis};

        // Preprocess image
        let (input, scale, pad_left, pad_top) = self.preprocess(image)?;
        let orig_w = image.width() as f32;
        let orig_h = image.height() as f32;

        // Run inference
        let input_name = self.session.inputs[0].name.clone();
        let input_tensor = TensorRef::from_array_view(&input)
            .map_err(|e| YoloError::Custom(format!("Failed to create input tensor: {e}")))?;
        let outputs: SessionOutputs = self.session.run(vec![(input_name.as_str(), input_tensor)])
            .map_err(|e| YoloError::Custom(format!("ONNX inference failed: {e}")))?;

        // Assume YOLOv11 output: [1, N, 4+num_classes] (N = number of predictions)
        let output = outputs[0]
            .try_extract_array::<f32>()
            .map_err(|e| YoloError::Custom(format!("Failed to extract output: {e}")))?;

        let output = output.index_axis(Axis(0), 0); // shape: [N, 4+num_classes]
        println!("YOLO output shape: {:?}", output.shape());
        for (i, row) in output.outer_iter().enumerate().take(5) {
            println!("Output row {i}: {:?}", row);
        }

        let output = output.t().to_owned();
        let output = output.into_dimensionality::<ndarray::Ix2>()
            .map_err(|e| YoloError::Custom(format!("Failed to convert output to 2D array: {e}")))?;
        // End the mutable borrow of self here by dropping output and outputs
        drop(outputs);

        let detections = self.postprocess(&output, scale, pad_left, pad_top, orig_w, orig_h);

        Ok(detections)
    }

    /// Postprocess YOLO output: filter, rescale, and NMS
    pub fn postprocess(&self, output: &ndarray::Array2<f32>, scale: f32, pad_left: u32, pad_top: u32, orig_w: f32, orig_h: f32) -> Vec<Detection> {
        use ndarray::s;
        let mut boxes = Vec::new();
        for row in output.outer_iter() {
            let bbox = &row.slice(s![0..4]);
            let class_scores = &row.slice(s![4..]);
            let (class_id, class_conf) = class_scores
                .iter()
                .enumerate()
                .max_by(|a, b| a.1.partial_cmp(b.1).unwrap())
                .unwrap();
            let score = *class_conf;
            if score < self.prob_thresh {
                continue;
            }
            // Python logic: remove padding, then divide by scale (gain)
            let x = (bbox[0] - pad_left as f32) / scale;
            let y = (bbox[1] - pad_top as f32) / scale;
            let w = bbox[2] / scale;
            let h = bbox[3] / scale;
            let left = x - w / 2.0;
            let top = y - h / 2.0;
            let left = left.max(0.0).min(orig_w);
            let top = top.max(0.0).min(orig_h);
            let width = w.max(0.0).min(orig_w - left);
            let height = h.max(0.0).min(orig_h - top);
            let label = self.labels.get(class_id)
                .map(|c| c.to_string())
                .unwrap_or_else(|| format!("class_{class_id}"));
            boxes.push((
                [left, top, width, height],
                label,
                score,
            ));
        }
        // Sort by score descending
        boxes.sort_by(|a, b| b.2.partial_cmp(&a.2).unwrap());
        // Non-Maximum Suppression (NMS)
        let mut result = Vec::new();
        let mut used = vec![false; boxes.len()];
        for i in 0..boxes.len() {
            if used[i] { continue; }
            let (bbox_i, label_i, score_i) = &boxes[i];
            result.push(Detection {
                class: label_i.clone(),
                score: *score_i,
                bbox: *bbox_i,
            });
            for j in (i+1)..boxes.len() {
                if used[j] { continue; }
                let (bbox_j, _, _) = &boxes[j];
                if iou(bbox_i, bbox_j) > self.iou_thresh {
                    used[j] = true;
                }
            }
        }
        result
    }
}

impl AsRef<ort::session::Session> for YoloModelSession {
    fn as_ref(&self) -> &ort::session::Session { &self.session }
}

// --- YAML label loading helper ---

#[derive(Debug, Deserialize)]
struct YamlLabels {
    names: BTreeMap<u32, String>,
}

fn load_labels_from_yaml(yaml_path: impl AsRef<Path>) -> Result<Vec<Cow<'static, str>>, YoloError> {
    let mut file = File::open(yaml_path.as_ref())
        .map_err(|e| YoloError::Custom(format!("Failed to open YAML file: {e}")))?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .map_err(|e| YoloError::Custom(format!("Failed to read YAML file: {e}")))?;
    let parsed: YamlLabels = serde_yaml::from_str(&contents)
        .map_err(|e| YoloError::Custom(format!("Failed to parse YAML: {e}")))?;
    let mut names: Vec<(u32, String)> = parsed.names.into_iter().collect();
    names.sort_by_key(|(idx, _)| *idx);
    Ok(names.into_iter().map(|(_, name)| Cow::Owned(name)).collect())
}

#[derive(Debug)]
pub enum YoloError { Custom(String) }

impl std::fmt::Display for YoloError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self { YoloError::Custom(msg) => write!(f, "{}", msg) }
    }
}

fn iou(b1: &[f32; 4], b2: &[f32; 4]) -> f32 {
    let (x1, y1, w1, h1) = (b1[0], b1[1], b1[2], b1[3]);
    let (x2, y2, w2, h2) = (b2[0], b2[1], b2[2], b2[3]);
    let (xa1, ya1, xa2, ya2) = (x1, y1, x1 + w1, y1 + h1);
    let (xb1, yb1, xb2, yb2) = (x2, y2, x2 + w2, y2 + h2);

    let inter_x1 = xa1.max(xb1);
    let inter_y1 = ya1.max(yb1);
    let inter_x2 = xa2.min(xb2);
    let inter_y2 = ya2.min(yb2);

    let inter_w = (inter_x2 - inter_x1).max(0.0);
    let inter_h = (inter_y2 - inter_y1).max(0.0);
    let inter_area = inter_w * inter_h;
    let area1 = w1 * h1;
    let area2 = w2 * h2;
    inter_area / (area1 + area2 - inter_area + 1e-6)
}

