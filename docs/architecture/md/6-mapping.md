# 6 Mapping Between Views

## 6.1 Introduction

This section describes the relationships and correspondences between the architectural views presented in Section 5: Logical, Process, Development, Physical, and Scenario. Mapping between views ensures consistency, traceability, and completeness of the architecture, and supports validation and testing of system requirements. The tables below show how elements, responsibilities, and interfaces in one view relate to those in others.

## 6.2 General Relations Among Views

Each architectural view provides a distinct perspective on the Classifi-Cam system:

- **Logical View** defines the main software components, their responsibilities, and interfaces.
- **Process View** describes dynamic behavior, concurrency, and data/control flows.
- **Development View** details the organization of source code, layers, and modules.
- **Physical View** shows deployment and allocation of software elements to hardware and execution environments.
- **Scenario View** illustrates end-to-end workflows and validates system behavior against requirements.

Mappings between views ensure that logical components are realized in code, deployed appropriately, participate in required processes, and fulfill user scenarios.

## 6.3 View-to-View Mapping Tables

### 6.3.1 Logical ↔ Process Mapping

<div style="display: flex; justify-content: center;"><div style="font-size: 0.8em; max-width:85%; line-height:1.4">

| Logical Component         | Process Element/Thread           | Responsibility Mapping                                   | Functional Responsibility                |
|--------------------------|----------------------------------|---------------------------------------------------------|------------------------------------------|
| Camera/Library View      | Frontend Main Thread             | UI for image input, triggers process flows              | Image capture and selection              |
| Results/Matches/Details  | Frontend Main Thread             | UI for result display, recipe exploration               | Display and exploration of results       |
| State Manager (Redux)    | Redux Store Thread               | State management, event handling                        | Manage application state                 |
| Tauri Bridge             | Tauri Bridge Thread              | IPC between frontend and backend                        | Communication between UI and backend     |
| Backend (Rust)           | Rust Backend Thread              | AI inference, image processing                          | Object detection and classification      |
| Recipe API               | External API Thread              | Recipe data retrieval                                   | Fetch recipe information                 |

</div></div>

### 6.3.2 Logical ↔ Development Mapping

<div style="display: flex; justify-content: center;"><div style="font-size: 0.8em; max-width:85%; line-height:1.4">

| Logical Component         | Development Module/Layer         | Responsibility Mapping                                   | Functional Responsibility                |
|--------------------------|----------------------------------|---------------------------------------------------------|------------------------------------------|
| Camera/Library View      | `src/components/`, `src/views/`  | Svelte UI components                                    | Image capture and selection              |
| Results/Matches/Details  | `src/components/`, `src/views/`  | Svelte UI components                                    | Display and exploration of results       |
| State Manager (Redux)    | `src/store/`                     | Redux store and slices                                  | Manage application state                 |
| Tauri Bridge             | `src-tauri/src/lib.rs`           | Tauri command handlers                                  | Communication between UI and backend     |
| Backend (Rust)           | `src-tauri/src/model.rs`         | Model management, inference logic                       | Object detection and classification      |
| Recipe API               | External API client modules      | REST API integration                                    | Fetch recipe information                 |

</div></div>

### 6.3.3 Logical ↔ Physical Mapping

<div style="display: flex; justify-content: center;"><div style="font-size: 0.8em; max-width:85%; line-height:1.4">

| Logical Component         | Physical Element                 | Deployment Mapping                                      | Functional Responsibility                |
|--------------------------|----------------------------------|---------------------------------------------------------|------------------------------------------|
| Frontend Service         | User Device (mobile/computer)     | Deployed as local app or web UI                         | User interaction and presentation        |
| Backend Service          | User Device / Server / Cloud      | Co-located with frontend or remote                      | AI inference and processing              |
| Local Storage            | Device storage                    | Stores images, results                                  | Persist user data locally                |
| Cloud Storage            | iCloud/Google Drive               | Sync/backup                                             | Backup and remote access                 |
| Web Application          | Cloud/Web Host                    | Remote UI                                               | Remote user interaction                  |
| Web Service              | Cloud/Web Host                    | Remote API                                              | Remote data and service access           |

</div></div>

### 6.3.4 Logical ↔ Scenario Mapping

<div style="display: flex; justify-content: center;"><div style="font-size: 0.8em; max-width:85%; line-height:1.4">

| Logical Component         | Scenario Element                 | Workflow Mapping                                        | Functional Responsibility                |
|--------------------------|----------------------------------|---------------------------------------------------------|------------------------------------------|
| Camera/Library View      | Camera View / Library View        | Image selection/capture                                 | Image capture and selection              |
| Backend (Rust)           | Rust Backend (model.rs)           | Inference, preprocessing, postprocessing                | Object detection and classification      |
| Results View             | Results View                      | Display detection results                               | Present results to user                  |
| Matches View             | Matches View                      | Fetch/display related recipes                           | Explore related recipes                  |
| Details View             | Details View                      | Show recipe details                                     | Present recipe details                   |
| Recipe API               | External API                      | Recipe data retrieval                                   | Fetch recipe information                 |

</div></div>

### 6.3.5 Process ↔ Development Mapping

<div style="display: flex; justify-content: center;"><div style="font-size: 0.8em; max-width:85%; line-height:1.4">

| Process Element/Thread   | Development Module/Layer          | Implementation Mapping                                  | Functional Responsibility                |
|--------------------------|-----------------------------------|---------------------------------------------------------|------------------------------------------|
| Frontend Main Thread     | Svelte components, Redux store    | UI, state management                                    | User interaction and presentation        |
| Redux Store Thread       | `src/store/`                      | State slices, reducers                                  | Manage application state                 |
| Tauri Bridge Thread      | `src-tauri/src/lib.rs`            | IPC, command handlers                                   | Communication between UI and backend     |
| Rust Backend Thread      | `src-tauri/src/model.rs`          | Model inference, image processing                       | Object detection and classification      |
| External API Thread      | API client modules                | REST API calls                                          | Fetch recipe information                 |

</div></div>

### 6.3.6 Physical ↔ Development Mapping

<div style="display: flex; justify-content: center;"><div style="font-size: 0.8em; max-width:85%; line-height:1.4">

| Physical Element         | Development Module/Layer          | Deployment Mapping                                      | Functional Responsibility                |
|--------------------------|-----------------------------------|---------------------------------------------------------|------------------------------------------|
| Frontend Service         | Svelte components, Redux store    | Packaged as app/web UI                                  | User interaction and presentation        |
| Backend Service          | Rust backend modules              | Packaged with frontend or deployed remotely             | AI inference and processing              |
| Local Storage            | Device storage integration        | File system, photo library modules                      | Persist user data locally                |
| Cloud Storage            | Cloud API integration             | iCloud/Google Drive modules                             | Backup and remote access                 |
| Web Application          | Web hosting configuration         | Deployed as web app                                     | Remote user interaction                  |
| Web Service              | API hosting configuration         | Deployed as REST API                                    | Remote data and service access           |

</div></div>

### 6.3.7 Scenario ↔ Process Mapping

<div style="display: flex; justify-content: center;"><div style="font-size: 0.8em; max-width:85%; line-height:1.4">

| Scenario Step            | Process Flow                      | Mapping                                                 | Functional Responsibility                |
|--------------------------|-----------------------------------|---------------------------------------------------------|------------------------------------------|
| Image selection/capture  | Startup, Image Inference Pipeline | User triggers image input, starts inference             | Image capture and selection              |
| Inference                | Image Inference Pipeline          | Backend processes image, returns results                | Object detection and classification      |
| Result exploration       | Result Exploration Flow           | UI displays results, user explores objects/recipes      | Present and explore results              |
| Recipe lookup            | API Call                          | Frontend calls external API for recipes                 | Fetch recipe information                 |
| Error handling           | Error Handling Flow               | System manages errors, displays feedback                | Handle errors and provide feedback       |

</div></div>

## 6.4 Mapping for Testing and Validation

Mappings between views support architectural validation and testing by ensuring:

- All logical components are implemented in code and deployed correctly.
- Process flows are supported by the physical and development architecture.
- Scenario workflows are realizable with the defined components and interfaces.
- Traceability from requirements to implementation and deployment is maintained.

Test cases and walkthroughs should verify that each scenario step is supported by the corresponding process, development, and physical elements, and that all interfaces and responsibilities are correctly mapped.

## 6.5 Summary

This mapping section ensures that the Classifi-Cam architecture is internally consistent, traceable, and testable across all views. It supports validation of requirements, guides implementation, and facilitates
