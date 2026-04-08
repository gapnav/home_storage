# Backend conventions (Rails)

## Structure
- Models: validations, associations, scopes only — no business logic
- Services: `app/services/<resource>/<action>.rb`, e.g. `StorageItem::Create`
- Controllers: authenticate → call service → render JSON; no logic beyond that
- All routes under `namespace :api do namespace :v1 do`

## Service object pattern
```ruby
class StorageItem::Create
  def initialize(params:, current_user:)
    @params = params
    @current_user = current_user
  end

  def call
    item = StorageItem.new(@params.merge(user: @current_user))
    item.save ? Success(item) : Failure(item.errors)
  end
end
```
Return `Success(value)` / `Failure(errors)` — use dry-monads if available, plain Result struct otherwise.

## API responses
- Success: `render json: { data: resource }, status: :ok/created`
- Failure: `render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity`
- Use serializers (ActiveModel::Serializer or plain `.as_json(only: [...])`) — never expose raw `.to_json`

## Database
- Always add `null: false` on required columns
- Add DB-level indexes on foreign keys and frequently queried columns
- No raw SQL; use ActiveRecord or Arel
