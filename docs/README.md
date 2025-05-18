# Architecture and Design Description
This repository contains the architecture and design description for the SWENG 894 Capstone project.

## Table of Contents
- [Introduction](#introduction)
- [Repository Organization](#repository-organization)
- [Plugin Config](#plugin-config)
- [MarkDown Preview and PDF Generation](#markdown-preview-and-pdf-generation)
- [Contributing](#contributing)
- [License](#license)

## Introduction
This architecture description outlines the design and implementation of a test automation framework for locomotive software, developed by Wabtec. The framework is designed to run on a Hardware-in-the-Loop (HIL) or a Virtual Simulator (VSIM) system, providing a comprehensive and automated testing environment for the locomotive control software.

The test automation framework is a critical component in ensuring the reliability and safety of the locomotive software. It allows for the execution of a wide range of test scenarios, from logical and physical system tests to control logic and edge case handling. The framework integrates with various stakeholders, including system engineers, controls engineers, software developers, and test engineers, to provide a centralized platform for test case management, execution, and analysis.

## Repository Organization
Instead of using Microsoft Word or even MagicDraw to create the document, it was written using Markdown with embedded diagrams.  This was to keep it simple and easy to maintain, but also allow it to used in Github Wiki or other tools in the future.  Separating the document sections into separate files and using text allows for easier maintenance by the development team and enables common diff tool sections

In order to create the document this way, several items needed to addressed
- inline Mermaid diagram rendering
- inline PlantUML diagram rendering
- easy integration with Draw.io for hand drawn diagrams
- ability to combine multiple and separate Markdown files into one document
- ability to easily export to browser (HTML) or PDF

To most easily maintain or update this document it is recommended to use VSCode with the following plugins: 
- Code Spell Checker
- Draw\.io integration
- Git Graph
- Markdown Preview Enhanced
- Markdown Table
- Mermaid Markdown Syntax Highlighting

The repository is organized as follows...
```
\images - .drawio, .svg, and .png files
\md - .md document source files
\ppt - powerpoint reviews
\ref - other reference information (.md or others)
\video  - video reviews
```

In the root path is this README\.md file and TestAutomation\.md and TestAutomation\.pdf which is the architecture and design description document.

## Plugin Config
The Markdown Preview Enhanced plugin will need some settings adjusted.  The Plantuml Jar Path setting points to a local install of PlantUML.

```
Markdown-preview-enhanced: Plantuml Jar Path
Absolute path to the plantuml.jar file (`java` is required in system path).
```
For example, you can download and move the jar file to ~/.vscode
> /Users/Gerry.Wagner/.vscode/plantuml-gplv2-1.2025.2.jar

To get PlantUML working you need to have JAVA and a PlantUML JAR.  You can download here: [https://plantuml.com/download](https://plantuml.com/download "https://plantuml.com/download")

You will also need to have the graphviz/dot installed.  For a mac you can use ```brew install graphviz```.  Here is the link [https://graphviz.org](https://graphviz.org/)

Additionally the heading styles and font size should be adjusted to ensure proper sizing on the preview and printed document.  Use the VSCode command palette ```CMD+Sfhit+P``` to select ```Markdown Preview Enhanced: Customize CSS (Global)``` and update the following styles. 

```css
.markdown-preview.markdown-preview {
  font-size: 10pt;
  h1 { font-size: 1.75em; }
  h2 { font-size: 1.50em; }
  h3 { font-size: 1.25em; }
  h4 { font-size: 1.00em; }
}
```

## MarkDown Preview and PDF Generation
From time to time you might need to close the preview window and reopen it if it gets stuck.  Additionally, please note that Markdown Enhanced Preview keeps a cache of your MarkDown renderings.  So sometimes you might edit .md source and the preview will be stale.  In this case you need to refresh.

- To preview, press Ctrl+K then V, or select the Markdown Enhanced Preview button in top right corner of the editor window.  
- To refresh select the refresh icon in the top right corner of the preview window.  
- To display in your browser, right click in the preview window and select, "Open in Browser".
- To generate a PDF, right click in the preview window, select "Export", "Chrome: Puppeteer", then "PDF".

**Styling Hints**
You can embed HTML in MarkDown as needed to adjust styling.  This is useful to center or resize tables, images, or diagrams.

```HTML
<div style="display: flex; justify-content: center;">
<div style="width:700px">
    Table, or Image, or Diagram goes here
</div>
</div>
```

Please note that mermaid diagrams will adjust to width or max-width, but PlantUML diagrams will not.  In order to resize these just use ```scale``` in the PlantUML diagram source

## Diagrams
Explain the diagrams used in the architecture description, such as system architecture, component diagrams, deployment diagrams, etc. You can either include the diagrams directly in the README.md file or provide links to the diagram files.

## Contributing
The architecture and design description for the SWENG 894 Capstone project is maintained as a group of separate Markdown files and images, and is revision controlled using Git and hosted on GitLab.

Changes and updates to the architecture and design description should follow the standard GitLab branching and merging processes:

1. **Create a new branch**: Create a new branch from the main/master branch to make your changes.
2. **Make your changes**: Update the relevant Markdown files with your changes or additions.
3. **Commit and push**: Commit your changes to your branch and push it to the remote GitLab repository.
4. **Create a merge request**: Create a merge request from your branch to the main/master branch, following the GitLab merge request guidelines.
5. **Review and approval**: The merge request will be reviewed by the appropriate Wabtec personnel. Once approved, your changes will be merged into the main/master branch.

Please ensure that your changes adhere to the existing formatting and style guidelines used throughout the architecture description. If you have any questions or need assistance, please contact the Wabtec team responsible for maintaining the SWENG 894 Capstone project and its documentation.

## Related Projects
Listed below are some sample projects for Test Automation frameworks or tools.

- [Avocado Framework](https://avocado-framework.readthedocs.io/en/103.0/)
- [Robot Framework](https://robotframework.org/)
- [NI Teststand](https://www.ni.com/en/shop/electronic-test-instrumentation/application-software-for-electronic-test-and-instrumentation-category/what-is-teststand.html)

## Design References and Blogs
- [Martin Fowler Page Object](https://martinfowler.com/bliki/PageObject.html)

## License
Our SWENG 894 Capstone project and design is public and open-source, and is intended for use educational purposes. The software and its associated documentation are not to be shared, distributed, or used by any third parties without the express written consent of Wabtec.

The software is provided "as is" without warranty of any kind, either expressed or implied, including but not limited to the implied warranties of merchantability and fitness for a particular purpose. Wabtec shall not be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, procurement of substitute goods or services; loss of use, data, or profits; or business interruption) however caused and on any theory of liability, whether in contract, strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this software, even if advised of the possibility of such damage.
