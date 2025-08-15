# Classifi-Cam

- see /docs/README.md for vscode setup

Classifi-Cam is a cross-platform, privacy-conscious AI-powered image classification application. It enables users to capture, analyze, and explore visual content using customizable domain-specific AI models, while maintaining full control over their data and device resources.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Repository Organization](#repository-organization)
- [Setup & Development](#setup--development)
- [AI Models & Datasets](#ai-models--datasets)
- [Quality Attributes](#quality-attributes)
- [Contributing](#contributing)
- [License](#license)
- [References](#references)

## Features

- Capture or open images from camera, photo library, or cloud storage
- Detect and classify objects in images using customizable AI models (e.g., YOLOv11n in ONNX format)
- Review, select, and explore detected objects in detail
- Manage and switch between multiple AI models
- Sync images and results with cloud storage (Google Drive, iCloud Drive)
- Export classification results in standard formats (JSON, CSV)
- Browse classification history and configure app settings
- Offline-first and privacy-respecting operation

## Architecture

Classifi-Cam is built using:
- **Rust** for backend logic and AI model inference
- **Svelte** for the frontend UI
- **Tauri** for secure, cross-platform desktop deployment

The system supports hardware acceleration (CUDA, Metal) for optimal inference speed and is designed for iOS, Android, macOS, Windows, and Linux.

For detailed architecture and design, see [docs/README.md](docs/README.md) and the [docs/architecture](docs/architecture) folder.

## Repository Organization

- `/src` - Svelte frontend source code
- `/src-tauri` - Rust backend and Tauri configuration
- `/python` - Python scripts, model configs, and dataset YAMLs
- `/docs` - Architecture, design, and project documentation
- `/static` - Static assets (images, icons, etc.)
- `/test` - Test scripts and automation (if present)

See [docs/README.md](docs/README.md) for more details on documentation and organization.

## Setup & Development

### Prerequisites

- Node.js & pnpm
- Rust toolchain
- Python 3.11+
- Tauri CLI

### Install Dependencies

```sh
pnpm install
```

### Build Frontend (Mac)

```sh
pnpm tauri build --bundles app
```

### Run in Development

```sh
pnpm tauri dev
```

See [src-tauri/tauri.conf.json](src-tauri/tauri.conf.json) for build configuration.

### Python Environment

Python dependencies are managed via [pyproject.toml](pyproject.toml):

```sh
uv sync
```

## AI Models & Datasets

- Models: ONNX, PyTorch formats (see `/python` folder)
- Datasets: LVIS, COCO8 (see [`python/lvis.yaml`](python/lvis.yaml), [`python/coco8.yaml`](python/coco8.yaml))

## Quality Attributes

Classifi-Cam is designed for:
- Reliability and availability (offline-first)
- Cross-platform deployability
- Modifiability and extensibility
- Security and privacy
- Performance (hardware acceleration)

See [docs/architecture/md/2.4-qa-req.md](docs/architecture/md/2.4-qa-req.md) for detailed quality attribute requirements.

## Contributing

Please follow the standard Git branching and merge request process. See [docs/README.md](docs/README.md) and [docs/assessments/conops.md](docs/assessments/conops.md) for team procedures and contribution guidelines.

## License

See individual files and [docs/architecture/md/algorithm.md](docs/architecture/md/algorithm.md) for license details.

## References

- [docs/README.md](docs/README.md)
- [docs/architecture/md/algorithm.md](docs/architecture/md/algorithm.md)
- [docs/architecture/md/2.1-goals.md](docs/architecture/md/2.1-goals.md)
