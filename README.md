# agila_files

Planning and implementation scaffold for a two-day hackathon MVP: a vector surveillance operations platform for LGUs, barangays, field inspectors, treatment teams, citizens, and optional/simulated Sentinel traps.

## Key Documents

*   [MVP Core Concept.md](MVP%20Core%20Concept.md)
*   [User Workflows.md](User%20Workflows.md)
*   [Dev Task Assignment.md](Dev%20Task%20Assignment.md)
*   [Technical Architecture.md](Technical%20Architecture.md)
*   [Validation Improvements.md](Validation%20Improvements.md)
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
  app.js
  server.js
```

## Current Source State

The source currently contains a small generic MVC example under `src/modules/items`. Replace it with the domain modules listed above as implementation begins.

## Kickstart Rules

See [DEVELOPMENT_RULES.md](DEVELOPMENT_RULES.md) for MVC workflow rules and guidance for Graphify, Refine, and Ponytail. Refine is the selected frontend/admin framework for the hackathon.
