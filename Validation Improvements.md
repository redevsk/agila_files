# Validation Improvements

## Summary

The MVP concept and workflows are strong enough for a hackathon prototype. The biggest improvement is to make the implementation match the documents: the current source code is still a generic MVC scaffold, while the product now has clear domain modules, workflows, map requirements, and status rules.

## Product Improvements

*   Keep the MVP focused on the prevention loop: plan routine surveillance -> detect risk signals -> inspect -> treat if needed -> monitor.
*   Keep Sentinel traps as simulated or limited-pilot data for the hackathon, not a dependency.
*   Treat Strava-like route tracking as a core differentiator: checked, unchecked, scheduled, skipped, and need revisit.
*   Use citizen reports as one signal, not the main starting point of the system.
*   Prioritize preventive patrols for historical hotspots, expiring Green areas, sentinel signals, and unchecked coverage gaps.
*   Add Preventive Zone Prioritization as the MVP's lightweight geo-analysis feature.
*   Keep citizen status simple: Gray, Yellow, Orange, Red, Green.
*   Make Green citizen status expire after a configured period.
*   Keep city-level and barangay-level responsibilities clearly separated.
*   Add acceptance criteria to make each workflow testable.

## Technical Improvements

*   Use SQLite for the two-day hackathon.
*   Store map points as `lat` and `lng`.
*   Store route trails as JSON arrays.
*   Store areas, zones, and barangay boundaries as GeoJSON JSON fields if needed.
*   Use predefined zones and simple score-based ranking instead of advanced GIS.
*   Avoid advanced spatial queries during the hackathon.
*   Design the schema so it can migrate later to PostgreSQL/PostGIS.
*   Replace the generic `items` module with real domain modules.

## Recommended Hackathon Stack

*   **Backend:** Node.js + Express.
*   **Database:** SQLite.
*   **ORM/Query Layer:** Prisma, Drizzle, or direct SQLite queries.
*   **Frontend/Admin Framework:** Refine on React.
*   **Maps:** Leaflet or MapLibre.
*   **Styling:** Tailwind or the fastest familiar styling approach.
*   **IoT:** Simulated Sentinel JSON payloads first.

## Source Structure Improvements

Replace `src/modules/items` with:
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

## Documentation Improvements

*   Fix broken encoding artifacts in `README.md` and `Background & Existing Systems.txt`.
*   Keep `Technical Architecture.md` as the implementation source of truth for the hackathon.
*   Add exact API contracts before parallel frontend/backend work begins.
*   Add seeded demo data so the map and dashboards look complete during judging.
*   Define which data is internal and which data is public.

## Highest-Risk Gaps

*   The current codebase is not yet runnable as a full app because there is no `package.json`, `server.js`, database config, or domain modules.
*   The source code does not yet match the MVP modules in the planning docs.
*   Graphify and Ponytail need exact package choices and setup steps before developers rely on them. Refine is selected for the frontend/admin build.
*   Offline support should be scoped carefully. For the hackathon, use local draft saving if full offline sync is too much.

## Best Next Implementation Move

Start by implementing the SQLite-backed backend modules for reports, tasks, routes, inspections, treatments, public statuses, and sentinel devices. Then connect the map and frontend screens to seeded demo data.
