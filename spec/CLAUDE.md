# Testing conventions (RSpec)

## Structure mirrors app/
- `spec/models/` — model validations, associations, scopes
- `spec/services/` — service objects, one file per action
- `spec/requests/` — API endpoint integration tests (not controller unit tests)

## Factories (FactoryBot)
- One factory per model in `spec/factories/<model>.rb`
- Use `build` for unit tests, `create` only when DB persistence is needed
- Traits for optional states: `factory :storage_item, traits: [:archived]`

## Model spec pattern
```ruby
RSpec.describe StorageItem, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to belong_to(:user) }
  end
end
```

## Service spec pattern
```ruby
RSpec.describe StorageItem::Create do
  subject(:result) { described_class.new(params:, current_user: user).call }

  let(:user) { build(:user) }
  let(:params) { { name: 'Box A' } }

  it 'creates the item' do
    expect(result).to be_success
    expect(result.value!.name).to eq('Box A')
  end
end
```

## Rules
- No `xit` or `pending` — fix or delete
- Descriptive `it` blocks: behaviour, not implementation ("creates the item", not "calls save")
- No HTTP calls in unit specs — stub at the service boundary
