FactoryBot.define do
  factory :node do
    sequence(:title) { |n| "Node #{n}" }
    node_type { :storage }
    description { nil }
    code { nil }

    trait :storage do
      node_type { :storage }
    end

    trait :thing do
      node_type { :thing }
    end

    trait :with_code do
      sequence(:code) { |n| "CODE-#{n}" }
    end
  end
end
