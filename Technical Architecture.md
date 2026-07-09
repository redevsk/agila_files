# Technical Architecture: Two-Day Hackathon MVP

## Architecture Decision

Use a lightweight stack optimized for a two-day hackathon:
*   **Backend:** Node.js + Express.
*   **Database:** SQLite.
*   **ORM/Query Layer:** Prisma, Drizzle, or direct SQLite queries depending on team speed.
*   **Frontend:** Refine on React for ready-made CRUD, routing, data providers, auth integration, and admin screens.
*   **Maps:** Leaflet or MapLibre.
*   **Styling:** Tailwind or the fastest familiar utility/class system.
*   **Sentinel IoT:** Simulated JSON payloads first.

SQLite is acceptable for the hackathon because the MVP needs demo speed, easy setup, and simple local persistence more than advanced GIS querying. Store spatial data using plain `lat`/`lng`, JSON route trails, and optional GeoJSON fields. Design the schema so it can later migrate to PostgreSQL/PostGIS.

## Frontend Decision: Refine

Use Refine as the primary frontend framework for the hackathon. It should provide the ready-made admin structure for resource lists, create/edit/show pages, authentication hooks, role-aware navigation, and API data-provider integration.

Recommended Refine resources:
*   `reports`
*   `tasks`
*   `routes`
*   `inspections`
*   `treatments`
*   `public-statuses`
*   `sentinel-devices`
*   `users`
*   `barangays`

Custom pages should be used for map-heavy and activity-tracking experiences:
*   City GIS dashboard.
*   Barangay GIS dashboard.
*   Inspector route/activity screen.
*   Treatment route/activity screen.
*   Citizen public status map.

Refine should consume stable REST endpoints from the Node/Express backend. Keep backend responses consistent, preferably:

```json
{
  "data": []
}
```

## MVP Technical Priorities

1. City/barangay dashboard with risk map and scheduled preventive coverage.
2. Preventive Zone Prioritization using lightweight geo analysis.
3. Task assignment for preventive patrols, inspections, treatment, sentinel checks, and follow-ups.
4. Inspector route tracking and validation.
5. Citizen report submission.
6. Treatment task tracking.
7. Public location status.
8. Monitoring and Green status expiration.
9. Basic risk scoring.
10. CSV/PDF reporting.
11. Simulated Smart ovitrap integration.

## Source Module Plan

Replace the generic `items` scaffold with domain modules:
*   `auth`
*   `users`
*   `barangays`
*   `reports`
*   `tasks`
*   `inspections`
*   `treatments`
*   `routes`
*   `public-status`
*   `sentinel-devices`
*   `risk`
*   `maps`
*   `exports`

Each module should follow the MVC pattern:
*   `<module>.routes.js`
*   `<module>.controller.js`
*   `<module>.service.js`
*   `<module>.model.js`
*   `<module>.validation.js` when needed

## SQLite Schema Draft

### users
*   `id`
*   `name`
*   `email`
*   `role`
*   `barangay_id`
*   `created_at`

Roles:
*   `city_admin`
*   `barangay_admin`
*   `inspector`
*   `treatment_team`
*   `citizen`

### barangays
*   `id`
*   `name`
*   `boundary_geojson`
*   `created_at`

### areas
*   `id`
*   `barangay_id`
*   `name`
*   `type`
*   `boundary_geojson`
*   `center_lat`
*   `center_lng`
*   `last_checked_at`
*   `public_status`
*   `historical_hotspot`
*   `has_drainage`
*   `density_level`
*   `risk_score`
*   `priority`
*   `created_at`

Area types:
*   `zone`
*   `street_segment`
*   `block`
*   `drainage_corridor`
*   `public_area`
*   `historical_hotspot`
*   `radius_area`

### reports
*   `id`
*   `submitted_by`
*   `barangay_id`
*   `area_id`
*   `lat`
*   `lng`
*   `description`
*   `photo_url`
*   `status`
*   `risk_level`
*   `created_at`
*   `updated_at`

### tasks
*   `id`
*   `type`
*   `status`
*   `priority`
*   `assigned_to`
*   `barangay_id`
*   `area_id`
*   `report_id`
*   `sentinel_device_id`
*   `due_at`
*   `created_at`
*   `updated_at`

Task types:
*   `preventive_patrol`
*   `inspection`
*   `treatment`
*   `sentinel_check`
*   `follow_up`

### inspections
*   `id`
*   `task_id`
*   `inspector_id`
*   `report_id`
*   `lat`
*   `lng`
*   `result`
*   `container_type`
*   `water_present`
*   `larvae_seen`
*   `notes`
*   `photo_url`
*   `created_at`

Inspection results:
*   `no_breeding_found`
*   `confirmed`
*   `need_revisit`
*   `unable_to_access`

### treatments
*   `id`
*   `task_id`
*   `team_id`
*   `inspection_id`
*   `action_taken`
*   `supplies_used`
*   `before_photo_url`
*   `after_photo_url`
*   `result`
*   `notes`
*   `created_at`

Treatment results:
*   `treated`
*   `unable_to_treat`
*   `follow_up_needed`

### routes
*   `id`
*   `assigned_to`
*   `type`
*   `status`
*   `started_at`
*   `paused_at`
*   `completed_at`
*   `trail_json`
*   `created_at`

Route types:
*   `preventive_patrol`
*   `inspection`
*   `treatment`
*   `sentinel_check`

Route statuses:
*   `scheduled`
*   `in_progress`
*   `paused`
*   `completed`

### route_points
*   `id`
*   `route_id`
*   `task_id`
*   `lat`
*   `lng`
*   `status`
*   `notes`
*   `checked_at`

Route point statuses:
*   `scheduled`
*   `checked`
*   `unchecked`
*   `skipped`
*   `need_revisit`
*   `unable_to_access`

### public_statuses
*   `id`
*   `area_id`
*   `status`
*   `source_type`
*   `source_id`
*   `last_checked_at`
*   `expires_at`
*   `created_at`
*   `updated_at`

Public statuses:
*   `gray`
*   `yellow`
*   `orange`
*   `red`
*   `green`

### sentinel_devices
*   `id`
*   `device_code`
*   `type`
*   `barangay_id`
*   `area_id`
*   `lat`
*   `lng`
*   `status`
*   `battery_level`
*   `last_seen_at`
*   `last_maintenance_at`
*   `created_at`
*   `updated_at`

Device types:
*   `smart_ovitrap`

Device statuses:
*   `planned`
*   `active`
*   `needs_maintenance`
*   `offline`
*   `missing`
*   `damaged`
*   `retrieved`
*   `retired`

### sentinel_readings
*   `id`
*   `device_id`
*   `battery_level`
*   `water_level`
*   `temperature`
*   `humidity`
*   `signal_strength`
*   `recorded_at`
*   `created_at`

### audit_logs
*   `id`
*   `actor_id`
*   `action`
*   `entity_type`
*   `entity_id`
*   `metadata_json`
*   `created_at`

## API Draft

### Auth and Users
*   `POST /api/auth/login`
*   `GET /api/me`
*   `GET /api/users`
*   `POST /api/users`

### Reports
*   `POST /api/reports`
*   `GET /api/reports`
*   `GET /api/reports/:id`
*   `PATCH /api/reports/:id/status`

### Tasks
*   `GET /api/tasks`
*   `POST /api/tasks`
*   `PATCH /api/tasks/:id/assign`
*   `PATCH /api/tasks/:id/status`
*   `POST /api/tasks/generate-preventive`

### Routes
*   `POST /api/routes`
*   `GET /api/routes/:id`
*   `POST /api/routes/:id/start`
*   `POST /api/routes/:id/pause`
*   `POST /api/routes/:id/resume`
*   `POST /api/routes/:id/complete`
*   `POST /api/routes/:id/trail`
*   `PATCH /api/route-points/:id/status`

### Inspections
*   `POST /api/inspections`
*   `GET /api/inspections`

### Treatments
*   `POST /api/treatments`
*   `GET /api/treatments`

### Public Status
*   `GET /api/public-status?lat={lat}&lng={lng}`
*   `GET /api/public-status/areas`
*   `PATCH /api/public-status/:id`

### Zone Prioritization
*   `GET /api/areas`
*   `POST /api/areas`
*   `PATCH /api/areas/:id`
*   `POST /api/areas/recalculate-priority`
*   `GET /api/areas/priority-ranking`

### Sentinel Devices
*   `GET /api/sentinel-devices`
*   `POST /api/sentinel-devices`
*   `PATCH /api/sentinel-devices/:id`
*   `POST /api/sentinel-devices/:id/check`
*   `POST /api/sentinel-readings`

### Dashboards and Maps
*   `GET /api/dashboard/city`
*   `GET /api/dashboard/barangay/:id`
*   `GET /api/maps/layers`
*   `GET /api/maps/coverage`

### Exports
*   `GET /api/exports/city.csv`
*   `GET /api/exports/barangay/:id.csv`
*   `GET /api/exports/city.pdf`
*   `GET /api/exports/barangay/:id.pdf`

## Status Rules

### Report Flow
1. `submitted`
2. `under_review`
3. `scheduled_for_inspection`
4. `checked`
5. `confirmed` or `closed`

### Preventive Surveillance Flow
1. System identifies overdue routine coverage, expiring Green areas, historical hotspots, unchecked areas, or smart-ovitrap signals.
2. Barangay or city admin reviews recommendations.
3. Admin creates preventive patrol tasks.
4. Inspector checks assigned areas.
5. Findings either keep the area Green/Gray, move it to Monitoring, or escalate it to Red and treatment.

### Inspection Flow
*   `no_breeding_found` closes the report and can set public status to Green.
*   `confirmed` creates a treatment task and can set public status to Red.
*   `need_revisit` creates a follow-up task and can set public status to Yellow.
*   `unable_to_access` remains unresolved and can set public status to Yellow or Orange.

### Treatment Flow
*   Confirmed site creates `scheduled_for_treatment`.
*   Completed treatment moves the area to `monitoring`.
*   Monitoring expires to `cleared` if no new issue appears.
*   Follow-up needed creates a new inspection task.

### Public Status Mapping
*   **Gray:** No recent inspection, neutral, expired Green, or unknown.
*   **Yellow:** Scheduled inspection or follow-up.
*   **Orange:** Monitoring after treatment or recently flagged area.
*   **Red:** Confirmed breeding, unresolved high-risk alert, or repeated reports.
*   **Green:** Recently checked or cleared, with an expiration date.

Green must expire after a configurable period, such as 7, 14, or 30 days.

## Risk Scoring MVP

Use a simple explainable score:
*   Historical hotspot: `+30`
*   Not checked in 14 days: `+25`
*   Green status expires soon: `+20`
*   Citizen report nearby or assigned to the zone: `+20`
*   Smart ovitrap activity spike: `+15`
*   Dense residential area: `+10`
*   Drainage/canal area: `+10`
*   Skipped or unchecked in the last route: `+10`
*   Unresolved inspection or unable-to-access site: `+15`
*   Recurrence after treatment: `+15`

Risk levels:
*   `0-24`: Low
*   `25-49`: Medium
*   `50-74`: High
*   `75+`: Critical

Sentinel readings should influence inspection priority, but should not automatically confirm dengue danger.

## Lightweight Geo Analysis

For the hackathon, use predefined surveillance zones instead of advanced GIS processing. Each zone can be represented by a center `lat`/`lng` and optional GeoJSON boundary. Compute zone priority in JavaScript using the rule-based score above.

The MVP does not need PostGIS, spatial indexes, polygon intersections, or predictive ML. It only needs to rank zones for preventive inspection and display them on the map.

Implementation shortcuts:
*   Seed 10-20 zones for the pilot barangay.
*   Assign reports and sentinel devices to zones manually or by nearest center point.
*   Sort zones by `risk_score` to suggest preventive patrols.
*   Color zones by public status and priority.
*   Store boundaries as GeoJSON JSON fields when available.

## Simulated Sentinel Payload

```json
{
  "deviceCode": "OVI-BRGY-001",
  "type": "smart_ovitrap",
  "lat": 14.5995,
  "lng": 120.9842,
  "batteryLevel": 87,
  "waterLevel": 63,
  "temperature": 30.4,
  "humidity": 78,
  "signalStrength": -72,
  "recordedAt": "2026-07-07T08:30:00Z"
}
```


## Acceptance Criteria

### Citizen
*   Can submit a report with location, description, and optional photo.
*   Can view public status for an area.
*   Can track report status.

### City Administrator
*   Can view all barangays on a dashboard.
*   Can see high-risk areas, active reports, treatment progress, and route coverage.
*   Can export city-level CSV/PDF reports.

### Barangay Administrator
*   Can triage citizen reports.
*   Can assign inspection, treatment, sentinel-check, and follow-up tasks.
*   Can update public area status.

### Field Inspector
*   Can start, pause, resume, and complete a route.
*   Can mark route points as checked, skipped, need revisit, or unable to access.
*   Can submit inspection results.
*   Can handle assigned smart ovitrap checks and updates.

### Treatment Team
*   Can view assigned treatment tasks.
*   Can start and complete treatment route activity.
*   Can submit treatment completion with before/after documentation.

### Maps
*   Can display reports, routes, treatment sites, coverage statuses, public statuses, and sentinel devices.
*   Can filter by barangay and status.

## Later Migration Path

After the hackathon, migrate from SQLite to PostgreSQL/PostGIS when the product needs:
*   spatial indexes,
*   distance/radius queries,
*   polygon intersections,
*   larger datasets,
*   multi-user production concurrency,
*   proper GIS analytics.

