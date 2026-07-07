# Development Kickstart Rules

Use these rules when developing features in this Lightweight Modular MVC Node.js application.

## 1) Project Architecture

* Organize the project by **feature/module**, not by file type.
* Every feature lives inside `/src/modules/<feature>/`.
* Each module may contain:

  * `<feature>.routes.js`
  * `<feature>.controller.js`
  * `<feature>.service.js`
  * `<feature>.model.js`
  * `<feature>.validation.js` (optional)
* Shared code belongs in:

  * `/src/config`
  * `/src/middleware`
  * `/src/utils`
  * `/src/constants`

## 2) Layer Responsibilities

* **Routes** define endpoints only.
* **Controllers** handle HTTP requests and responses.
* **Services** contain all business logic.
* **Models** manage database schemas and database interactions.
* Keep controllers thin and move all application logic into services.

Request flow:

```text
Request
    ->
Route
    ->
Controller
    ->
Service
    ->
Model (Database)
    ->
Response
```

## 3) Graphify Integration

* Use Graphify to generate graph-aware APIs from model definitions.
* Store Graphify configuration under `/src/config/graphify`.
* Do not place Graphify orchestration inside controllers.
* Services should coordinate Graphify operations.

## 4) Refine Integration

* Treat Refine as the admin/frontend client.
* Expose stable REST endpoints.
* Keep response formats consistent:

```json
{
  "data": "..."
}
```

* Version APIs when introducing breaking changes.

## 5) Ponytail Integration

* Use Ponytail for utility-first styling.
* Centralize design tokens.
* Reuse shared UI components before creating new ones.
* Avoid inline styling whenever possible.

## 6) Development Guidelines

* Create one module per resource or domain.
* Keep related files together inside their module.
* Reuse utilities and middleware instead of duplicating code.
* Keep functions focused and concise.
* Prefer async/await.
* Follow consistent naming conventions across modules.

## 7) Delivery Rules

* Each new feature should include its own:

  * Route
  * Controller
  * Service
  * Model (if required)
  * Validation (if required)
* Update tests when backend behavior changes and a testing framework exists.
* Keep commits focused on a single feature or bug fix.
* Prioritize readability and rapid iteration over unnecessary abstraction.
