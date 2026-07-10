# AGILA MVP Demo Workflows

## Demo Goal

The demo should show how one map serves different users while preserving the same operational loop:

**Plan -> Detect -> Prioritize -> Act -> Monitor**

The best demo story is a single incident moving through city oversight, barangay triage, sentinel validation, field inspection, treatment, monitoring, and resident-facing status updates.

## Demo Dataset

Use one city with three barangays:

- Barangay A: dense residential area with drainage corridor and historical hotspot.
- Barangay B: school/market zone with overdue routine inspection.
- Barangay C: lower-risk area with one new resident report.

Seed these records:

- 8 surveillance zones.
- 5 resident reports.
- 3 simulated sentinel devices.
- 2 inspection routes.
- 1 treatment route.
- 2 historical hotspots.
- 1 monitoring area.
- 1 recently cleared Green zone with expiration soon.

## Demo Roles

### City Health Officer

Purpose: See the citywide situation and allocate resources.

Demo steps:

1. Open the city map.
2. Toggle risk heatmap, reports, scheduled inspections, treatment status, and sentinel layers.
3. Select Barangay A, which appears High or Critical.
4. Review risk reasons: historical hotspot, overdue inspection, unresolved reports, drainage risk, and sentinel maintenance uncertainty.
5. Reassign one inspection team from Barangay C to Barangay A.
6. Export a city summary report.

What this proves:

- City users can see where risk is rising.
- The map supports resource allocation, not just visualization.
- Risk is explainable instead of a black box.

### Barangay Coordinator

Purpose: Turn local signals into assigned fieldwork.

Demo steps:

1. Open Barangay A operations map.
2. Review the zone queue sorted by risk.
3. Triage a new resident report and mark it accepted.
4. Notice a nearby sentinel device with maintenance uncertainty.
5. Create one combined validation task for the report, hotspot, and sentinel check.
6. Assign the task to a field inspector route.
7. Set public status for the area to Yellow: Scheduled.

What this proves:

- Barangay staff can consolidate multiple signals into one field task.
- Sentinel data helps prioritize, but human validation remains required.
- Public status can update without exposing exact household details.

### Sentinel Network Operator

Purpose: Show the sentinel layer as an early-warning and maintenance workflow.

Demo steps:

1. Open the sentinel network view.
2. Filter devices by "needs validation" or "maintenance due."
3. Select Sentinel A-02.
4. Review device details: location, last signal, maintenance due date, and linked zone.
5. Convert the device issue into a sentinel-check task or attach it to an existing inspection route.
6. Confirm that the related zone risk score increases with a visible reason.

What this proves:

- Sentinel devices are operational assets.
- Device issues become field work.
- The MVP does not claim automated dengue confirmation.

### Field Inspector

Purpose: Complete validation work from the mobile map.

Demo steps:

1. Open "My Route."
2. Start the assigned inspection route.
3. Visit the first zone and mark it Checked: no breeding found.
4. Visit the report/sentinel/hotspot location.
5. Record breeding confirmed, add notes, and attach a photo.
6. Mark one blocked location as Need Revisit.
7. Complete the route.
8. Confirm that the map updates checked, confirmed, and need-revisit coverage.

What this proves:

- Field activity closes the gap between plan and evidence.
- Route coverage is visible.
- Confirmed findings can trigger downstream treatment.

### Treatment Team

Purpose: Resolve confirmed sites and start monitoring.

Demo steps:

1. Open treatment work orders.
2. Select the confirmed site from the inspector workflow.
3. Start treatment route.
4. Upload before photo.
5. Mark cleanup/source removal or larvicide action complete.
6. Upload after photo.
7. Set area to Orange: Monitoring.
8. Schedule follow-up inspection.

What this proves:

- Treatment is part of the same lifecycle.
- Before/after documentation is captured.
- The workflow does not end at confirmation.

### Resident

Purpose: Show public transparency without exposing sensitive operations.

Demo steps:

1. Open resident map.
2. View generalized status for the area: Yellow, Orange, Red, Green, or Gray.
3. Submit a report with location, description, and photo.
4. Track the submitted report status: Received -> Under Review -> Scheduled -> Checked -> Closed or Monitoring.
5. View area status change after barangay action.

What this proves:

- Residents can participate without accessing internal records.
- Public status is understandable.
- Privacy boundaries are respected.

## Full Demo Script

### Scene 1: City Detects a Rising Risk Area

The city dashboard opens with Barangay A highlighted as Critical. The city user selects the barangay and sees these risk reasons:

- Historical hotspot.
- Last inspection was over 14 days ago.
- Two unresolved resident reports.
- Drainage/canal risk.
- Sentinel maintenance uncertainty.

The city user assigns additional inspection capacity to Barangay A.

### Scene 2: Barangay Creates a Unified Validation Task

The barangay coordinator opens the local operations map. Instead of creating separate tasks for each signal, they combine one resident report, one hotspot check, and one sentinel maintenance check into a route stop. The zone public status becomes Yellow: Scheduled.

### Scene 3: Field Inspector Validates the Site

The inspector starts the route on mobile. One scheduled zone is checked and cleared. The high-risk stop confirms a breeding source. The inspector uploads evidence, marks the exact internal location as Confirmed, and marks one nearby location as Need Revisit because access was blocked.

### Scene 4: Treatment Team Acts

The treatment team receives a work order from the confirmed site. They perform source removal, upload before/after photos, and mark the site Treated. The public status changes from Red to Orange: Monitoring.

### Scene 5: Monitoring Closes the Loop

After the configured monitoring period, a follow-up inspection finds no recurrence. The zone is marked Cleared, and public status becomes Green with an expiration date. When Green expires, the area returns to Gray unless another follow-up keeps it cleared.

## Demo Navigation

Suggested demo tabs or mode switcher:

- City
- Barangay
- Sentinel
- Field
- Resident

Each mode should keep the map visible and change the side panel:

- City panel: barangay rankings, resource allocation, exports.
- Barangay panel: risk queue, report triage, task assignment.
- Sentinel panel: device list, health, validation tasks.
- Field panel: route progress, task forms, evidence upload.
- Resident panel: public status, submit report, track report.

## Workflow State Changes

### Report Lifecycle

Received -> Under Review -> Accepted -> Scheduled for Inspection -> Checked -> Closed

Alternative path:

Received -> Under Review -> Duplicate or Rejected

### Inspection Lifecycle

Scheduled -> In Progress -> Checked

Alternative outcomes:

- Skipped
- Need Revisit
- Confirmed

### Treatment Lifecycle

Confirmed -> Scheduled for Treatment -> Treated -> Monitoring -> Cleared

Alternative outcomes:

- Unable to Treat
- Follow-up Needed
- Reopened

### Public Status Lifecycle

Gray -> Yellow -> Red -> Orange -> Green -> Gray

Common paths:

- Gray -> Yellow when inspection is scheduled.
- Yellow -> Green when inspection finds no breeding issue.
- Yellow -> Red when breeding is confirmed.
- Red -> Orange when treatment is completed and monitoring starts.
- Orange -> Green when follow-up clears the area.
- Green -> Gray when public status expires.

## Prototype Requirements

### Minimum Interactive Demo

- Role/mode switcher.
- Map with fake zones and markers.
- Layer toggles.
- Risk-ranked zone queue.
- Task details panel.
- Buttons that advance the selected record through the workflow.
- Public status colors.
- Seeded demo records.

### Nice-to-Have Demo Polish

- Timeline for selected zone.
- Animated route progress.
- Before/after image placeholders.
- Export summary button that creates a mock PDF/CSV state.
- "Why this priority?" explanation panel.
- Resident view that hides internal precision and evidence.

## Acceptance Checklist

- City user can identify and act on a high-risk barangay.
- Barangay user can triage a report and create an inspection task.
- Sentinel issue can raise priority and become a validation task.
- Field inspector can complete route steps and confirm a site.
- Treatment team can mark work complete and start monitoring.
- Resident can submit a report and see generalized status.
- Risk score reasons are visible.
- Public status never exposes exact household-level details.
- The demo can be completed in 5 to 7 minutes.
