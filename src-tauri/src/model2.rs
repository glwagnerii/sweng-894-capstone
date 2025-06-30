use anyhow::{Context, Result};
use usls::{
    models::YOLO, Annotator, Config, Style, Version,
    NAMES_COCO_80, Color, Image as UslsImage,
};
use std::{fs::File, io::Write, path::Path};
use base64::{engine::general_purpose, Engine as _};
use image::ImageReader;

pub fn infer_from_image_path(image_path: &str, model_path: &str) -> Result<String> {
    let dyn_img = image::open(image_path)
        .with_context(|| format!("Failed to open image: {image_path}"))?;

    let rgb_img = dyn_img.to_rgb8();
    let (width, height) = rgb_img.dimensions();
    let bytes = rgb_img.into_raw(); // Convert image to Vec<u8>

    let img = UslsImage::from_u8s(&bytes, width, height)?;
    let batch = vec![img.clone()];

    let mut config = Config::yolo()
        .with_model_file(model_path)
        .with_task("det".parse()?)
        .with_model_dtype("auto".parse()?)
        .with_model_device("cpu:0".parse()?)
        .with_scale("n".parse()?)
        .with_version(Version::new(8, 0))
        .with_class_names(&NAMES_COCO_80)
        .with_model_num_dry_run(1)
        .with_class_confs(&[0.25]);

    let mut model = YOLO::new(config.commit()?)?;
    let preds = model.forward(&batch)?;

    let annotator = Annotator::default().with_hbb_style(
        Style::hbb()
            .with_draw_fill(true)
            .with_palette(&Color::palette_coco_80()),
    );

    let out_dir = Path::new("runs").join(model.spec());
    std::fs::create_dir_all(&out_dir)?;
    let out_path = out_dir.join(format!("{}.jpg", usls::timestamp(None)));

    for (x, y) in batch.iter().zip(preds.iter()) {
        annotator.annotate(x, y)?.save(&out_path)?;
    }

    Ok(out_path.to_string_lossy().to_string())
}

pub fn infer_from_base64(base64: &str, model_path: &str) -> Result<String> {
    let bytes = general_purpose::STANDARD
        .decode(base64)
        .with_context(|| "Invalid base64 image")?;

    let tmp_path = "resources/images/bus.jpg";
    let mut file = File::create(tmp_path)?;
    file.write_all(&bytes)?;
    infer_from_image_path(tmp_path, model_path)
}
