# Dev Task Assignment: MVP Build Plan

## Team Structure

### Dev 1: Frontend Engineer
Owns the user-facing web/mobile-friendly interface, role-based screens, forms, dashboards, and workflow interactions.

### Dev 2: Backend Engineer
Owns the API, database, authentication, permissions, workflow state, task assignment logic, reporting, and data processing.

### Dev 3: Maps & IoT Research Engineer
Owns GIS/map implementation, spatial data modeling, route/coverage logic, map layers, and research/prototyping for Sentinel trap integration.

## Shared MVP Goal
Build a working prototype that supports:
*   City and barangay dashboards.
*   Citizen reporting and public location status.
*   Field inspector route tracking and inspection validation.
*   Treatment team task tracking.
*   Checked, unchecked, scheduled, skipped, monitoring, and cleared statuses.
*   Basic risk scoring.
*   Optional/simulated Sentinel trap data.
*   CSV/PDF reporting.

## Dev 1: Frontend Engineer

### Primary Responsibilities
*   Build the main application layout and navigation.
*   Build role-based screens for:
    *   City Administrator / City Health Office.
    *   Barangay Administrator / Barangay Health Worker Lead.
    *   Field Inspector.
    *   Treatment Team / Sanitation Personnel.
    *   Citizen.
*   Build mobile-friendly workflows for inspectors and treatment teams.
*   Build forms for citizen reports, inspections, treatment completion, and trap condition updates.
*   Build public location status UI using Gray, Yellow, Orange, Red, and Green states.
*   Build task lists, route progress views, and status badges.
*   Build dashboard cards for counts, overdue tasks, high-risk areas, route coverage, and treatment progress.
*   Build export/report buttons and frontend states for CSV/PDF generation.

### Key Screens
*   Login / role selection.
*   City dashboard.
*   Barangay dashboard.
*   Citizen report form.
*   Citizen public status view.
*   Inspector task list.
*   Inspector route/activity screen.
*   Inspection validation form.
*   Sentinel trap check form for inspectors.
*   Treatment team task list.
*   Treatment route/activity screen.
*   Treatment completion form.
*   Monitoring / follow-up list.
*   Reports page.

### Deliverables
*   Responsive frontend app.
*   Reusable UI components for status badges, task cards, forms, filters, and role navigation.
*   Frontend integration with backend API.
*   Frontend integration with map components owned by Dev 3.
*   Basic loading, empty, error, and offline-friendly states.

### Needs From Dev 2
*   API contracts.
*   Authentication and role permissions.
*   Task, report, route, treatment, status, and user data.
*   Export endpoints.

### Needs From Dev 3
*   Map component API.
*   Layer definitions.
*   Route trail and coverage rendering.
*   Map marker/status color rules.

## Dev 2: Backend Engineer

### Primary Responsibilities
*   Design and implement the database schema.
*   Build authentication and role-based access control.
*   Build APIs for all user workflows.
*   Implement task assignment and workflow state transitions.
*   Implement basic rule-based risk scoring.
*   Implement public citizen status logic with Green status expiration.
*   Implement CSV/PDF export support.
*   Store photos, notes, route trails, and status histories.
*   Support optional/simulated Sentinel trap data ingestion.

### Core Data Models
*   Users.
*   Roles and permissions.
*   Barangays / zones / areas.
*   Citizen reports.
*   Inspection tasks.
*   Treatment tasks.
*   Routes.
*   Route points.
*   GPS trail points.
*   Site statuses.
*   Public location statuses.
*   Monitoring periods.
*   Sentinel devices.
*   Sentinel readings.
*   Device maintenance records.
*   Photos / attachments.
*   Audit logs.

### Key APIs
*   Auth/login/session.
*   User and role management.
*   Citizen report submission.
*   Report triage.
*   Task assignment.
*   Inspector task list.
*   Start/pause/resume/complete route.
*   Inspection result submission.
*   Treatment task list.
*   Treatment completion submission.
*   Monitoring and follow-up scheduling.
*   Public location status lookup.
*   Risk score calculation.
*   Sentinel device CRUD.
*   Sentinel trap check/update.
*   Simulated Sentinel reading ingestion.
*   Dashboard summaries.
*   CSV/PDF exports.

### Workflow Rules
*   Citizen report starts as Submitted.
*   Barangay admin reviews and marks it Under Review, Duplicate, Rejected, or Scheduled for Inspection.
*   Inspector validates the site and marks No Breeding Found, Confirmed, Need Revisit, or Unable to Access.
*   Confirmed sites create treatment tasks.
*   Treatment completion moves site into Monitoring.
*   Monitoring expires into Cleared if no new issue appears.
*   Green public status expires after the configured period.
*   Red public status is triggered by confirmed breeding, unresolved high-risk alert, or repeated reports.
*   Sentinel trap activity can create inspection recommendations, but does not automatically confirm danger.

### Deliverables
*   Database schema and migrations.
*   Backend API.
*   Role and permission system.
*   Workflow state machine.
*   Risk scoring module.
*   Public status expiration logic.
*   Export generation.
*   Seed/demo data.
*   API documentation for Dev 1 and Dev 3.

### Needs From Dev 1
*   UI data requirements.
*   Form payload requirements.
*   Frontend validation needs.

### Needs From Dev 3
*   Spatial data requirements.
*   Route trail format.
*   Map layer data format.
*   Sentinel reading fields and sample payloads.

## Dev 3: Maps & IoT Research Engineer

### Primary Responsibilities
*   Choose and implement the GIS/map stack.
*   Define map layers, marker rules, route trail rendering, and coverage visualization.
*   Define spatial data structures for barangays, zones, route points, checked areas, and public status areas.
*   Research practical Sentinel trap integration options.
*   Prototype simulated Sentinel trap data for the MVP.
*   Define IoT payload structure for future hardware integration.
*   Support Dev 1 with map components and Dev 2 with spatial/backend requirements.

### Map Responsibilities
*   Build the map component used by city, barangay, inspector, treatment, and citizen views.
*   Display operational layers:
    *   Citizen reports.
    *   Confirmed breeding sites.
    *   Inspection routes.
    *   Treatment routes.
    *   Treatment status.
    *   Cleared areas.
*   Display coverage layers:
    *   Checked areas.
    *   Unchecked areas.
    *   Scheduled areas.
    *   Skipped areas.
    *   Need Revisit areas.
    *   Completed route trails.
*   Display citizen public status colors:
    *   Gray: Neutral / Not Yet Checked.
    *   Yellow: Scheduled.
    *   Orange: Monitoring.
    *   Red: Danger / High Risk.
    *   Green: Recently Checked / Cleared.
*   Display Sentinel layers:
    *   Smart Ovitrap locations.
    *   Smart Mosquito Trap locations.
    *   Device health.
    *   Last reading.
    *   Maintenance status.

### IoT Research Responsibilities
*   Research Smart Ovitrap and Smart Mosquito Trap hardware options.
*   Identify realistic sensor fields for MVP/pilot:
    *   Device ID.
    *   Device type.
    *   GPS/location.
    *   Battery level.
    *   Water level.
    *   Temperature.
    *   Humidity.
    *   Insect entry events.
    *   Last transmission time.
    *   Signal strength/connectivity.
    *   Maintenance status.
*   Compare connectivity options:
    *   Wi-Fi.
    *   GSM/LTE.
    *   LTE-M.
    *   NB-IoT.
    *   LoRaWAN.
    *   Manual upload during early pilot.
*   Define sample payloads for simulated readings.
*   Define how trap readings influence risk score without overclaiming accuracy.
*   Document limitations: relative activity only, not disease confirmation or laboratory-grade mosquito counts.

### Map/Spatial Data Questions To Resolve
*   Should public status be shown by barangay, zone, street segment, block, or radius?
*   How should checked and unchecked coverage be represented on the map?
*   How long should Green status remain visible before expiring?
*   What map provider should be used for MVP?
*   Will field routes use live GPS trail tracking or periodic location points?
*   How should offline route tracking be handled?

### Deliverables
*   Recommended map stack.
*   Map layer specification.
*   Reusable map component or integration guide.
*   Spatial data format for backend.
*   Route trail and coverage visualization rules.
*   Public status color rules.
*   Sentinel device data model recommendation.
*   Simulated Sentinel payload examples.
*   IoT integration research notes.

### Needs From Dev 1
*   Map UI placement and interaction requirements.
*   Required map controls, filters, and layer toggles.
*   Mobile inspector/treatment route UI needs.

### Needs From Dev 2
*   API format for map layers.
*   Backend storage constraints.
*   Risk-score input requirements.
*   Sentinel device and reading API structure.

## Cross-Team Integration Plan

### Week 1: Foundation
*   Dev 1 creates app shell, navigation, basic role screens, and form wireframes.
*   Dev 2 creates schema, auth, seed data, and first API contracts.
*   Dev 3 selects map stack, defines spatial formats, and drafts Sentinel data model.

### Week 2: Core Workflows
*   Dev 1 builds citizen report, admin dashboard, inspector task list, and treatment task list.
*   Dev 2 builds report/task/route/status APIs and workflow transitions.
*   Dev 3 builds map layers for reports, routes, statuses, and coverage.

### Week 3: Field Operations
*   Dev 1 builds route activity screens and inspection/treatment forms.
*   Dev 2 builds route tracking, GPS trail storage, photo upload, and monitoring logic.
*   Dev 3 integrates route trail visualization and checked/unchecked coverage display.

### Week 4: Sentinel + Reporting
*   Dev 1 builds sentinel trap check form and reporting screens.
*   Dev 2 builds sentinel device/readings APIs, simulated ingestion, risk scoring, and exports.
*   Dev 3 provides simulated Sentinel payloads, trap layer rendering, and IoT research summary.

### Week 5: MVP Polish
*   Dev 1 completes responsive polish and empty/loading/error states.
*   Dev 2 completes permissions, audit logs, status expiration, and demo data.
*   Dev 3 completes layer toggles, public status map, and route coverage QA.

## Integration Handoffs

### Frontend to Backend
*   Form payloads.
*   Required dashboard summary fields.
*   Required task status labels.
*   Public status display requirements.

### Backend to Frontend
*   API documentation.
*   Auth/session behavior.
*   Role permissions.
*   Workflow status transitions.
*   Error responses.

### Maps/IoT to Frontend
*   Map component behavior.
*   Layer toggle behavior.
*   Marker icons/colors.
*   Route trail rendering.
*   Public status color rendering.

### Maps/IoT to Backend
*   Spatial data schema.
*   Route trail format.
*   Sentinel device fields.
*   Sentinel reading payloads.
*   Risk-score spatial inputs.

## MVP Priority Order
1. Citizen report submission.
2. City/barangay dashboard with map.
3. Task assignment.
4. Inspector route tracking and validation.
5. Treatment task tracking.
6. Public location status.
7. Monitoring and Green status expiration.
8. Basic risk scoring.
9. CSV/PDF reporting.
10. Simulated Sentinel trap integration.
