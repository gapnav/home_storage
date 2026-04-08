Generate a Rails migration for: $ARGUMENTS

Steps:
1. Run `docker compose exec web bundle exec rails generate migration $ARGUMENTS` and show the output.
2. Read the generated migration file and review it for correctness.
3. If the migration adds columns, ensure appropriate database-level constraints (null: false, default, index) are included.
4. Remind the user to run `docker compose exec web bundle exec rails db:migrate` when ready.
5. If the migration relates to a model, check whether the corresponding model file needs `validates` or associations updated, and list any recommended changes.
