# MVP Map Views

This document defines the map views that are feasible for the Agila MVP using the current lightweight stack:

```text
Frontend map: Leaflet
Base map: OpenStreetMap tiles for prototype only
Route drawing: Leaflet Polyline
GPS trail format: JSON array of lat/lng/timestamp
Analysis: Turf.js
Backend storage: in-memory seed data now, SQLite next
Future backend storage: PostGIS later
```

## Offline Decision

Do not build full offline maps for the MVP.

Full offline maps require packaged tiles, tile cache rules, storage limits, sync logic, and more QA than the MVP needs. For the hackathon/demo version, use this approach instead:

* Use OpenStreetMap tiles when internet is available.
* Keep all operational data in the API response so markers, routes, and risk areas can render independently from the basemap.
* Provide an offline demo fallback that shows a schematic local map if Leaflet or web tiles are unavailable.
* Keep route tracking data as JSON trail points so it can be synced later.

This is enough to demo the Strava-like route trail and risk-area workflow without taking on production offline-map complexity.

The MVP should focus on map views that support the core workflow:

```text
Citizen or staff report issue
-> LGU/barangay sees it on the map
-> Task is assigned
-> Inspector follows route
-> Route trail and task status update operations view
-> Public sees simplified area status
```

## MVP Map Views

### 1. City Operations Map

**Primary user:** City Admin / LGU Command Center

**Purpose:** Provide a Valenzuela City operational view focused on Barangay Dambana and Barangay Marulas risk areas, reports, tasks, Sentinel devices, and inspection routes.

**Feasible MVP functions:**

* Show all seeded areas on the map.
* Show citizen reports as markers.
* Show Sentinel devices as markers.
* Show scheduled tasks near their assigned areas.
* Show route trails using Leaflet polylines.
* Toggle layers:
  * Risk areas
  * Citizen reports
  * Sentinel devices
  * Tasks
  * Routes
* Click markers to view basic details.
* Load data from `GET /api/v1/maps/layers`.

**MVP endpoint dependencies:**

```text
GET /api/v1/maps/layers
GET /api/v1/dashboard/city
GET /api/v1/areas/priority-ranking
```

### 2. Barangay Risk Map

**Primary user:** Barangay Admin

**Purpose:** Provide a barangay-level view of local risk areas, reports, and tasks.

**Feasible MVP functions:**

* Filter or visually focus map data by Barangay Dambana or Barangay Marulas.
* Show barangay risk areas.
* Show local reports.
* Show local tasks.
* Show public status per area:
  * `green`
  * `yellow`
  * `red`
* Allow barangay admin to inspect area details.

**MVP endpoint dependencies:**

```text
GET /api/v1/barangays
GET /api/v1/areas
GET /api/v1/public-status/areas
PATCH /api/v1/public-status/:areaId
```

### 3. Inspector Route Map

**Primary user:** Field Inspector

**Purpose:** Let inspectors view assigned routes and record their actual trail.

**Feasible MVP functions:**

* Show assigned task area on the map.
* Show route trail as a Leaflet polyline.
* Store route trail as:

```json
[
  {
    "lat": 14.5995,
    "lng": 120.9842,
    "timestamp": "2026-07-08T08:05:00Z"
  }
]
```

* Start route.
* Pause route.
* Resume route.
* Complete route.
* Append trail points manually or from browser geolocation.
* Use Turf.js to calculate approximate route distance.
* Provide an "Add Demo Point" action for repeatable demos without GPS.

**MVP endpoint dependencies:**

```text
GET /api/v1/routes
GET /api/v1/routes/:id
POST /api/v1/routes/:id/start
POST /api/v1/routes/:id/pause
POST /api/v1/routes/:id/resume
POST /api/v1/routes/:id/complete
POST /api/v1/routes/:id/trail
```

### 4. Public Area Status Map

**Primary user:** Citizen / Public User

**Purpose:** Show a simplified public-facing view of area safety/risk status.

**Feasible MVP functions:**

* Show public areas only.
* Use simple status colors:
  * Green: recently checked / lower concern
  * Yellow: caution
  * Red: high concern / needs action
* Hide internal task, inspector, Sentinel, and operational details.
* Let citizens view area name and status.

**MVP endpoint dependencies:**

```text
GET /api/v1/public-status/areas
```

### 5. Report Issue Map

**Primary user:** Citizen / Public User

**Purpose:** Let citizens submit a location-based issue report.

**Feasible MVP functions:**

* Pick a location on the map.
* Optionally use browser geolocation.
* Submit:
  * latitude
  * longitude
  * description
  * barangay ID or area ID when available
* Show submitted report marker after creation.

**MVP endpoint dependencies:**

```text
GET /api/v1/barangays
POST /api/v1/reports
```

## MVP Implementation Notes

### Recommended Frontend Structure

For the current Express prototype, a simple static frontend is enough:

```text
public/
  index.html
  styles.css
  map.js
```

If the team adds Refine/React later, these views can become React pages.

### Recommended Map Layers

Use these shared layer names across MVP views:

```text
areas
reports
sentinelDevices
tasks
routes
publicStatus
```

### Recommended Route Trail Shape

Use a JSON array first because it is easy to store in SQLite and easy to draw with Leaflet:

```json
[
  {
    "lat": 14.5995,
    "lng": 120.9842,
    "timestamp": "2026-07-08T08:05:00Z"
  },
  {
    "lat": 14.6012,
    "lng": 120.9815,
    "timestamp": "2026-07-08T08:20:00Z"
  }
]
```

Later, this can be migrated to GeoJSON or PostGIS geometry.

### Recommended Turf.js Usage

Use Turf.js only where it gives immediate MVP value:

* Calculate route distance.
* Calculate whether a report is near a known risk area.
* Calculate bounding boxes for fitting map views.

Avoid complex geospatial analysis in the MVP.

## Future Expansion

The following views are useful, but should stay out of the first MVP unless the core workflow is already complete.

### Future: Risk Heatmap View

**Possible users:** City Admin, Barangay Admin

**Future functions:**

* Show density of reports and high-risk areas.
* Generate heat intensity from reports, Sentinel readings, and inspection results.
* Compare historical hotspots against current activity.

**Reason to defer:** Requires more real data and better scoring logic.

### Future: Treatment Coverage Map

**Possible users:** Treatment Team, City Admin

**Future functions:**

* Show completed treatment paths.
* Compare pending vs completed treatment areas.
* Display treated areas by date.
* Flag missed or skipped locations.

**Reason to defer:** Treatment workflows exist in the backend, but coverage analytics need more detailed treatment records.

### Future: Resource Dispatch Map

**Possible users:** City Admin

**Future functions:**

* Assign nearest inspector or treatment team.
* Show available teams.
* Suggest task assignment based on distance and workload.

**Reason to defer:** Requires live user/team availability and assignment rules.

### Future: Offline Field Map

**Possible users:** Field Inspector, Treatment Team

**Future functions:**

* Cache assigned tasks.
* Store trail points locally.
* Sync records when internet returns.

**Reason to defer:** Requires local storage, sync conflict handling, and offline-first UI states.

### Future: Sentinel Alert Map

**Possible users:** City Admin, Barangay Admin

**Future functions:**

* Show device-triggered alerts.
* Convert alert into inspection task.
* Compare Sentinel alerts with nearby reports and risk areas.

**Reason to defer:** Current Sentinel data is simulated and not yet alert-driven.

### Future: Map Matching and Route Optimization

**Possible tools:**

* OSRM
* Valhalla
* GraphHopper

**Future functions:**

* Snap noisy GPS traces to roads.
* Generate optimized routes.
* Calculate more accurate walking/driving distance.

**Reason to defer:** Leaflet polylines and simple GPS trails are enough for the MVP.
