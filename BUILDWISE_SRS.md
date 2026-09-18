# SOFTWARE REQUIREMENTS SPECIFICATION

# BUILDWISE
### Modern Construction Management & Leftover Material Marketplace
*“Build Smarter. Waste Less.”*

| Document Attribute | Value |
| :--- | :--- |
| **Document Type** | Software Requirements Specification (SRS) |
| **Project** | Buildwise — Construction Management & Leftover Material Marketplace |
| **Domain** | Construction Technology (ConTech) / Circular Economy |
| **SDG Alignment** | SDG 12 — Responsible Consumption & Production (Target 12.5)<br>SDG 9 — Industry, Innovation & Infrastructure (Target 9.4) |
| **Version** | 1.0 |
| **Status** | Draft for Review |

---

## Table of Contents

- [1. Introduction](#1-introduction)
  - [1.1 Purpose](#11-purpose)
  - [1.2 Scope](#12-scope)
  - [1.3 Intended Audience](#13-intended-audience)
  - [1.4 Definitions, Acronyms & Abbreviations](#14-definitions-acronyms--abbreviations)
  - [1.5 References](#15-references)
  - [1.6 Document Overview](#16-document-overview)
- [2. Overall Description](#2-overall-description)
  - [2.1 Product Perspective](#21-product-perspective)
  - [2.2 Product Features](#22-product-features)
  - [2.3 User Classes and Characteristics](#23-user-classes-and-characteristics)
  - [2.4 Operating Environment](#24-operating-environment)
  - [2.5 Design and Implementation Constraints](#25-design-and-implementation-constraints)
  - [2.6 Assumptions and Dependencies](#26-assumptions-and-dependencies)
  - [2.7 Alignment with SDGs](#27-alignment-with-sdgs)
- [3. System Architecture](#3-system-architecture)
  - [3.1 Layers](#31-layers)
  - [FIGURE 3.1 — System Architecture Diagram](#figure-31--system-architecture-diagram)
- [4. Functional Requirements](#4-functional-requirements)
  - [4.1 Requirement List](#41-requirement-list)
  - [4.2 Detailed Functional Requirements](#42-detailed-functional-requirements)
- [5. Use Cases](#5-use-cases)
  - [5.1 Actors](#51-actors)
  - [FIGURE 5.1 — Use Case Diagram](#figure-51--use-case-diagram)
  - [5.2 Detailed Use Case Specifications](#52-detailed-use-case-specifications)
- [6. System Workflow](#6-system-workflow)
  - [6.1 Material Management Workflow](#61-material-management-workflow)
  - [6.2 Attendance Workflow](#62-attendance-workflow)
  - [6.3 Task Workflow](#63-task-workflow)
  - [6.4 Leftover Marketplace Workflow](#64-leftover-marketplace-workflow)
  - [FIGURE 6.1 — System Workflow Diagram](#figure-61--system-workflow-diagram)
  - [FIGURE 6.2 — Sequence Diagram: Record Material Usage](#figure-62--sequence-diagram-record-material-usage)
- [7. Data Structure & Application Logic Design](#7-data-structure--application-logic-design)
  - [7.1 Centralized Application State via React Context](#71-centralized-application-state-via-react-context)
  - [7.2 Mathematical & Computational Logic](#72-mathematical--computational-logic)
  - [7.3 Algorithmic Data Structures](#73-algorithmic-data-structures)
  - [FIGURE 7.1 — Data / Application Logic Flow](#figure-71--data--application-logic-flow)
- [8. Data Storage Design](#8-data-storage-design)
  - [8.1 Core Entities](#81-core-entities)
  - [8.2 Entity Schema Dictionary](#82-entity-schema-dictionary)
  - [FIGURE 8.1 — Data Entity Relationship / Storage Diagram](#figure-81--data-entity-relationship--storage-diagram)
- [9. Non-Functional Requirements](#9-non-functional-requirements)
- [10. External Interface Requirements](#10-external-interface-requirements)
  - [10.1 User Interface](#101-user-interface)
  - [10.2 Hardware Interfaces](#102-hardware-interfaces)
  - [10.3 Software Interfaces](#103-software-interfaces)
  - [10.4 Communication Interfaces](#104-communication-interfaces)
- [11. System Constraints & Assumptions](#11-system-constraints--assumptions)
- [12. Risk Analysis & Mitigation](#12-risk-analysis--mitigation)
- [13. Future Enhancements](#13-future-enhancements)
- [14. Appendix](#14-appendix)
  - [14.1 Glossary](#141-glossary)
  - [14.2 Technology Stack](#142-technology-stack)
- [Requirements Traceability Matrix](#requirements-traceability-matrix)

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) defines the functional and non-functional requirements for **Buildwise**, an integrated modern construction management platform and circular leftover material marketplace. Buildwise addresses structural construction site inefficiencies by consolidating daily project oversight, real-time material inventory tracking, and workforce attendance into a single responsive web system, while introducing a circular economy marketplace to turn surplus construction leftovers into recoverable capital. This document guides system design, implementation, and academic evaluation, serving as the formal technical specification of the current prototype.

### 1.2 Scope
Buildwise is implemented as a client-side Single Page Application (SPA). The current system scope covers:
- **Construction Site Management:** Multi-site progress monitoring, milestone completion tracking, budget vs. expenditure auditing, and site health status indicators.
- **Material Tracking & Usage:** Categorized inventory tracking (Cement, Steel, Tiles, Plumbing, Electrical, Aggregates), recording daily site consumption, dynamic remaining stock calculation, and automated low-stock warnings.
- **Workforce Management:** Crew member directory categorized by trade skill, daily wage rates, contact details, and historical attendance rates.
- **Digital Attendance:** 1-Click Mobile Punch Card check-in/out and simulated entrance QR code scanning with live muster roll compilation.
- **Task Management:** Operational task creation, priority assignment, tradesman allocation, and Kanban workflow status tracking.
- **Leftover Material Marketplace:** Direct conversion of logged site surplus into live B2B marketplace listings, city/category filtering, and buyer purchase inquiries.
- **Reporting Engine:** Vector PDF document generation for official muster rolls, material efficiency audits, and multi-site summaries, alongside CSV data exports.
- **Activity & Notification Stream:** Live chronological feed of operational site events and high-priority stock warnings.

*Out of scope for the current prototype:* Centralized server backend, remote relational database, user authentication (JWT/OAuth), live camera stream hardware access, and online payment gateways. These items are strictly categorized under [Section 13: Future Enhancements](#13-future-enhancements).

### 1.3 Intended Audience
- **Project Developers:** For understanding component hierarchy, state contracts, and business logic.
- **Academic Evaluators & Mentors:** For reviewing software engineering rigor, architectural decisions, and SDG alignment.
- **Future Contributors:** For extending the current frontend prototype with cloud backend APIs and database integrations.

### 1.4 Definitions, Acronyms & Abbreviations

| Term | Meaning |
| :--- | :--- |
| **SRS** | Software Requirements Specification |
| **UI / UX** | User Interface / User Experience |
| **SPA** | Single Page Application |
| **API** | Application Programming Interface |
| **DOM** | Document Object Model |
| **PDF** | Portable Document Format |
| **CSV** | Comma-Separated Values |
| **QR Code** | Quick Response Matrix Barcode |
| **RBAC** | Role-Based Access Control |
| **SDG** | Sustainable Development Goal (United Nations 2030 Agenda) |
| **KPI** | Key Performance Indicator |
| **PPC** | Portland Pozzolana Cement |
| **TMT** | Thermo-Mechanically Treated (reinforcement steel bars) |
| **CPVC** | Chlorinated Polyvinyl Chloride (plumbing pipe material) |
| **Muster Roll** | Formal register documenting worker attendance and daily wages |
| **Brass** | Traditional South Asian unit of aggregate volume (100 cubic feet) |

### 1.5 References
- **React 19 Documentation:** https://react.dev/
- **Vite 8 Build Engine:** https://vite.dev/
- **jsPDF & AutoTable Documentation:** https://raw.githack.com/MrRio/jsPDF/master/docs/
- **United Nations Sustainable Development Goals:** https://sdgs.un.org/goals
  - *Goal 12: Responsible Consumption and Production (Target 12.5)*
  - *Goal 9: Industry, Innovation and Infrastructure (Target 9.4)*

### 1.6 Document Overview
Section 2 provides a high-level system overview; Section 3 describes the system architecture; Section 4 details functional requirements; Section 5 provides use case specifications and diagram; Section 6 outlines operational system workflows and sequence diagrams; Section 7 covers data structures and application logic; Section 8 defines client-side data storage; Sections 9–12 establish non-functional requirements, external interfaces, constraints, and risk analysis; Sections 13–14 detail future scope and appendix material; concluding with the Requirements Traceability Matrix.

---

## 2. Overall Description

### 2.1 Product Perspective
In standard construction practice, 10–15% of procured structural materials are discarded as jobsite waste, while site managers juggle fragmented paper registers for attendance and procurement. Buildwise provides a self-contained, domain-specific operating system that unites jobsite management with a circular economy mechanism. Buildwise connects operational consumption tracking directly with an integrated B2B leftover marketplace, allowing contractors to monetize surplus materials rather than hauling them to landfills.

### 2.2 Product Features
- **Executive Dashboard:** Live KPI stat cards (Active Sites, Crew Present, Stock Volume, Pending Tasks), usage trend graphs, and attendance distribution donut charts.
- **Multi-Site Management:** Real-time tracking of site progress percentages, supervisors, budgets, expenditures, and risk alerts.
- **Material Inventory Tracking:** Comprehensive tracking by trade categories with daily usage logging, safety thresholds, and low-stock indicators.
- **Waste → Value Leftover Monetizer:** 1-Click tool converting identified surplus items directly into active marketplace listings.
- **Leftover Resale Marketplace:** Searchable B2B trading hub with category filters, city filters (Nashik, Pune, Mumbai, Bangalore), condition badges, and buyer inquiry dispatches.
- **Workforce Directory:** Specialized trade skill tracking (Masonry, Steel, Carpentry, Electrical, Plumbing, Labor), daily wages, and contact cards.
- **Dual-Mode Attendance:** 1-Click Mobile Punch Card check-in/out and an interactive simulated entrance QR Code Scanner.
- **Operational Task Kanban:** 4-stage task progression board (To Do, In Progress, Review, Completed) with worker assignments.
- **Automated Document Generation:** Client-side vector PDF compilation for muster rolls, material efficiency audits, and site summaries, with CSV export.
- **Role Perspective Switcher:** Instant top-bar persona switching between Builder, Site Engineer, and Worker modes.

### 2.3 User Classes and Characteristics

| User Class | Characteristics / Main Functions |
| :--- | :--- |
| **Builder / Director** | Executive persona. Monitors multi-site milestones, financial expenditures, aggregate inventory yields, and recovers capital via the leftover marketplace. |
| **Site Engineer** | Operational supervisor. Records daily material consumption quantities, inspects ongoing structural tasks, verifies crew muster logs, and flags leftovers for resale. |
| **Site Worker** | Frontline tradesman. Uses a distraction-free mobile portal for 1-click attendance punch, entrance QR scanning, and viewing assigned tasks. |

### 2.4 Operating Environment
- **Client Application:** Modern Chromium- or Firefox-based web browser with ECMAScript 2022+ support.
- **Runtime & Build Platform:** React 19 Single Page Application built with Vite 8.2.0.
- **Persistence Layer:** Browser LocalStorage API (zero remote server requirement in current prototype).
- **Styling Environment:** Pure Vanilla CSS design tokens and layout classes without utility framework dependencies.

### 2.5 Design and Implementation Constraints
- **Client-Side Persistence:** Application data resides entirely in browser `localStorage` and does not sync across separate physical devices.
- **Simulated Hardware Interface:** QR code scanning uses an animated viewfinder simulation rather than native camera device access.
- **Simulated Authentication:** Role switching is managed via client-side Context state without encrypted credentials or tokens.
- **Browser Origin Storage Quota:** Total JSON persistence is bounded by the browser origin quota of 5 MB.

### 2.6 Assumptions and Dependencies
- The user operates a browser with HTML5 Canvas and Web Storage enabled.
- The browser supports dynamic Blob and Object URL generation for document downloads.
- External photographic assets depend on CDN availability (images.unsplash.com).

### 2.7 Alignment with SDGs
- **SDG 12 (Target 12.5):** Substantially reduce waste generation through prevention, reduction, recycling, and reuse by converting leftover construction materials into marketplace listings.
- **SDG 9 (Target 9.4):** Upgrade infrastructure and modernize construction workflows through client-side digitization and material utilization optimization.

---

## 3. System Architecture

### 3.1 Layers
Buildwise follows a decoupled, layered client-side architecture:
- **Presentation Layer:** React 19 functional components, view routers, and reusable atomic UI elements (Buttons, Modals, ProgressBars, StatCards).
- **Application State & Logic Layer (AppContext):** Centralized state provider managing reactive data entities, threshold calculations, and toast dispatches.
- **Client-Side Services:** Vector PDF generation engine (`pdfGenerator.js`), CSV tabular serializer (`exportCSV`), and celebration animations (`canvas-confetti`).
- **Persistence Layer:** Browser LocalStorage maintaining 8 discrete JSON storage collections.
- **Future Cloud Layer (Planned):** Cloud REST/WebSocket backend, PostgreSQL database, authentication, and AI inference microservices.

### FIGURE 3.1 — System Architecture Diagram

```
+========================================================================================+
|                       BUILDWISE SYSTEM ARCHITECTURE DIAGRAM                            |
+========================================================================================+

 [ USER ROLES ]
     +-----------------+     +-----------------+     +-----------------+
     | The Builder     |     | Site Engineer   |     | Site Worker     |
     +--------+--------+     +--------+--------+     +--------+--------+
              |                       |                       |
              +-----------------------+-----------------------+
                                      |
                                      v
 [ PRESENTATION LAYER: REACT 19 + VITE ]
  +------------------------------------------------------------------------------------+
  |  Sidebar | TopNav (Role Switcher) | MobileBottomNav | ToastContainer               |
  |  DashboardView | SitesView | MaterialsView | MarketplaceView | WorkersView        |
  |  AttendanceView | WorkerPortalView | TasksView | ReportsView | SettingsView        |
  +-----------------------------------+------------------------------------------------+
                                      | (User Actions)
                                      v
 [ APPLICATION LOGIC / APPCONTEXT ]
  +------------------------------------------------------------------------------------+
  |  AppContext.jsx                                                                    |
  |  - State: sites, materials, leftovers, marketplace, workers, tasks, attendance     |
  |  - Business Logic: recordUsage(), listLeftoverOnMarketplace(), scanQRAttendance()   |
  |  - Calculators: remaining = purchased - used; status = remaining <= threshold      |
  +-----------------------------------+------------------------------------------------+
                                      |
              +-----------------------+-----------------------+
              | (Service Dispatch)                            | (JSON Serialization)
              v                                               v
 [ CLIENT-SIDE SERVICES ]                        [ LOCAL PERSISTENCE LAYER ]
  +-------------------------------------+         +------------------------------------+
  | - pdfGenerator.js (jsPDF+AutoTable) |         | Browser LocalStorage               |
  | - exportCSV (Blob Generation)       |         | - bw_sites       - bw_materials    |
  | - canvas-confetti (Visual Feedback) |         | - bw_leftovers   - bw_marketplace  |
  | - Toast Dispatcher System           |         | - bw_workers     - bw_tasks        |
  +-------------------------------------+         | - bw_activities  - bw_attendance   |
                                                  +------------------------------------+

 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 [ FUTURE / PLANNED ARCHITECTURE (Not in Current Prototype) ]
  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  :  +-------------------------------------------------------------------------------+  :
  :  | Cloud Backend (FastAPI / Node.js) + WebSocket Gateway                         |  :
  :  | - PostgreSQL 16 Database + Supabase BaaS                                      |  :
  :  | - User Authentication (JWT / Phone OTP) & True RBAC                           |  :
  :  | - Computer Vision Scrap Grading & Predictive Material AI Models               |  :
  :  | - Escrow Payment Gateway for Leftover Trading                                 |  :
  :  +-------------------------------------------------------------------------------+  :
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

 LEGEND:
 =======
   ——> [Solid Arrows]   : Currently Implemented in Prototype
   - - > [Dashed Lines] : Future / Planned Enhancements
```
*Fig. 3.1 — Layered architecture: Presentation → AppContext → Services → LocalStorage / Future Cloud*

---

## 4. Functional Requirements

### 4.1 Requirement List

| ID | Requirement | Priority |
| :--- | :--- | :--- |
| **FR-01** | System shall allow instant role perspective switching between Builder, Engineer, and Worker modes. | High |
| **FR-02** | System shall display real-time dashboard KPI metrics for active sites, crew attendance, inventory, and tasks. | High |
| **FR-03** | System shall manage multi-site projects with milestone progress bars, budgets, expenditures, and health badges. | High |
| **FR-04** | System shall allow adding new construction projects with supervisor allocations and budget metadata. | Medium |
| **FR-05** | System shall track categorized material stock with purchased, used, and dynamically calculated remaining quantities. | High |
| **FR-06** | System shall record daily material consumption, deducting used units and blocking entries exceeding remaining stock. | High |
| **FR-07** | System shall automatically trigger a "Low Stock" status when remaining inventory falls at or below threshold. | High |
| **FR-08** | System shall provide a 1-click action to list surplus leftover materials directly onto the B2B marketplace. | High |
| **FR-09** | System shall display surplus material listings with category, price per unit, total price, condition, and location. | High |
| **FR-10** | System shall allow posting new marketplace listings with custom category, condition, unit pricing, and photo assets. | Medium |
| **FR-11** | System shall provide a buyer inquiry dialog to send simulated purchase requests to surplus material sellers. | Medium |
| **FR-12** | System shall manage a trade crew directory with skill designations, daily wage rates, and historical attendance rates. | High |
| **FR-13** | System shall provide a 1-Click Mobile Punch Card enabling workers to check in and check out with timestamping. | High |
| **FR-14** | System shall simulate entrance QR code scanning with an animated laser viewfinder to verify worker attendance. | High |
| **FR-15** | System shall maintain a daily attendance muster register logging worker name, trade, site, timestamp, and method. | High |
| **FR-16** | System shall render a dedicated mobile worker portal for simplified attendance punching and personal task review. | High |
| **FR-17** | System shall provide a 4-stage Kanban board (To Do, In Progress, Review, Completed) for daily task operations. | High |
| **FR-18** | System shall generate and download vector PDF reports for Muster Rolls, Material Efficiency Audits, and Sites Summaries. | High |
| **FR-19** | System shall export tabular muster roll and inventory records into standardized CSV spreadsheet files. | High |
| **FR-20** | System shall provide a chronological notification stream and high-priority stock warning cards. | Medium |
| **FR-21** | System shall allow updating user profile preferences, regional measurement units (Brass vs. Tons), and demo data reset. | Medium |

### 4.2 Detailed Functional Requirements
- **FR-06.1 Consumption Validation:** The consumption modal must validate that `usedAmount > 0` and `usedAmount <= remaining`. Overflows must display an inline warning and disable submission.
- **FR-07.1 Dynamic Threshold Evaluation:** Immediately after usage logging, status is evaluated as `remaining <= threshold ? 'Low Stock' : 'In Stock'`.
- **FR-08.1 Leftover Conversion:** Clicking "Sell on Marketplace" removes the item from `bw_leftovers`, adds it to `bw_marketplace`, fires confetti, and posts a notification entry.

---

## 5. Use Cases

### 5.1 Actors
- **The Builder:** Executive authority managing budgets, multi-site progress, and marketplace capital recovery.
- **Site Engineer:** Field supervisor managing materials, logging daily consumption, assigning tasks, and supervising labor.
- **Site Worker:** Tradesman interacting with the mobile portal for attendance punching and task verification.

### FIGURE 5.1 — Use Case Diagram

```
+========================================================================================+
|                                BUILDWISE USE CASE DIAGRAM                              |
+========================================================================================+

                               BUILDWISE SYSTEM BOUNDARY
   +----------------------------------------------------------------------------------+
   |                                                                                  |
   |   (UC-01: View Dashboard KPIs & Charts) <--------------------------+             |
   |                                                                    |             |
   |   (UC-02: Manage Multi-Site Projects & Budgets) <------------------+             |
   |                                                                    |             |
   |   (UC-03: Manage Materials & Inventory) <------------------+       |             |
   |                                                            |       |             |
   |   (UC-04: Record Daily Material Usage) <-------------------+       |  <<Actor>>  |
   |                                                            |       +--The Builder|
   |   (UC-05: Monitor Low Stock Warnings) <--------------------+       |             |
   |                                                            |       |             |
   |   (UC-06: Manage Workers & Crew Directory) <---------------+       |             |
   |                                                            |       |             |
   |   (UC-07: Mark Attendance via 1-Click Punch) <-------------+-------+             |
   |                                                            |       |             |
   |   (UC-08: Verify Attendance via QR Code Scan) <------------+       |  <<Actor>>  |
   |                                                            |       +--Site Worker|
   |   (UC-09: Manage Operational Tasks) <----------------------+       |             |
   |                                                            |       |             |
   |   (UC-10: List Leftover Surplus on Marketplace) <----------+       |             |
   |                                                            |       |             |
   |   (UC-11: Browse & Filter Marketplace Listings) <----------+       |             |
   |                                                            |       |             |
   |   (UC-12: Request Marketplace Material) <------------------+       |             |
   |                                                            |       |             |
   |   (UC-13: Generate PDF Reports & CSV Exports) <------------+       |             |
   |                                                            |                     |
   +------------------------------------------------------------|---------------------+
                                                                |
                                                            <<Actor>>
                                                          Site Engineer
```
*Fig. 5.1 — Primary actors (Builder, Site Engineer, Worker) and their system interactions*

### 5.2 Detailed Use Case Specifications

#### UC-04: Record Material Usage
- **Actor:** Site Engineer
- **Purpose:** Log consumed materials on-site, dynamically update stock balance, and trigger reorder alerts if stock drops below threshold.
- **Preconditions:** Material exists in `bw_materials` with remaining stock $> 0$.
- **Main Flow:**
  1. Engineer opens the Materials view or clicks "+ Record Usage" on Dashboard.
  2. Engineer selects material, views current remaining balance and site location.
  3. Engineer enters consumed quantity and optional activity notes.
  4. Engineer clicks "Confirm Usage".
  5. System updates used and remaining quantities: $\text{remaining} = \text{purchased} - \text{used}$.
  6. System checks if $\text{remaining} \le \text{threshold}$; marks status as "Low Stock" if triggered.
  7. System saves updated state to LocalStorage (`bw_materials`).
  8. System appends an entry to `bw_activities` and displays a success toast.
- **Alternative Flow:**
  - *3a.* Engineer inputs quantity exceeding available stock.
  - *3b.* System shows error *"Cannot record more than available remaining stock!"* and blocks submission.
- **Postconditions:** Inventory balance updated; low-stock alerts rendered if threshold is reached.

#### UC-08: Verify Attendance (QR Scanner)
- **Actor:** Site Worker / Site Engineer
- **Purpose:** Register worker presence at a construction site entrance via simulated QR code scan.
- **Preconditions:** Worker profile exists in `bw_workers`.
- **Main Flow:**
  1. User navigates to Attendance view or Worker Portal and clicks "Scan Site QR".
  2. System displays `QRScannerModal` with animated camera viewfinder.
  3. User selects site and clicks "Simulate Camera Scan".
  4. System executes 1400ms scanning laser animation.
  5. System marks worker `isCheckedIn = true` and records punch timestamp.
  6. System appends record to `bw_attendance` with `method: "Site QR Scan"`.
  7. Confetti triggers, confirmation message displays, and LocalStorage updates.
- **Postconditions:** Worker registered as Present in the official muster roll.

#### UC-10: List Leftover Material (Waste → Value)
- **Actor:** Builder / Site Engineer
- **Purpose:** Transform site surplus into active marketplace listings to recover capital.
- **Preconditions:** Item exists in `bw_leftovers`.
- **Main Flow:**
  1. User navigates to "Materials You Can Recover Value From" section.
  2. User reviews surplus items, conditions, and estimated monetary values.
  3. User clicks "Sell on Marketplace" on selected item.
  4. System removes item from `bw_leftovers` and generates a listing in `bw_marketplace`.
  5. Confetti triggers; system posts activity log and displays success toast with recovered value.
- **Postconditions:** Surplus item is listed for sale in the B2B marketplace.

#### UC-13: Generate Reports
- **Actor:** Builder / Site Engineer
- **Purpose:** Compile and download vector PDF reports or CSV spreadsheets on the client side.
- **Preconditions:** Data exists in `bw_materials`, `bw_attendance`, or `bw_sites`.
- **Main Flow:**
  1. User navigates to Reports view.
  2. User clicks "Download Muster Roll (PDF)", "Download Material Audit (PDF)", or "Download Sites Summary (PDF)".
  3. Client-side `pdfGenerator.js` draws corporate headers, renders auto-styled tables, and attaches sign-off blocks.
  4. Browser triggers automated file download (e.g., `Buildwise_Material_Efficiency_Audit_2026-09-11.pdf`).
- **Postconditions:** PDF/CSV document saved to local file system.

---

## 6. System Workflow

### 6.1 Material Management Workflow
```
Material Procured -> Record Usage -> Update Quantity -> Calculate Remaining Stock -> Check Threshold -> Low Stock Alert (if remaining <= threshold)
```

### 6.2 Attendance Workflow
```
Worker Arrival -> 1-Click Mobile Punch OR QR Code Scan -> Attendance Record Created -> Attendance Status: Present -> Muster Roll Updated
```

### 6.3 Task Workflow
```
Task Created (To Do) -> Progress Initiated (In Progress) -> Inspection Ready (Review) -> Sign-off Certified (Completed) -> Confetti Triggered
```

### 6.4 Leftover Marketplace Workflow
```
Surplus Identified -> Leftover Section -> "Sell on Marketplace" -> Marketplace Listing Published -> Buyer Inquiry Sent
```

### FIGURE 6.1 — System Workflow Diagram

```
+========================================================================================+
|                             BUILDWISE SYSTEM WORKFLOW DIAGRAM                          |
+========================================================================================+

    [ START ]
        |
        v
    Select User Role (Builder / Site Engineer / Worker)
        |
        +----------------------------+----------------------------+
        |                            |                            |
        v (Builder)                  v (Site Engineer)            v (Site Worker)
  +------------------+         +------------------+         +--------------------+
  | Executive        |         | Materials View / |         | Worker Mobile      |
  | Dashboard        |         | Operations Kanban|         | Portal             |
  +--------+---------+         +--------+---------+         +---------+----------+
           |                            |                             |
           |                            |-- Record Material Usage     |-- 1-Click Punch
           |                            |   |                         |-- Scan Site QR
           |                            |   v                         |-- View Assigned
           |                            |  [Threshold Evaluation]     |   Tasks
           |                            |   |                         |
           |                            |   +--> Low Stock Warning    +--------+
           |                            |                                      |
           |                            |-- List Leftover to Resale            |
           |                            |   |                                  |
           |                            |   v                                  |
           |                            |  [Publish to Marketplace]            |
           |                            |                                      |
           +----------------------------+--------------------------------------+
                                        |
                                        v
                            [ AppContext State Update ]
                                        |
                                        v
                            [ LocalStorage Synchronization ]
                                        |
                                        v
                            [ React UI Re-render ]
                                        |
                                        v
                            [ END (Continuous Loop) ]
```
*Fig. 6.1 — Step-by-step Buildwise operational workflow diagram across all user roles*

### FIGURE 6.2 — Sequence Diagram: Record Material Usage

```
+========================================================================================+
|                     SEQUENCE DIAGRAM: RECORD MATERIAL USAGE                            |
+========================================================================================+

 Site Engineer         React UI             AppContext        LocalStorage    Notification
      |                    |                     |                  |                 |
      | 1. Enters usage    |                     |                  |                 |
      |    amount in modal |                     |                  |                 |
      |------------------->|                     |                  |                 |
      |                    |                     |                  |                 |
      | 2. Clicks Confirm  | 3. recordUsage()    |                  |                 |
      |------------------->|-------------------->|                  |                 |
      |                    |                     |                  |                 |
      |                    |                     | 4. Recalculate:  |                 |
      |                    |                     |    used += qty   |                 |
      |                    |                     |    rem = pur-used|                 |
      |                    |                     |--+               |                 |
      |                    |                     |  |               |                 |
      |                    |                     |<-+               |                 |
      |                    |                     |                  |                 |
      |                    |                     | 5. Evaluate:     |                 |
      |                    |                     |    rem <= thresh |                 |
      |                    |                     |    ? Low Stock   |                 |
      |                    |                     |    : In Stock    |                 |
      |                    |                     |--+               |                 |
      |                    |                     |  |               |                 |
      |                    |                     |<-+               |                 |
      |                    |                     |                  |                 |
      |                    |                     | 6. Persist JSON  |                 |
      |                    |                     |----------------->|                 |
      |                    |                     |                  |                 |
      |                    |                     | 7. Trigger Toast |                 |
      |                    |                     |----------------------------------->|
      |                    | 8. UI re-renders    |                  |                 |
      |<-------------------|    stock balances   |                  |                 |
```
*Fig. 6.2 — End-to-end message flow for recording on-site material consumption*

---

## 7. Data Structure & Application Logic Design

### 7.1 Centralized Application State via React Context
The application state is maintained in `AppContext.jsx` using React 19 Context. On initialization, each state variable performs a lazy read from `localStorage`, falling back to seed mock collections:
```javascript
const [materials, setMaterials] = useState(() => {
  const saved = localStorage.getItem('bw_materials');
  return saved ? JSON.parse(saved) : initialMaterials;
});
```
Eight `useEffect` hooks listen to changes on their respective state vectors and serialize updates back to `localStorage`.

### 7.2 Mathematical & Computational Logic
1. **Material Balance Equation:**
   $$R_m = \max(0, P_m - U_m)$$
   Where $P_m$ is total purchased volume, and $U_m$ is cumulative consumed volume.
2. **Threshold Stock Status:**
   $$\text{status} = \begin{cases} \text{"Low Stock"} & \text{if } R_m \le T_m \\ \text{"In Stock"} & \text{if } R_m > T_m \end{cases}$$
3. **Attendance Rate:**
   $$\text{Attendance Rate (\%)} = \left( \frac{\text{Present Crew Count}}{\text{Total Enrolled Crew}} \right) \times 100$$
4. **Resale Value Recovery:**
   $$V_{\text{recovered}} = \sum_{l \in \text{Monetized Leftovers}} \text{estimatedValue}_l$$

### 7.3 Algorithmic Data Structures
- **Array Collections:** Sequential collections for materials, workers, tasks, sites, and marketplace listings, enabling $O(n)$ filtering and mapping.
- **Lookup Map:** Instant role profile resolution (`currentUser[userRole]`) in $O(1)$ constant time.
- **FIFO Buffer:** Recent activity stream capped at 16 entries (`[newAct, ...prev.slice(0, 15)]`).
- **Expiring Queue:** Toast notifications auto-dismissing after a 4000ms timer.

### FIGURE 7.1 — Data / Application Logic Flow

```
+========================================================================================+
|                       FIGURE 7.1: DATA & LOGIC FLOW DIAGRAM                            |
+========================================================================================+

                   +-----------------------------------+
                   | User Interaction (Input / Button) |
                   +-----------------+-----------------+
                                     |
                                     v
                   +-----------------------------------+
                   | React View / Modal Component      |
                   +-----------------+-----------------+
                                     |
                                     v Dispatches Handler
                   +-----------------------------------+
                   | AppContext Action Handler         |
                   | (recordUsage, addWorker, etc.)    |
                   +-----------------+-----------------+
                                     |
                 +-------------------+-------------------+
                 |                                       |
                 v Validates Constraints                 v Recalculates State
        (e.g., used <= remaining)               (rem = pur - used; Low Stock)
                 |                                       |
                 +-------------------+-------------------+
                                     |
                                     v
                   +-----------------------------------+
                   | Reactive State Update (useState)  |
                   +-----------------+-----------------+
                                     |
                 +-------------------+-------------------+
                 |                                       |
                 v Trigger useEffect Hook                v Virtual DOM Diff
     +-----------------------+               +-----------------------+
     | LocalStorage Sync     |               | UI View Re-renders    |
     | localStorage.setItem  |               | with Updated Balances |
     | ('bw_*', JSON)        |               +-----------------------+
     +-----------------------+
```
*Fig. 7.1 — Application state and data flow from user interaction to LocalStorage persistence*

---

## 8. Data Storage Design

### 8.1 Core Entities
Buildwise persists data on the client side using 8 discrete LocalStorage keys prefixed with `bw_`:

| Entity | LocalStorage Key | Purpose | Important Fields |
| :--- | :--- | :--- | :--- |
| **Sites** | `bw_sites` | Construction project sites | `id`, `name`, `location`, `progress`, `totalBudget`, `spent`, `health` |
| **Materials** | `bw_materials` | Material inventory stock | `id`, `name`, `category`, `purchased`, `used`, `remaining`, `status`, `threshold` |
| **Leftovers** | `bw_leftovers` | Identified jobsite surplus | `id`, `title`, `quantity`, `estimatedValue`, `condition`, `site` |
| **Marketplace** | `bw_marketplace`| B2B surplus listings | `id`, `title`, `price`, `totalPrice`, `city`, `seller`, `sellerRating` |
| **Workers** | `bw_workers` | Trade crew directory | `id`, `name`, `trade`, `wagePerDay`, `isCheckedIn`, `checkInTime` |
| **Tasks** | `bw_tasks` | Operational site tasks | `id`, `title`, `workerName`, `priority`, `progress`, `status` |
| **Attendance** | `bw_attendance` | Shift muster roll | `id`, `workerName`, `siteName`, `time`, `date`, `status`, `method` |
| **Activities** | `bw_activities` | Chronological event logs | `id`, `text`, `time`, `type`, `statusClass` |

### 8.2 Entity Schema Dictionary
- **Site:** Represents active physical projects with assigned supervisors, financial metrics, and progress percentages.
- **Material:** Stores procurement vs. consumption metrics; bound to a specific `siteId`.
- **Leftover:** Surplus items cataloged on-site awaiting 1-click publishing or site reuse.
- **MarketListing:** Publicly visible resale items with unit price, total price, and seller ratings.
- **Worker:** Human resources classified by specialized trade, daily wage rate, and check-in flag.
- **Task:** Operations items moving through the 4-stage Kanban pipeline (`To Do` $\rightarrow$ `Completed`).
- **AttendanceLog:** Immutable register entries capturing check-in timestamp, site, and verification method.

### FIGURE 8.1 — Data Entity Relationship / Storage Diagram

```
+========================================================================================+
|                    FIGURE 8.1: DATA ENTITY RELATIONSHIP DIAGRAM                        |
+========================================================================================+

    +------------------------+
    |       bw_sites         |
    +------------------------+
    | PK  id                 |<--------------+
    |     name               |               |
    |     location           |               |
    |     totalBudget        |               |
    |     spent              |               |
    |     health             |               |
    +-----------+------------+               |
                |                            |
                | 1:N                        | 1:N
                v                            |
    +------------------------+               |
    |     bw_materials       |               |
    +------------------------+               |
    | PK  id                 |               |
    | FK  siteId             |               |
    |     name               |               |
    |     purchased          |               |
    |     used               |               |
    |     remaining          |               |
    |     status (Low Stock) |               |
    +-----------+------------+               |
                |                            |
                | Identifies Surplus         |
                v                            |
    +------------------------+               |
    |     bw_leftovers       |               |
    +------------------------+               |
    | PK  id                 |               |
    |     title              |               |
    |     quantity           |               |
    |     estimatedValue     |               |
    +-----------+------------+               |
                |                            |
                | Converts 1-Click           |
                v                            |
    +------------------------+               |
    |    bw_marketplace      |               |
    +------------------------+               |
    | PK  id                 |               |
    |     title              |               |
    |     price / unit       |               |
    |     city               |               |
    |     sellerRating       |               |
    +------------------------+               |
                                             |
                +----------------------------+
                |
                +----------------------------+
                | 1:N                        | 1:N
                v                            v
    +------------------------+   +------------------------+
    |       bw_workers       |   |        bw_tasks        |
    +------------------------+   +------------------------+
    | PK  id                 |   | PK  id                 |
    | FK  siteId             |   | FK  siteId             |
    |     name               |   | FK  workerId           |
    |     trade              |   |     title              |
    |     wagePerDay         |   |     priority           |
    |     isCheckedIn        |   |     status (Kanban)    |
    +-----------+------------+   +------------------------+
                |
                | 1:N
                v
    +------------------------+   +------------------------+
    |     bw_attendance      |   |     bw_activities      |
    +------------------------+   +------------------------+
    | PK  id                 |   | PK  id                 |
    |     workerName         |   |     text               |
    |     siteName           |   |     time               |
    |     time / date        |   |     type               |
    |     method (Punch/QR)  |   |     statusClass        |
    +------------------------+   +------------------------+
```
*Fig. 8.1 — Data entity-relationship schema reflecting LocalStorage entities and conceptual references*

---

## 9. Non-Functional Requirements

| Category | Requirement |
| :--- | :--- |
| **Performance** | Initial SPA bundle load shall execute in $\le 1.5\text{ seconds}$ on standard broadband; UI state updates shall render in $\le 16\text{ ms}$ ($60\text{ fps}$). |
| **Usability** | The interface shall provide intuitive navigation across construction-themed colors (Slate Navy, Safety Amber, Emerald Green) with high-contrast text. |
| **Reliability** | State mutations shall automatically serialize to `localStorage` on every change, ensuring zero data loss across page refreshes. |
| **Maintainability** | The application code shall pass static analysis via Oxlint with 0 syntax errors and adhere to modular component architecture. |
| **Responsiveness** | Layout shall adapt smoothly across desktop ($>1024\text{px}$), tablet ($768\text{px}$–$1024\text{px}$), and mobile ($<768\text{px}$) viewports. |
| **Compatibility** | The system shall operate consistently on all modern evergreen browsers (Chrome, Edge, Firefox, Safari). |
| **Data Persistence** | The total storage footprint across all 8 LocalStorage entities shall occupy $< 250\text{ KB}$, well within the browser 5MB origin limit. |
| **Security** | The prototype sanitizes user text inputs via React JSX escaping to prevent Cross-Site Scripting (XSS). *(Cryptographic auth is out of scope for prototype).* |

---

## 10. External Interface Requirements

### 10.1 User Interface
The UI comprises a fixed sidebar on desktop, a mobile slide-out drawer with bottom navigation bar, an executive top bar with role perspective toggles, modal dialogs for all creation workflows, and interactive cards for materials, tasks, and marketplace listings.

### 10.2 Hardware Interfaces
The current prototype requires standard display and pointing/touch devices. Physical camera hardware access for QR scanning is simulated via CSS/SVG animations and is scheduled for hardware integration in future iterations.

### 10.3 Software Interfaces
- **React (v19.2.8) & React-DOM:** Component rendering and state hooks.
- **Vite (v8.2.0):** Build tool and local development server.
- **jsPDF (v4.2.1) & jspdf-autotable (v5.0.8):** Client-side vector PDF compilation.
- **lucide-react (v1.33.0):** SVG icon system.
- **canvas-confetti (v1.9.4):** Visual celebration particle effects.
- **Oxlint (v1.75.0):** Code linting and quality verification.

### 10.4 Communication Interfaces
The current prototype runs completely in the client browser with no external server REST or WebSocket communication layers. External network requests are restricted to asset CDN image retrieval.

---

## 11. System Constraints & Assumptions

- **Browser Storage Boundary:** Data is persisted in browser `localStorage` on the local machine only; no automatic multi-device synchronization is supported.
- **Zero-Backend Architecture:** There is no centralized database or backend server in the current prototype.
- **Role Perspective Simulation:** The user role switcher provides simulated perspective switching for testing and evaluation without requiring password authentication.
- **Pre-populated Demo Data:** Initial mock seed data is provided in `mockData.js` and can be restored at any time via "Reset Demo Data" in Settings.

---

## 12. Risk Analysis & Mitigation

| Risk | Impact | Mitigation |
| :--- | :--- | :--- |
| **LocalStorage Data Purge** | High | Default mock data fallback is pre-seeded in `mockData.js`; "Reset Demo Data" button allows instant state restoration. |
| **Input Overflow in Material Usage** | High | Client-side input validation restricts usage: $\text{usedAmount} \le \text{remaining}$, disabling confirmation if violated. |
| **Browser Storage Quota Exceeded** | Medium | The system stores remote image URLs rather than base64 strings, keeping total storage well under 250 KB. |
| **Single-Device Concurrency Limitation** | High | Explicitly identified as a prototype constraint; roadmap targets cloud database migration in Section 13. |
| **Unverified Entrance QR Scans** | Medium | Prototype simulates scan; future production design will bind QR validation to HTML5 Geolocation geofencing. |

---

## 13. Future Enhancements

> [!IMPORTANT]
> The features listed below represent planned future scope and are NOT implemented in the current prototype.

- **Cloud Backend & Centralized Database:** Node.js/FastAPI REST and WebSocket backend with hosted PostgreSQL 16 / Supabase storage.
- **User Authentication & True RBAC:** Phone OTP and biometric authentication for construction workers; JWT token-based role-based access control.
- **Multi-Device State Synchronization:** Real-time bi-directional synchronization across site engineer phones and head office desktop dashboards.
- **AI Material Prediction & Computer Vision:** Machine learning models forecasting concrete pour requirements and computer vision grading of scrap steel and leftover tiles from mobile photos.
- **GPS Geofencing:** HTML5 GPS verification ensuring workers are within a 50-meter radius of the site when punching attendance.
- **Escrow Payment Gateway:** Digital escrow payments via UPI/Razorpay for marketplace transactions, releasing funds upon delivery inspection.

---

## 14. Appendix

### 14.1 Glossary
- **AutoTable:** jsPDF plugin for rendering formatted data tables.
- **Circular Economy:** An economic model eliminating waste through the continuous reuse and resale of surplus materials.
- **Confetti:** Gamified visual reward animation celebrating task completions and resale listings.
- **Kanban Board:** Visual workflow management method organizing tasks across sequential stages.
- **Muster Roll:** Official daily register certifying workforce presence and wage entitlements on construction sites.

### 14.2 Technology Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19.2.8 | Declarative reactive UI components |
| **Build Tool** | Vite 8.2.0 | High-performance build tool and dev server |
| **Styling** | Vanilla CSS3 | Custom properties, responsive flexbox and grid layouts |
| **PDF Generation** | jsPDF 4.2.1 | Programmatic vector PDF creation |
| **PDF Tables** | jspdf-autotable 5.0.8 | Formatted tabular layouts inside PDF documents |
| **Iconography** | lucide-react 1.33.0 | Vector iconography |
| **Animation** | canvas-confetti 1.9.4 | Particle confetti effects |
| **Linter** | Oxlint 1.75.0 | High-performance static code analysis |
| **Persistence** | Web Storage API | Browser LocalStorage client-side persistence |
| **Export** | HTML5 Blob API | Client-side CSV generation and download |

---

## Requirements Traceability Matrix

| Requirement ID | Feature | Module | Primary Source File |
| :--- | :--- | :--- | :--- |
| **FR-01** | Role Perspective Switcher | Navigation | `src/components/layout/TopNav.jsx` |
| **FR-02** | Executive KPI Stat Cards | Dashboard | `src/components/dashboard/DashboardView.jsx` |
| **FR-03** | Multi-Site Portfolio Tracking | Sites | `src/components/sites/SitesView.jsx` |
| **FR-04** | New Site Project Creation | Sites | `src/components/sites/AddSiteModal.jsx` |
| **FR-05** | Material Stock Directory | Materials | `src/components/materials/MaterialsView.jsx` |
| **FR-06** | Material Usage Logging | Materials | `src/components/materials/RecordUsageModal.jsx` |
| **FR-07** | Automated Low-Stock Alerting | Materials / Feed | `src/context/AppContext.jsx` |
| **FR-08** | Waste → Value Resale Monetizer| Materials | `src/components/materials/LeftoverSection.jsx` |
| **FR-09** | B2B Marketplace Feed | Marketplace | `src/components/marketplace/MarketplaceView.jsx` |
| **FR-10** | Post Surplus Listing | Marketplace | `src/components/marketplace/PostListingModal.jsx` |
| **FR-11** | Buyer Purchase Inquiry Dialog | Marketplace | `src/components/marketplace/RequestListingModal.jsx` |
| **FR-12** | Trade Crew Workforce Directory | Workers | `src/components/workers/WorkersView.jsx` |
| **FR-13** | 1-Click Mobile Punch Card | Attendance | `src/components/attendance/AttendancePunchCard.jsx`|
| **FR-14** | Simulated QR Code Scanner | Attendance | `src/components/attendance/QRScannerModal.jsx` |
| **FR-15** | Daily Muster Register Log | Attendance | `src/components/attendance/AttendanceView.jsx` |
| **FR-16** | Streamlined Worker Mobile Mode | Worker Portal | `src/components/worker-portal/WorkerPortalView.jsx`|
| **FR-17** | 4-Stage Operations Kanban | Tasks | `src/components/tasks/TasksView.jsx` |
| **FR-18** | Vector PDF Document Export | Reports | `src/utils/pdfGenerator.js` |
| **FR-19** | CSV Raw Ledger Data Export | Reports / Muster | `src/utils/pdfGenerator.js` |
| **FR-20** | Activity Audit Stream | Notifications | `src/components/notifications/NotificationsView.jsx`|
| **FR-21** | Settings & Demo Data Reset | Settings | `src/components/settings/SettingsView.jsx` |

---
*End of Software Requirements Specification (SRS) — BUILDWISE v1.0*
