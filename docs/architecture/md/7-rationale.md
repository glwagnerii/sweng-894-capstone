# 7 Rationale

The key objective in designing the architecture for the test automation framework is to create a flexible, scalable, and maintainable system that can efficiently support the testing of locomotive software running on a Hardware-in-the-Loop (HIL) or VSIM environment. The architecture and design incorporates several well-established design patterns and principles to address the various functional and non-functional requirements of the system.

## 7.1 **Layered Architecture**
The test automation framework follows a layered architectural style, which separates the system into distinct layers based on their responsibilities. This promotes separation of concerns, enhances modularity, and improves the maintainability of the system. The layered approach aligns with the SOLID principle of "Dependency Inversion," where higher-level modules (e.g., test execution engine) depend on abstractions provided by lower-level modules (e.g., data collection, reporting), rather than concrete implementations. This decoupling allows for easier replacement or modification of individual components without affecting the overall system.  

**Hardware Abstraction Layer**:
- Provides the lowest-level interface to communicate with the various hardware panels and devices that are part of the HIL environment.
- Includes device drivers, communication protocols, and hardware-specific APIs.
- This layer ensures that the higher-level components are isolated from the complexities of the underlying hardware.

**Device API Layer**:
- Builds upon the Hardware Abstraction Layer to provide a more user-friendly, Pythonic API for interacting with the HIL devices.
- Abstracts away the low-level details and presents a consistent, high-level interface for the upper layers to work with.
- Includes components like device wrappers, data transformation, and error handling.

**Test Automation Feature Layer**:
- Combines the functionality provided by the Device API Layer to implement higher-level test automation features and capabilities.
- Includes components like test case execution, data collection, and result analysis.
- This layer encapsulates the business logic of the test automation framework, providing a clear separation of concerns from the lower-level device interactions.

**Test Execution and Reporting Layer**:
- Responsible for the user-facing components of the test automation framework.
- Includes the test case management, test execution engine, data visualization, and reporting interfaces.
- This layer is responsible for the presentation and interaction with the test engineers and other stakeholders.

## 7.2 Publish-Subscribe
The scenarios view of the architecture incorporates the publish-subscribe pattern, where the interactions between the test automation framework components and external systems (e.g., HIL simulation, data sources) are organized using a publish-subscribe messaging model. Specifically, the framework leverages RTI Connext DDS (Data Distribution Service) for messaging, enabling the automated testing of MCA (Machine Control Application) Application and Platform Messages.

The test automation framework subscribes to the relevant DDS topics published by the MCA Application and Platform components within the HIL simulation environment. This allows the framework to receive and process the MCA messages in real-time, enabling automated testing scenarios such as message validation, data analysis, and fault injection.

Conversely, the framework can also publish DDS messages to simulate specific scenarios or inject test data into the MCA components, facilitating comprehensive testing of the application's behavior and response to various inputs.  The use of RTI Connext DDS messaging decouples the test automation framework from the specific implementation details of the MCA components, improving the flexibility and extensibility of the system. As new MCA Application or Platform Messages are introduced, the test automation framework can seamlessly integrate them by subscribing to the relevant DDS topics, without requiring changes to the existing components.

## 7.3 GRASP Patterns

The architecture also applies several GRASP (General Responsibility Assignment Software Patterns) patterns to guide the assignment of responsibilities to the various components:

- **Information Expert**: The data collection and reporting components are responsible for managing the test data, as they are the experts in this domain.
- **Low Coupling**: The use of interfaces and abstraction layers throughout the architecture promotes low coupling between components, making the system more maintainable and adaptable to changes.
- **High Cohesion**: The modular design of the architecture ensures that each component has a clear and focused responsibility, resulting in highly cohesive modules.
- **Polymorphism**: The test execution engine and data visualization components can interact with various types of test cases and data sources through polymorphic interfaces, enabling the system to accommodate new requirements without significant rework.

## 7.4 GOF Patterns
The architecture also incorporates several Gang of Four (GoF) design patterns to address specific design challenges:

- **Factory Method**: The test case management component uses the Factory Method pattern to create instances of different test case types, promoting flexibility and extensibility.
- **Observer**: The publish-subscribe interactions between the test automation framework and external systems are implemented using the Observer pattern, allowing components to subscribe to and receive updates from data sources without tight coupling.
- **Adapter**: The data collection and reporting components use the Adapter pattern to integrate with various data sources and formats, providing a consistent interface for the rest of the system.

By leveraging these well-established design patterns and principles, the test automation framework architecture achieves the desired goals of flexibility, scalability, and maintainability, enabling efficient and reliable testing of locomotive software running on an HIL or VSIM environment.