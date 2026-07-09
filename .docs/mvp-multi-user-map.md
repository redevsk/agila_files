# AGILA Map MVP: Multi-User Vector Surveillance Operations

## Core Idea

The MVP is a map-first operations tool for dengue vector surveillance. It helps a city, barangay teams, sentinel/device pilots, field staff, and residents share one prevention loop:

**Plan -> Detect -> Prioritize -> Act -> Monitor**

The map is the primary interface. Every user sees the same operating reality at the right level of detail for their role:

- City users see cross-barangay risk, coverage, resources, and reporting.
- Barangay and sentinel-network users see local tasks, inspections, devices, routes, and treatment progress.
- Residents see simplified public area status and report progress without exposing sensitive internal data.

The MVP should prove the operational value of proactive surveillance before requiring full hardware deployment or advanced prediction.

## Product Promise

AGILA helps LGUs answer four daily questions:

1. Which areas should we inspect first?
2. What has already been checked, skipped, treated, or left unresolved?
3. Where do field teams, barangays, and sentinel signals agree that risk is rising?
4. What can residents safely know about their area and their submitted reports?

## MVP Roles

### 1. City Command Center

The city role owns the full operating picture across barangays.

Primary map needs:

- Citywide risk map by barangay, zone, hotspot, and route coverage.
- Active reports, scheduled inspections, confirmed breeding sites, treatments, monitoring areas, and cleared areas.
- Barangay comparison by risk score, overdue coverage, unresolved reports, recurring sites, and treatment backlog.
- Sentinel inventory and health if a device pilot is enabled.

Core actions:

- Configure risk scoring rules, monitoring period, public status expiration, and surveillance cadence.
- Assign or rebalance inspectors, treatment teams, supplies, and patrol routes across barangays.
- Review citywide performance metrics.
- Export CSV/PDF reports for city health-office reporting, council briefings, DOH coordination, and program evaluation.

Success signal:

- City users can identify high-risk areas, coverage gaps, and resource bottlenecks in under one minute.

### 2. Barangay + Sentinel Network

The barangay role owns local triage and ground coordination. The sentinel network is treated as a local early-warning layer, not a replacement for human validation.

Primary map needs:

- Barangay map of reports, scheduled zones, route progress, confirmed sites, treatment status, monitoring areas, and cleared zones.
- Zone list sorted by explainable risk score.
- Sentinel device locations, maintenance status, last signal, and validation tasks when enabled.
- Coverage states: Scheduled, In Progress, Checked, Unchecked, Skipped, Need Revisit, Confirmed, Scheduled for Treatment, Treated, Unable to Treat, Monitoring, and Cleared.

Core actions:

- Triage resident reports and remove duplicates.
- Assign inspection, preventive patrol, sentinel-check, and follow-up tasks.
- Convert confirmed inspections into treatment work orders.
- Track route coverage and unresolved field outcomes.
- Export barangay-level summaries for local operations and city submission.

Sentinel MVP behavior:

- A device signal can raise zone priority or create a validation task.
- A maintenance issue can create a field check.
- A sentinel signal does not confirm dengue, mosquito counts, or a breeding site.
- All sentinel-driven risk must be explainable on the map.

Success signal:

- Barangay users can move from "new signal/report" to "assigned validation task" without leaving the map workflow.

### 3. Field Inspectors and Treatment Teams

Field users turn map priorities into verified outcomes.

Primary map needs:

- Mobile-friendly task list and route map.
- Current route progress and coverage status.
- Location details for scheduled zones, reports, sentinel checks, follow-ups, and treatment sites.
- Before/after documentation for confirmed and treated locations.

Core actions:

- Start, pause, resume, and complete inspection or treatment routes.
- Mark points as Checked, Skipped, Need Revisit, Confirmed, Treated, Unable to Treat, or Monitoring.
- Upload photos and notes.
- Record actual route trail where privacy policy allows.
- Trigger treatment from confirmed breeding-site findings.

Success signal:

- Field users can complete a route and update the shared map without paper handoff.

### 4. Residents

Residents get a simplified public-facing view that supports awareness and trust without exposing sensitive operational details.

Primary map needs:

- Generalized public status by zone, street segment, block, or barangay area.
- Report submission with photo, location, and description.
- Report status tracking.

Public statuses:

- Gray: Neutral / Not Yet Checked
- Yellow: Scheduled
- Orange: Monitoring
- Red: Danger / High Risk
- Green: Recently Checked / Cleared

Privacy rules:

- Public map status is generalized, not household-level.
- Resident identity, exact report location, photos, and internal notes are visible only to authorized users.
- Green status expires after a configured period, such as 7, 14, or 30 days.

Success signal:

- Residents can submit a report and see its status without seeing private operational data.

## Core Map Layers

### Operational Layers

- Scheduled surveillance zones
- Citizen reports
- Inspection tasks
- Confirmed breeding sites
- Treatment work orders
- Monitoring areas
- Cleared areas

### Coverage Layers

- Checked areas
- Unchecked areas
- Skipped locations
- Need-revisit locations
- Inspection route trails
- Treatment route trails

### Sentinel Layers

- Device locations
- Device maintenance state
- Last signal status
- Activity or uncertainty flags
- Validation tasks created from sentinel inputs

### Analytics Layers

- Risk heatmap
- Historical hotspots
- Recurrence areas
- Barangay score comparison
- Overdue routine surveillance

### Public Layers

- Generalized public area status
- Report progress for the submitting resident
- Public advisories by area

## Explainable Risk Model

The MVP uses transparent rule-based scoring. The goal is not advanced GIS modeling; the goal is to sort inspection priorities clearly.

Example scoring:

- +30 if historical hotspot
- +25 if not checked in 14 days
- +20 if Green status expires soon
- +20 if resident report is assigned to the zone
- +15 if sentinel signal or maintenance uncertainty needs validation
- +10 if dense residential area
- +10 if drainage/canal area
- +10 if skipped or unchecked in the last route

Priority bands:

- 0-24: Low
- 25-49: Medium
- 50-74: High
- 75+: Critical

Every risk score should display its reasons, for example:

> Critical: historical hotspot, overdue by 18 days, two unresolved resident reports, nearby sentinel maintenance uncertainty.

## Primary MVP Screens

### City Dashboard

- City map with barangay risk coloring.
- Barangay ranking table.
- Resource and backlog summary.
- Cross-barangay route completion.
- Export controls.

### Barangay Operations Map

- Local map with zone status, reports, tasks, routes, devices, and treatment progress.
- Risk-ranked zone queue.
- Task assignment drawer.
- Report triage panel.

### Sentinel Network View

- Device list and map overlay.
- Device health, maintenance due date, last signal, and validation status.
- Convert signal or maintenance issue into field task.

### Field Mobile View

- My route.
- Task cards.
- Status update form.
- Photo upload.
- Start/pause/resume/complete route actions.

### Resident Public View

- Public area status map.
- Submit report.
- Track my report.
- Area advisory status.

## MVP Data Objects

### Zone

- id
- name
- barangay
- center lat/lng
- optional boundary GeoJSON
- density level
- drainage/canal risk flag
- historical hotspot flag
- last checked date
- public status
- risk score
- risk reasons

### Report

- id
- submitted by resident or anonymous channel
- generalized public area
- precise internal location
- description
- photo attachments
- triage status
- linked zone
- linked inspection task

### Task

- id
- type: inspection, sentinel check, treatment, follow-up, preventive patrol
- assigned role or staff
- zone or location
- priority
- status
- due date
- evidence
- resulting map status

### Route

- id
- type: inspection or treatment
- assigned team
- planned stops
- actual coverage trail
- route progress
- skipped points
- need-revisit points

### Sentinel Device

- id
- name
- location
- barangay
- health status
- battery or power status
- maintenance due date
- last signal
- validation status

## Build Priorities

### Must Have

- Map with role-specific layer toggles.
- City, barangay, field, and resident modes.
- Zone-based risk scoring with visible reasons.
- Report triage and task creation.
- Inspection and treatment status lifecycle.
- Public status model with expiration.
- CSV/PDF export placeholders or basic exports.
- Demo seed data for one city and several barangays.

### Should Have

- Simulated sentinel device layer.
- Route progress and coverage states.
- Before/after evidence model.
- Monitoring period workflow.
- Barangay comparison dashboard.

### Later

- Real IoT ingestion.
- Offline-first sync.
- Weather/rainfall API.
- Advanced spatial analysis.
- Predictive modeling.
- Multi-city or provincial hierarchy.

## MVP Success Metrics

- Time from report/sentinel signal to assigned inspection.
- Percent of high-risk zones inspected before resident complaints.
- Percent of preventive routes completed on time.
- Time from confirmed breeding site to treatment completion.
- Route coverage completed versus skipped.
- Number of unresolved high-risk locations.
- Recurrence after treatment.
- Percent of confirmed sites with before/after documentation.
- Staff adoption by barangay, inspector, and treatment teams.

## Non-Goals

- Clinical dengue diagnosis.
- Automatic confirmation from sentinel devices.
- Household-level public exposure.
- Large-scale hardware dependency.
- Complex AI prediction for the first MVP.
- Full GIS backend such as PostGIS unless the implementation already needs it.
