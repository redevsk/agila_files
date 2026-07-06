# Development Kickstart Rules

Use these rules when starting features in this MVC Node.js app.

## 1) MVC baseline
- Put request/response handling in `/src/controllers`.
- Keep business logic in `/src/services`.
- Keep data-access logic in `/src/models`.
- Put route declarations in `/src/routes`.
- Keep presentation templates in `/src/views`.

## 2) Graphify (graphifyy) integration rules
- Use Graphify to generate graph-aware APIs from model definitions.
- Keep Graphify schema/configuration files under `/src/config/graphify`.
- Do not place Graphify query orchestration in controllers; route through services.

## 3) Refine integration rules
- Treat Refine as the admin/frontend layer that consumes backend endpoints.
- Keep API contracts stable and versioned under `/api` routes.
- Ensure controller responses are resource-oriented (`{ data: ... }`) for easier Refine data-provider mapping.

## 4) Ponytail integration rules
- Use Ponytail for utility-first styling in frontend views/components.
- Keep style tokens centralized and avoid inline style drift.
- Reuse shared UI primitives before creating new component patterns.

## 5) Delivery rules
- Add one route + controller + service + model path per new resource.
- Add/update tests for changed backend behavior where test infrastructure exists.
- Keep commits scoped to one feature slice.
