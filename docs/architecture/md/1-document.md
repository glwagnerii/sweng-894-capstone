# 1 Test Automation Framework - Architecture & Design

## 1.1 Revision History

<div style="display: flex; justify-content: center;"><div style="font-size: 0.9em; max-width:85%; line-height:1.4">

| <div style="width:500px; ">Description</div> | Date      | Author       |
| :------------------------------------------- | --------- | :----------- |
| Initial Release                              | 28-Apr-24 | Gerry Wagner |

</div></div>

## 1.2 Purpose and Scope

This architecture and design description provides a high-level blueprint outlining the test automation framework's fundamental structure, components, and interactions. It serves as a roadmap for understanding the overall system organization, design principles, and architectural patterns. This description ensures stakeholder alignment and establishes a foundation for future enhancements and scalability.

The design specifies the framework's implementation details, including functional and non-functional requirements, component responsibilities, data flows, and integration with external systems like the locomotive control software and HIL simulation environment. Crucially, it incorporates domain modeling to represent key concepts and relationships within the locomotive control system, enabling comprehensive test case development and scenario validation.

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
The table below lists the key stakeholders and their primary concerns.

<div style="display: flex; justify-content: center;"><div style="font-size: 0.9em; max-width:85%; line-height:1.4">

| Stakeholder                     | Concerns                                                                                                                                                                                                                                                                                                                    |
| :------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| System Engineers                | - Adherence to overall system architecture and design principles<br>- Support for comprehensive end-to-end testing of locomotive control system software<br>- Seamless integration with existing development and testing tools and processes<br>- Long-term maintenance and scalability of the test automation framework    |
| Controls Engineers              | - Accurate simulation and testing of control logic, algorithms, and calculations<br>- Support for testing various control modes, fault scenarios, and edge cases<br>- Interface and control of HIL hardware components during testing<br>- Definition of comprehensive test cases and scenarios for control system software |
| Principal Engineers             | - Alignment with quality and safety standards for locomotive control systems<br>- Compliance with relevant industry regulations and certification requirements<br>- Successful implementation and adoption across the organization<br>- Cost-effectiveness and return on investment (ROI) evaluation                        |
| Software Developers             | - Compatibility with programming languages and technologies used<br>- Integration into continuous integration and deployment (CI/CD) pipeline<br>- Feedback on framework usability and maintainability                                                                                                                      |
| Test Engineers                  | - Definition and implementation of comprehensive test cases and scenarios<br>- Efficient test execution, reporting, and analysis<br>- Framework usability and effectiveness<br>- Collaboration with stakeholders for continuous improvement and enhancement                                                                 |
| Simulation Engineers            | - Accurate interface and control of HIL simulation environment<br>- Support for testing under various simulated operating conditions and scenarios<br>- Configuration and maintenance of HIL hardware and software components for testing                                                                                   |
| Project Managers                | - Progress monitoring and timely delivery of the framework<br>- Resource allocation and budget management for development and maintenance<br>- Facilitation of communication and collaboration among stakeholders                                                                                                           |
| Quality Assurance (QA) Managers | - Contribution to improving software quality and reliability<br>- Support for comprehensive testing and defect tracking processes<br>- Analysis of test results and reports to identify areas for improvement                                                                                                               |

</div></div>

## 1.5 Viewpoint Definitions
The following table outlines the relevant architectural viewpoints and the information that should be included in the architecture and design document for the test automation framework, in accordance with IEEE 1016 and ISO/IEC/IEEE 42010 standards, and drawing from the 4+1 viewpoints approach proposed by Kruchten.  It lists the relevant viewpoints for key stakeholders.

<div style="display: flex; justify-content: center;"><div style="font-size: 0.9em; max-width:85%; line-height:1.4">

| Stakeholder                     | Relevant Viewpoints           | Information Needs                                                                                                                                                                                             |
| :------------------------------ | :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| System Engineers                | Logical, Physical, Scenarios  | - System architecture overview and design principles<br>- Integration points and interfaces with existing systems<br>- End-to-end testing scenarios and use cases                                             |
| Controls Engineers              | Logical, Scenarios            | - Control logic and algorithm design<br>- Control modes, fault scenarios, and edge case handling<br>- Test case and scenario definitions for control system software                                          |
| Principal Engineers             | Logical, Process, Scenarios   | - Alignment with quality and safety standards<br>- Compliance with regulations and certification requirements<br>- Implementation and adoption plans<br>- Cost-effectiveness and ROI analysis                 |
| Software Developers             | Logical, Development, Process | - Software architecture and design<br>- Integration with CI/CD pipeline<br>- Development processes and workflows<br>- Coding guidelines and best practices                                                    |
| Test Engineers                  | Logical, Process, Scenarios   | - Test case and scenario definitions<br>- Test execution, reporting, and analysis processes<br>- Framework usability and effectiveness considerations<br>- Collaboration and continuous improvement processes |
| Simulation Engineers            | Physical, Scenarios           | - HIL simulation environment architecture and design<br>- Integration with test automation framework<br>- Simulated operating conditions and scenarios                                                        |
| Project Managers                | Process, Development          | - Project plan and timelines<br>- Resource allocation and budget management<br>- Communication and collaboration processes<br>- Risk management and mitigation strategies                                     |
| Quality Assurance (QA) Managers | Process, Scenarios            | - Testing and defect tracking processes<br>- Test result analysis and reporting mechanisms<br>- Quality assurance processes and metrics<br>- Continuous improvement and feedback loops                        |

</div></div>