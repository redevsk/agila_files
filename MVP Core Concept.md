# MVP Core Concept: Vector Surveillance Operations Platform with Sentinel Network

## Positioning
This platform should be presented first as a practical operations system for Local Government Units (LGUs): a GIS-based tool that turns reports, inspections, treatment actions, and optional sentinel-device signals into prioritized field tasks.

The Sentinel Network is a powerful differentiator, but the MVP should not depend on full hardware deployment to prove value. The first version should prove that better data routing, map-based prioritization, and closed-loop field workflows help LGUs inspect faster, treat confirmed sites, and monitor recurrence.

## 1. Problem Statement
Current dengue prevention efforts are largely reactive. Local Government Units (LGUs) rely on manual inspections, paper-based records, and citizen reports, making it difficult to identify breeding sites early, prioritize inspections, and maintain continuous surveillance.

The proposed platform provides a centralized GIS-based (Geographic Information Systems) surveillance and response system. It can be enhanced with an IoT Sentinel Network that monitors mosquito activity and surveillance assets, but its core value is the operational loop from detection to validation, treatment, and monitoring.

## 2. The Core MVP Loop & Workflow
To create a Minimum Viable Product (MVP), we focus on a streamlined workflow:
**Detect** (Reports, Inspections, Optional Sensors) -> **Locate** (GIS Map) -> **Act** (Field App) -> **Monitor** (Follow-up Status)

### Core Operations Workflow
1. **Transmit:** Citizens, inspectors, and optional Smart Devices (Ovitraps/Mosquito Traps) submit reports, inspection results, and environmental/activity data.
2. **Ingest:** GIS Command Center receives data.
3. **Assess:** Risk Assessment Engine analyzes data to generate inspection recommendations and priority levels.
4. **Validate:** Field Inspectors visit the site and validate findings.
   * *If No Breeding Found:* Close Alert.
   * *If Breeding Confirmed:* Trigger Treatment Team.
5. **Treat & Monitor:** Treatment Team resolves the issue, and the area enters a Monitoring Period. The GIS is updated throughout this lifecycle.

### MVP Scope Discipline
The first MVP should focus on:
*   GIS dashboard for reports, inspections, confirmed sites, treatment status, cleared/monitoring areas, and route coverage.
*   Mobile-friendly inspection and treatment workflows.
*   Field activity tracking for checked, unchecked, and scheduled inspection/treatment areas.
*   Simple, explainable risk scoring.
*   Manual data entry and CSV/PDF export for LGU reporting.
*   Optional simulated, manually uploaded, or limited-pilot sentinel data.

The MVP should avoid depending on large-scale hardware deployment, advanced AI prediction, or laboratory-grade mosquito counts.

## 3. Target Users & Actions

### A. City Administrator / City Health Office (The Command Center)
The city-level role manages the full operating picture across all barangays.
*   **Citywide GIS Dashboard & Analytics:** View active reports, confirmed breeding sites, treatment status, sentinel devices if enabled, risk heatmaps, recurrence areas, and environmental trends across the city.
*   **Cross-Barangay Risk Assessment:** Compare barangay-level risk scores and identify citywide hotspots that need additional resources.
*   **Resource Allocation:** Assign or rebalance Field Inspectors, Treatment Teams, supplies, and equipment across barangays.
*   **Device Oversight:** Manage the full Sentinel Device inventory, deployment areas, maintenance status, and replacement needs when the pilot hardware layer is enabled.
*   **City Reporting:** Export consolidated CSV/PDF summaries for city health-office reporting, council briefings, DOH coordination, and program evaluation.
*   **Policy & Configuration:** Set citywide risk-scoring rules, monitoring periods, user roles, and escalation thresholds.

### B. Barangay Administrator / Barangay Health Worker Lead (The Local Coordinator)
The barangay-level role manages local validation, task coordination, and ground-level follow-through within their assigned barangay.
*   **Barangay GIS View:** View reports, inspections, confirmed sites, treatment status, cleared areas, and monitoring locations within the barangay.
*   **Local Task Assignment:** Assign validation visits and follow-up inspections to barangay staff or request city-level support when needed.
*   **Report Triage:** Review citizen reports, remove duplicates, flag urgent locations, and mark reports for inspection.
*   **Treatment Coordination:** Coordinate cleanup, larvicide application, source removal, and before/after documentation for confirmed sites.
*   **Local Reporting:** Export barangay-level summaries for local meetings, daily operations, and submission to the city health office.
*   **Community Follow-up:** Track recurring sites, household follow-ups, and community education needs after treatment.

### C. Field Inspector (The Eyes)
*   **Inspection Tasks:** Receive assigned routes, routine surveillance tasks, and alerts.
*   **Route Tracking:** Start, pause, resume, and complete an inspection route, similar to an activity tracker.
*   **Coverage Status:** See which streets, blocks, households, or inspection points are Scheduled, Checked, Unchecked, Skipped, or Need Revisit.
*   **GPS Trail:** Record the path taken during fieldwork to show actual coverage, with privacy controls for staff location history.
*   **Validation:** Validate citizen reports and sentinel alerts on-site.
*   **Documentation:** Record findings (Yes/No), upload photos, and update site status via a mobile-friendly view.

### D. Treatment Team / Sanitation Personnel (The Muscle)
*   **Assignments:** Receive work orders and scheduled treatment routes for confirmed breeding sites.
*   **Treatment Route Tracking:** Start, pause, resume, and complete treatment runs, showing which sites have been treated, missed, or scheduled for follow-up.
*   **Coverage Status:** See Confirmed, Scheduled for Treatment, Treated, Unable to Treat, and Follow-up Needed locations.
*   **Action:** Perform cleanup, apply larvicides, and remove breeding sources.
*   **Documentation:** Upload Before/After photos and mark treatment as complete.

### E. Citizen (Optional for MVP)
*   **Reporting:** Submit geo-tagged reports of mosquito activity or breeding sites with photos.
*   **Tracking:** Track the status of their submitted reports.
*   **Location Status:** View a simplified public status for their area using clear colors: Gray for neutral/not yet checked, Red for danger/high-risk, Green for recently checked/cleared, and Yellow/Orange for scheduled inspection or monitoring.
*   **Status Expiration:** Understand that a Green status is temporary and expires after a configured period, returning to Neutral or Monitoring unless a follow-up inspection keeps it cleared.
*   **Privacy Boundary:** Citizen identity, exact household location, and uploaded photos must be protected and shown only to authorized personnel.

## 4. Core MVP Modules

### Module 1: GIS Command Center
The central map interface. It displays multiple layers:
*   **Operational Layers:** Citizen Reports, Confirmed Breeding Sites, Inspection Routes, Treatment Routes, Treatment Status, Cleared Areas.
*   **Coverage Layers:** Checked Areas, Unchecked Areas, Scheduled Areas, Skipped Areas, Need Revisit Areas, and Completed Route Trails.
*   **Sentinel Layers:** Smart Ovitraps and Smart Mosquito Traps, if enabled during a pilot.
*   **Analytics Layers:** Risk Heatmap, Historical Hotspots, Environmental Trends, and Recurrence Areas.
*   **Reporting Tools:** Exportable summaries for inspections completed, treatments completed, unresolved alerts, and recurring hotspots.

### Module 2: Sentinel Network
Functions as an early warning system to prioritize inspections, rather than replacing inspectors. For the MVP, this module should be treated as an optional pilot layer or simulated data source until the operations workflow is proven.

The network uses two distinct types of devices to capture different vector-activity signals:
*   **Smart Ovitrap (Focus: Breeding):** Targeted at the mosquito's reproductive cycle. It monitors operational status (Water Level, Temp, Humidity, Battery, Maintenance Dates) to detect maintenance needs, ensure traps remain viable for egg-laying, and maintain inspection history.
*   **Smart Mosquito Trap (Focus: Adult Movement):** Targeted at active, flying mosquitoes. It monitors relative adult mosquito activity (Insect Entry Events via IR, Temp, Humidity, Battery) to identify movement spikes, map hotspots, and trigger early inspections. *(Note: Reports relative activity, not laboratory-accurate counts).*

Important limitation: Sentinel devices provide operational signals and relative activity trends. They do not confirm dengue presence, replace human validation, or provide exact mosquito population counts.

### Module 3: Risk Assessment Engine
Calculates a dynamic Risk Score using multiple inputs to prioritize higher-risk areas for inspection. The MVP should use a transparent, rule-based model before introducing advanced AI.

Initial factors include:
*   Recent citizen reports and unresolved alerts.
*   Inspection results, especially confirmed breeding sites.
*   Historical breeding sites and recurring hotspot areas.
*   Treatment history and recurrence after treatment.
*   Smart Mosquito Trap activity and Smart Ovitrap maintenance status, if available.
*   Temperature and humidity, with rainfall/weather APIs reserved for V2+.

The score must be explainable so LGU staff can see why a location was marked Low, Medium, High, or Critical Risk.

### Module 4: Inspection & Treatment Management
*   **Inspection Workflow:** Manages routine inspections, report/alert validations, inspection history, and GIS status updates.
*   **Treatment Management:** Dispatches teams upon confirmation for cleanup, larvicide application, and source elimination, capturing before/after documentation.
*   **Field Activity Tracking:** Tracks assigned routes, actual GPS trails, route progress, checked/unchecked coverage, skipped locations, and scheduled follow-ups for inspectors and treatment teams.
*   **Coverage Status Model:** Uses clear operational statuses such as Scheduled, In Progress, Checked, Unchecked, Skipped, Need Revisit, Confirmed, Scheduled for Treatment, Treated, Unable to Treat, Monitoring, and Cleared.

### Module 5: Monitoring Period
After treatment, the area enters "Monitoring" status. Routine inspections continue for an agreed period. If no breeding activity is observed, the area is marked "Cleared". If activity reappears, the site returns to "High Risk".

### Module 6: Citizen Location Status
Provides a simplified public-facing location status so residents can understand the current condition of their area without exposing internal operational details.

Suggested public color/status model:
*   **Gray - Neutral / Not Yet Checked:** No recent inspection, no confirmed danger, or status has expired.
*   **Yellow - Scheduled:** The area is scheduled for inspection or follow-up.
*   **Orange - Monitoring:** The area was recently treated or flagged and is being watched during the monitoring period.
*   **Red - Danger / High Risk:** Confirmed breeding site, repeated reports, unresolved high-risk alert, or urgent treatment needed.
*   **Green - Recently Checked / Cleared:** Recently inspected or treated with no active breeding found.

Green status should always expire after a city-configured period, such as 7, 14, or 30 days, because conditions can change quickly after rain, missed containers, or new breeding sources. When Green expires, the status returns to Gray or Orange depending on the monitoring rules.

Public status should be generalized by area, street segment, block, or barangay zone rather than exposing exact household-level findings. Internal staff can see more precise operational data based on role permissions.

## 5. MVP Success Metrics
The MVP should be validated against measurable operational outcomes:
*   Reduction in time from report/alert creation to inspection assignment.
*   Reduction in time from confirmed breeding site to treatment completion.
*   Percentage of inspection tasks completed on time.
*   Percentage of assigned route coverage completed.
*   Number of unchecked or skipped locations remaining after each route.
*   Percentage of confirmed sites with before/after documentation.
*   Recurrence rate after treatment.
*   Number of unresolved high-risk locations.
*   Staff adoption rate by inspectors and treatment teams.

## 6. Key Risks & Considerations
*   **Hardware Dependency:** Large-scale sentinel deployment introduces battery, connectivity, waterproofing, calibration, vandalism, procurement, and maintenance risks. Keep it optional for the MVP.
*   **False Reports & Spam:** Citizen reports must be validated before triggering treatment.
*   **Privacy & Data Protection:** Geo-tagged reports, household photos, citizen contact details, and health-adjacent location data need role-based access and audit trails.
*   **Offline Field Conditions:** Field teams may have weak connectivity. Offline-first mobile workflows may need to move earlier if the pilot area has unreliable signal.
*   **Operational Fit:** LGU and barangay workflows may require printable reports, CSV exports, role-based permissions, and simple language rather than complex analytics.
*   **No Clinical Diagnosis:** The system supports vector surveillance and field operations. It does not diagnose dengue cases or confirm disease transmission.
*   **Local Calibration:** Risk weights should be tuned with local inspection history because mosquito activity, rainfall patterns, and reporting behavior vary by area.

## 7. Future Expansion (V2+)
Once the core MVP loop is proven, the system can be scaled with these advanced features:
*   **Advanced Risk Modeling:** Upgrade the risk engine to include external weather APIs (rainfall forecasting) to predict outbreaks rather than just react.
*   **Offline-First Mobile Apps:** Enable field teams to geocode and log data without a cellular connection, syncing automatically when back online.
*   **Public GIS Portal:** Open a version of the dashboard to the public showing neighborhood risk heatmaps, cleared areas, and health alerts.
*   **Hardware Scaling:** Deploy fully integrated, solar-powered "smart" ovitraps with NB-IoT/LTE-M connectivity.
*   **Advanced Hierarchical Management:** Expand role-based access for provincial, regional, or multi-city coordination beyond the city/barangay MVP structure.
