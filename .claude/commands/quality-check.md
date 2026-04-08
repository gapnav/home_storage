Run a full quality check across the codebase. Do not auto-fix anything — report only.

Run these checks in sequence:

1. **Rubocop** (Ruby linting):
   `docker compose exec web bundle exec rubocop --format simple`

2. **ESLint** (TypeScript linting):
   `docker compose exec frontend npm run lint`

3. **Prettier** (formatting check):
   `docker compose exec frontend npx prettier --check "src/**/*.{ts,tsx}"`

After all checks:
- Summarize results as a table: check name | status (PASS/FAIL) | issue count
- List all issues grouped by file
- Do not attempt to fix anything automatically — wait for the user to ask
