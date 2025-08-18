# 1 Classifi-Cam - Architecture & Design

## 1.1 Revision History

<div style="display: flex; justify-content: center;"><div style="font-size: 0.9em; max-width:95%; line-height:1.4">

| <div style="width:300px; ">Description</div> | Date      | Author                                      |
| :------------------------------------------- | --------- | :------------------------------------------ |
| Initial Release                              | 17-Aug-25 | Gerry Wagner, Victoria Reyna, Thomas Smiley |

</div></div>

## 1.2 Purpose and Scope

This architecture and design document defines the structure, components, and interactions of the Classifi-Cam system—a cross-platform, privacy-conscious, and extensible AI-powered image classification application. The purpose is to guide the development of a solution that enables users to capture, analyze, and manage visual content using domain-specific AI models, while maintaining control over their data and device resources.

The scope includes:
- Supporting intelligent object detection and classification across customizable domains (e.g., food, plants, documents).
- Ensuring consistent, high-performance operation on iOS, Android, macOS, Windows, and Linux, leveraging hardware acceleration where available.
- Providing offline-first functionality and robust privacy controls, so users can operate independently of cloud services.
- Enabling extensibility through a plugin-based model system for installing and managing custom AI models.
- Facilitating integration with third-party apps and cloud storage (Google Drive, iCloud Drive), and supporting export of results in standard formats.
- Delivering user-centric features for browsing classification history, viewing metadata, and filtering results.
- Maintaining security, auditing, and compliance with data protection regulations (e.g., GDPR).
- Addressing non-functional requirements such as availability, deployability, energy efficiency, integrability, modifiability, performance, safety, security, testability, and usability.
- Operating within constraints such as use of Rust, Svelte, Tauri, ONNX, ORT, plugin extensibility, offline capability, and hardware acceleration.

## 1.3 Document Organization

This document is organized into the following sections:

- **1 Document**, provides information about this document and its intended audience
- **2 System Overview**, provides business goals, system context, functions, non-functional requirements, constraints, and concerns
- **3 Domain Modeling**, expands use cases, derives conceptual classes, and develops the domain model 
- **4 Viewpoints**, describes the architectural viewpoints related to stakeholder concerns
- **5 Views**, presents each viewpoint, with associated elements, diagrams, relations, and behaviors
- **6 Mapping Between Views**, describes how the views relate to each other
- **7 Rationale**, explains how the overall architecture / design achieves the requirements and why it was chosen

## 1.4 Stakeholder Representation

The table below lists the key stakeholders and their primary concerns, based on system actors and business goals.

<div style="display: flex; justify-content: center;"><div style="font-size: 0.9em; max-width:85%; line-height:1.4">

| Stakeholder                     | Concerns                                                                                                                                                                                                                                                        |
| :------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| End Users                       | - Privacy and control over personal data<br>- Usability and intuitive interfaces<br>- Reliable offline operation<br>- Fast and accurate image classification<br>- Ability to manage history, favorites, and settings                                            |
| Developers                      | - Extensibility via plugin-based model system<br>- Ease of integration and modification<br>- Use of modern, safe, and efficient technologies (Rust, Svelte, Tauri)<br>- Clear APIs and documentation<br>- Support for hardware acceleration and cross-platform deployment |
| QA & Test Engineers             | - Comprehensive self-tests and reporting<br>- Repeatable and reliable image processing<br>- Clear error diagnostics and logging<br>- Traceability and maintainability of modifications                                                                         |
| Privacy & Security Officers     | - Strong access control and encryption<br>- Auditing and logging for compliance<br>- Adherence to data protection regulations (e.g., GDPR)<br>- Secure deployment and update processes                                                                         |
| Cloud Service Providers         | - Seamless integration with cloud storage<br>- Secure data synchronization and access controls                                                                                                                           |
| Third-Party Model Developers    | - Ability to publish and manage domain-specific AI models<br>- Compatibility and interoperability (ONNX, PyTorch)<br>- Clear guidelines for model lifecycle management                                                 |
| Platform Owners (App Stores)    | - Compliance with platform policies<br>- Reliable deployment and update mechanisms<br>- Energy efficiency and resource usage                                                                                            |

</div></div>

## 1.5 Viewpoint Definitions

The following table outlines the relevant architectural viewpoints and information needs for key stakeholders, in accordance with IEEE 1016, ISO/IEC/IEEE 42010, and the 4+1 viewpoints approach.

<div style="display: flex; justify-content: center;"><div style="font-size: 0.9em; max-width:85%; line-height:1.4">

| Stakeholder                  | Relevant Viewpoints           | Information Needs                                                                                                                                                                                                 |
| :--------------------------- | :---------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| End Users                    | Logical, Scenarios, Physical  | - User workflows and interfaces<br>- Privacy controls and offline capabilities<br>- History and favorites management<br>- Error handling and feedback mechanisms                                                  |
| Developers                   | Logical, Development, Process | - System architecture and extensibility<br>- Plugin and model integration points<br>- APIs, data flows, and lifecycle management<br>- Hardware acceleration and cross-platform deployment                         |
| QA & Test Engineers          | Logical, Process, Scenarios   | - Test case definitions and coverage<br>- Self-test and reporting mechanisms<br>- Error diagnostics and logging<br>- Traceability and maintainability of changes                                                  |
| Privacy & Security Officers  | Logical, Physical, Process    | - Security architecture and controls<br>- Auditing and logging mechanisms<br>- Compliance with data protection regulations<br>- Deployment and update processes                                                   |
| Cloud Service Providers      | Physical, Scenarios           | - Integration architecture for cloud storage<br>- Data synchronization flows<br>- Access control and security mechanisms                                                                                         |
| Third-Party Model Developers | Logical, Development          | - Model plugin architecture<br>- Guidelines for model lifecycle management<br>- Compatibility and interoperability requirements                                                                                   |
| Platform Owners              | Physical, Process             | - Deployment and update mechanisms<br>- Resource usage and energy efficiency<br>- Compliance with platform policies and regulations                                                                                 |

</div></div>