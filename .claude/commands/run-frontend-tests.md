Run Vitest frontend tests.

If $ARGUMENTS is provided, run that specific file or pattern:
  `docker compose exec frontend npm run test -- $ARGUMENTS`

Otherwise run the full suite once (non-watch):
  `docker compose exec frontend npm run test -- --run`

After running:
- If all tests pass, confirm and show the summary.
- If tests fail, show the failing test names and error output.
- For each failure, identify the likely cause and suggest a fix (but do not auto-apply — wait for confirmation).
