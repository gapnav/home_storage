# Home Storage — Claude Code Instructions

## Stack
- **Backend**: Ruby on Rails API, PostgreSQL, RSpec, Rubocop
- **Frontend**: React, TypeScript (strict), Tailwind CSS, Vitest, ESLint + Prettier
- **Infrastructure**: Docker Compose (`web` service = Rails, `frontend` service = Vite dev server, `db` = Postgres)

## Key Directories
```
app/models/         Rails models
app/services/       Business logic (service objects)
app/controllers/    API controllers (JSON only)
spec/               RSpec tests (mirrors app/ structure)
frontend/src/
  components/       React components
  hooks/            Custom React hooks
  services/         API client functions (React Query)
  types/            Shared TypeScript types
```

## Code Style — Backend
- Rubocop is enforced; never add `# rubocop:disable` comments — fix the violation
- Business logic belongs in service objects (`app/services/`), not models or controllers
- Controllers are thin: authenticate, call service, render JSON
- No raw SQL; use ActiveRecord or Arel
- All DB interactions go through models; no direct SQL in services

## Code Style — Frontend
- TypeScript strict mode — never use `any`; never use `@ts-ignore`
- Tailwind only — no inline styles, no CSS modules, no styled-components
- React Query for all server state; no manual fetch in components
- Custom hooks for reusable stateful logic
- Named exports only (no default exports except pages/routes)

## Testing Requirements
- Every new model → unit spec in `spec/models/`
- Every new service → unit spec in `spec/services/`
- Every new React component → Vitest spec co-located (`Component.test.tsx`)
- Never skip tests (`xit`, `xdescribe`, `test.skip`) — fix or delete them

## Docker Commands
```bash
docker compose up                              # start all services
docker compose exec web bundle exec rails c    # Rails console
docker compose exec web bundle exec rspec      # run all backend tests
docker compose exec frontend npm run test      # run all frontend tests
docker compose exec web bundle exec rubocop    # lint Ruby
docker compose exec frontend npm run lint      # lint TypeScript
```

## API Conventions
- RESTful JSON API under `/api/v1/`
- Authenticate via Bearer token (JWT)
- Return `{ data: ... }` on success, `{ errors: [...] }` on failure
- HTTP status codes must be semantically correct (201 for create, 422 for validation errors)
