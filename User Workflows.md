# User Workflows: Vector Surveillance Operations Platform

## 1. City Administrator / City Health Office Workflow

### Purpose
Manage the citywide dengue surveillance and response program across all barangays.

### Daily Workflow
1. **Open City GIS Dashboard**
   * Review citywide map of active reports, high-risk areas, confirmed breeding sites, treatment status, monitoring areas, and cleared areas.
   * Check barangay-level risk scores and compare which barangays need attention.
   * Review scheduled preventive surveillance routes, overdue routine checks, and coverage gaps.

2. **Review Alerts and Risk Changes**
   * Identify new high-risk reports, repeated reports, unresolved alerts, and areas with recurring breeding sites.
   * Review sentinel-device signals if the pilot hardware layer is enabled.
   * Review sentinel-device health issues, missing transmissions, low battery alerts, and maintenance backlogs.

3. **Prioritize Areas**
   * Mark locations or barangays as Low, Medium, High, or Critical priority.
   * Decide which areas require preventive patrols, immediate inspection, treatment support, or monitoring.

4. **Allocate Resources**
   * Assign or rebalance Field Inspectors, Treatment Teams, supplies, larvicide, equipment, and transport.
   * Assign trained Field Inspectors to deploy, retrieve, clean, refill, repair, or replace sentinel traps.
   * Assign preventive inspection routes to areas with expiring Green status, historical hotspots, overdue checks, or sentinel activity signals.
   * Send city-level support to barangays with high workload or urgent hotspots.

5. **Monitor Field Progress**
   * Track inspection and treatment routes in progress.
   * View checked, unchecked, scheduled, skipped, and need-revisit areas.
   * Follow up on delayed or incomplete tasks.

6. **Review Outcomes**
   * Confirm which sites were inspected, treated, monitored, or cleared.
   * Check recurrence after treatment.
   * Review before/after documentation for confirmed treatment sites.

7. **Generate Reports**
   * Export citywide CSV/PDF reports for city health-office records, DOH coordination, council updates, or program evaluation.

### Key Decisions
* Which barangays need more support?
* Which hotspots should be escalated?
* Which areas need additional monitoring?
* Which areas should be inspected before a citizen report appears?
* Which sentinel traps need maintenance, relocation, or replacement?
* Are current risk-scoring rules and monitoring periods working?

### Key Outputs
* Citywide priority list.
* Assigned inspection and treatment resources.
* Consolidated reports.
* Updated citywide risk and response status.

## 2. Barangay Administrator / Barangay Health Worker Lead Workflow

### Purpose
Coordinate local dengue surveillance, validation, treatment follow-through, and community response within the barangay.

### Daily Workflow
1. **Open Barangay GIS View**
   * Review reports, scheduled inspections, confirmed sites, treatment tasks, sentinel trap locations, monitoring areas, and cleared locations within the barangay.

2. **Triage Citizen Reports**
   * Check new citizen submissions.
   * Remove duplicates.
   * Flag urgent locations.
   * Mark reports for inspection.

3. **Plan Local Routes**
   * Group preventive patrols, nearby reports, routine checks, sentinel checks, historical hotspots, and follow-ups into inspection routes.
   * Mark locations as Scheduled, Unchecked, Need Revisit, or Urgent.

4. **Assign Field Tasks**
   * Assign inspection tasks to Field Inspectors or barangay staff.
   * Assign trap-check tasks for sentinel devices that need water refill, cleaning, retrieval, battery replacement, or physical inspection.
   * Request city-level support if the barangay lacks enough personnel or equipment.

5. **Coordinate Treatment**
   * Review confirmed breeding sites.
   * Assign cleanup, larvicide application, or source-removal tasks to the Treatment Team.
   * Track which sites are Scheduled for Treatment, Treated, Unable to Treat, or Follow-up Needed.

6. **Monitor Local Coverage**
   * Check route progress and GPS trails.
   * Identify streets, blocks, or households that remain unchecked.
   * Schedule revisits for skipped or inaccessible areas.

7. **Update Community Status**
   * Update public-facing location status by area:
     * Gray: Neutral / Not Yet Checked
     * Yellow: Scheduled
     * Orange: Monitoring
     * Red: Danger / High Risk
     * Green: Recently Checked / Cleared
   * Ensure Green status has an expiration date.

8. **Submit Local Reports**
   * Export barangay-level summaries for local operations and submission to the city health office.

### Key Decisions
* Which reports are urgent?
* Which areas should be checked today?
* Which high-risk or overdue areas should be checked even without a report?
* Which sentinel traps need local maintenance or city-level technical support?
* Which sites need treatment or follow-up?
* Which locations should be marked public Red, Yellow, Orange, Green, or Gray?

### Key Outputs
* Local inspection routes.
* Validated reports.
* Treatment requests.
* Updated barangay status map.
* Barangay-level report.

## 3. Field Inspector Workflow

### Purpose
Validate reports, inspect assigned locations, document findings, update coverage status in the field, and handle assigned sentinel trap checks or maintenance tasks.

### Field Workflow
1. **Receive Assigned Route**
   * Open the mobile-friendly field view.
   * Review scheduled inspection points, route order, priority level, and notes.
   * Check which locations are Scheduled, Unchecked, Need Revisit, or Urgent.
   * Review preventive patrol points created from historical hotspots, coverage gaps, expiring Green status, and sentinel signals.
   * Review any assigned sentinel trap stops, including deployment, inspection, cleaning, refill, battery replacement, retrieval, or relocation tasks.

2. **Start Inspection Activity**
   * Tap Start Route.
   * GPS trail begins recording field coverage, similar to an activity tracker.
   * Route status changes to In Progress.

3. **Navigate to Inspection Points**
   * Visit assigned streets, blocks, households, reports, traps, or hotspot locations.
   * Mark each point as Checked, Skipped, Need Revisit, or Unable to Access.

4. **Validate Findings and Trap Conditions**
   * Record whether breeding was found.
   * Add notes, photos, container type, water presence, larvae/pupae observation, and site condition.
   * For sentinel trap stops, record trap condition, water level, battery status, damage, missing device, obstruction, or maintenance needs.
   * If no breeding is found, mark the report as No Breeding Found or Cleared for now.
   * If breeding is confirmed, mark the site as Confirmed and trigger treatment.

5. **Handle Assigned Sentinel Trap Tasks**
   * Deploy new traps by recording trap ID, device type, location, barangay, installation date, placement photo, and maintenance schedule.
   * Inspect existing traps for presence, accessibility, correct placement, water level, battery, sensor condition, physical damage, obstruction, cleanliness, and connectivity.
   * Maintain traps by refilling water, cleaning/resetting the trap, replacing batteries, or flagging damaged parts.
   * Retrieve, replace, or relocate traps that are missing, broken, contaminated, unusable, or poorly positioned.
   * Mark the device as Planned, Active, Needs Maintenance, Offline, Missing, Damaged, Retrieved, or Retired.
   * Flag suspicious readings, missing transmissions, unreliable activity spikes, or abnormal mosquito activity for administrator review.

6. **Pause or Resume Route**
   * Pause the route for breaks, travel interruptions, safety issues, or reassignment.
   * Resume when fieldwork continues.

7. **Complete Route**
   * End the activity when all reachable locations are checked.
   * Review remaining unchecked, skipped, or need-revisit locations.
   * Review remaining sentinel trap tasks that could not be completed.
   * Submit route summary.

8. **Sync Data**
   * Upload GPS trail, inspection results, photos, and status updates.
   * Upload sentinel trap condition updates, maintenance actions, device status changes, and follow-up needs.
   * If offline, save locally and sync when connectivity returns.

### Key Decisions
* Is breeding present?
* Should the site be closed, monitored, or escalated for treatment?
* Was the assigned area fully covered?
* Which locations need a revisit?
* Did preventive patrol find an issue before a citizen report was submitted?
* Does any sentinel trap need repair, cleaning, refill, retrieval, or replacement?
* Is a sentinel trap signal reliable enough to influence inspection priority?

### Key Outputs
* Inspection result.
* GPS coverage trail.
* Checked/unchecked route status.
* Photos and field notes.
* Confirmed breeding site alerts.
* Sentinel trap condition updates when assigned.

## 4. Treatment Team / Sanitation Personnel Workflow

### Purpose
Resolve confirmed breeding sites through cleanup, larvicide application, source removal, and treatment documentation.

### Field Workflow
1. **Receive Treatment Assignments**
   * Open treatment route view.
   * Review confirmed sites, priority level, recommended action, photos, inspection notes, and location access details.

2. **Start Treatment Activity**
   * Tap Start Route.
   * GPS trail begins recording treatment coverage.
   * Treatment route status changes to In Progress.

3. **Visit Confirmed Sites**
   * Follow the assigned route.
   * Mark each site as Scheduled for Treatment, Treated, Unable to Treat, Skipped, or Follow-up Needed.

4. **Perform Treatment Action**
   * Remove breeding sources.
   * Clean affected areas.
   * Apply larvicide where appropriate.
   * Coordinate source reduction with residents or local staff.

5. **Document Work**
   * Upload before/after photos.
   * Record action taken, supplies used, time completed, and notes.
   * Mark whether the site needs follow-up monitoring.

6. **Pause or Resume Route**
   * Pause for supply issues, access issues, weather, safety concerns, or reassignment.
   * Resume when treatment continues.

7. **Complete Treatment Route**
   * End activity after all reachable treatment sites are handled.
   * Submit remaining Unable to Treat, Skipped, and Follow-up Needed sites.

8. **Trigger Monitoring Period**
   * Treated sites enter Monitoring status.
   * Follow-up inspections are scheduled based on city/barangay rules.

### Key Decisions
* Was the site fully treated?
* Is follow-up needed?
* Was treatment blocked by access, safety, supplies, or resident availability?
* Should the area move to Monitoring or remain High Risk?

### Key Outputs
* Treatment completion record.
* Before/after documentation.
* GPS treatment coverage trail.
* Monitoring schedule.
* Follow-up task list.

## 5. Citizen Workflow

### Purpose
Allow residents to report potential breeding sites and understand the simplified public status of their area.

### Citizen Workflow
1. **Open Public View**
   * View simplified area status for their location, street, block, barangay zone, or nearby area.

2. **Check Location Status**
   * See color-coded public status:
     * Gray: Neutral / Not Yet Checked / Expired status.
     * Yellow: Scheduled for inspection or follow-up.
     * Orange: Monitoring after treatment or recent flag.
     * Red: Danger / High Risk.
     * Green: Recently Checked / Cleared.

3. **Understand Status Expiration**
   * Green status shows the last checked date and expiration date.
   * When Green expires, the area returns to Gray or Orange depending on monitoring rules.

4. **Submit Report**
   * Submit a geo-tagged report with optional photo, description, and contact details.
   * Report examples include stagnant water, suspected breeding site, high mosquito activity, blocked drainage, or recurring problem area.

5. **Track Submitted Report**
   * View report status:
     * Submitted
     * Under Review
     * Scheduled for Inspection
     * Checked
     * Confirmed
     * Scheduled for Treatment
     * Treated
     * Monitoring
     * Closed

6. **Receive Updates**
   * Get status updates when the report is reviewed, scheduled, checked, treated, or closed.
   * Public updates should not expose inspector names, exact household findings, or sensitive operational details.

### Key Decisions
* Should I submit a report?
* Has my area been checked recently?
* Is my area scheduled, monitored, high-risk, or recently cleared?

### Key Outputs
* Citizen report.
* Photo and location evidence.
* Public area status awareness.
* Follow-up report tracking.

## 6. Shared Status Definitions

### Internal Operational Statuses
*   **Scheduled:** Assigned for future inspection or treatment.
*   **In Progress:** Field team has started the route or task.
*   **Checked:** Site or area was inspected.
*   **Unchecked:** Site or area has not yet been inspected.
*   **Skipped:** Site was skipped during the route.
*   **Need Revisit:** Site requires another visit.
*   **Confirmed:** Breeding site or issue was validated.
*   **Scheduled for Treatment:** Confirmed site is waiting for treatment.
*   **Treated:** Treatment action was completed.
*   **Unable to Treat:** Team could not complete treatment.
*   **Monitoring:** Site is being watched after treatment or risk flag.
*   **Cleared:** No active breeding issue after inspection or monitoring period.

### Sentinel Device Statuses
*   **Planned:** Device is planned for deployment.
*   **Active:** Device is deployed and transmitting usable data.
*   **Needs Maintenance:** Device requires cleaning, refill, battery replacement, or inspection.
*   **Offline:** Device has stopped transmitting.
*   **Missing:** Device cannot be found in the assigned location.
*   **Damaged:** Device is physically damaged or unreliable.
*   **Retrieved:** Device was removed from the field.
*   **Retired:** Device is no longer used.

### Public Citizen Statuses
*   **Gray:** Neutral, not yet checked, no recent status, or expired status.
*   **Yellow:** Scheduled inspection or follow-up.
*   **Orange:** Monitoring period or recently flagged area.
*   **Red:** Danger, high risk, confirmed issue, or unresolved urgent alert.
*   **Green:** Recently checked or cleared, with expiration date.
