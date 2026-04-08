Run RSpec backend tests.

If $ARGUMENTS is provided, run that specific file or directory:
  `docker compose exec web bundle exec rspec $ARGUMENTS --format documentation`

Otherwise run the full suite:
  `docker compose exec web bundle exec rspec --format progress`

After running:
- If all tests pass, confirm and show the summary line.
- If tests fail, show the failing examples with their error messages.
- For each failure, identify the likely cause and suggest a fix (but do not auto-apply — wait for confirmation).
