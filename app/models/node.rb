class Node < ApplicationRecord
  has_ancestry orphan_strategy: :restrict

  enum :node_type, { storage: "storage", thing: "thing" }

  validates :title, presence: true
  validates :code, uniqueness: { case_sensitive: false }, allow_nil: true
  validate :parent_must_be_storage, if: -> { parent_id.present? }

  scope :roots, -> { where(ancestry: nil) }

  def path_nodes
    ancestors.to_a + [self]
  end

  private

  def parent_must_be_storage
    return if parent&.storage?

    errors.add(:base, "Parent must be a storage node")
  end
end
