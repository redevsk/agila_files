# agila_files

Planning and implementation scaffold for a two-day hackathon MVP: a vector surveillance operations platform for LGUs, barangays, field inspectors, treatment teams, citizens, and optional/simulated Sentinel traps.

## Key Documents

*   [MVP Core Concept.md](MVP%20Core%20Concept.md)
*   [User Workflows.md](User%20Workflows.md)
*   [Dev Task Assignment.md](Dev%20Task%20Assignment.md)
*   [Technical Architecture.md](Technical%20Architecture.md)
*   [Validation Improvements.md](Validation%20Improvements.md)
*   [MVP Map Views.md](MVP%20Map%20Views.md)
*   [DEVELOPMENT_RULES.md](DEVELOPMENT_RULES.md)

## Hackathon Architecture

Use a lightweight stack:
*   Node.js + Express.
*   SQLite.
*   Refine on React.
*   Leaflet or MapLibre.
*   Simulated Sentinel trap payloads.

SQLite is enough for the hackathon. Use plain `lat`/`lng`, JSON route trails, and GeoJSON fields where needed. Migrate to PostgreSQL/PostGIS later if the project needs production GIS analytics.

## Target Source Structure

```text
src/
  modules/
    auth/
    users/
    barangays/
    reports/
    tasks/
    inspections/
    treatments/
    routes/
    public-status/
    sentinel-devices/
    risk/
    maps/
    exports/
  middleware/
  config/
  utils/
  constants/
  app.ts
  server.ts
```

## Current Source State

The source now follows the feature/module MVC structure. The first implementation pass uses in-memory seed data so frontend and map work can start quickly before SQLite is wired in.

The backend source is TypeScript and runs with `tsx`. Use `.ts` for API/server modules and reserve `.tsx` for future Refine/React frontend components.

## Run

```bash
npm install
npm start
```

Run a TypeScript check with:

```bash
npm run check
```

The API is mounted under:

```text
/api/v1
```

The prototype map tester is available at:

```text
http://localhost:3000/map
```

The map MVP is focused on Valenzuela City, specifically Barangay Dambana and Barangay Marulas. It uses OpenStreetMap tiles when online and includes a schematic offline demo fallback so the route trail and risk-area workflow can still be shown without web map tiles.

Useful prototype endpoints:
*   `GET /api/v1/dashboard/city`
*   `GET /api/v1/maps/layers`
*   `GET /api/v1/maps/coverage`
*   `GET /api/v1/areas/priority-ranking`
*   `POST /api/v1/tasks/generate-preventive`
*   `GET /api/v1/public-status/areas`

## Kickstart Rules

See [DEVELOPMENT_RULES.md](DEVELOPMENT_RULES.md) for MVC workflow rules and guidance for Graphify, Refine, and Ponytail. Refine is the selected frontend/admin framework for the hackathon.
