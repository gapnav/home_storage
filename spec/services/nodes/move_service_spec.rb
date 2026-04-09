require "rails_helper"

RSpec.describe Nodes::MoveService do
  subject(:result) { described_class.new(node:, params:).call }

  describe "moving a node to a different storage parent" do
    let(:node) { create(:node, :storage) }
    let(:new_parent) { create(:node, :storage) }
    let(:params) { { parent_id: new_parent.id } }

    it "returns a successful result" do
      expect(result.success?).to be true
    end

    it "updates the parent relationship" do
      expect(result.node.parent).to eq(new_parent)
    end

    it "persists the new parent" do
      result
      expect(node.reload.parent).to eq(new_parent)
    end
  end

  describe "moving a node to root" do
    let(:parent) { create(:node, :storage) }
    let(:node) { create(:node, :storage, parent:) }
    let(:params) { { parent_id: nil } }

    it "returns a successful result" do
      expect(result.success?).to be true
    end

    it "clears the parent" do
      result
      expect(node.reload.parent).to be_nil
    end
  end

  describe "moving a thing node under a storage parent" do
    let(:node) { create(:node, :thing) }
    let(:new_parent) { create(:node, :storage) }
    let(:params) { { parent_id: new_parent.id } }

    it "returns a successful result" do
      expect(result.success?).to be true
    end

    it "sets the parent relationship" do
      expect(result.node.parent).to eq(new_parent)
    end
  end

  describe "attempting to move to a non-existent parent" do
    let(:node) { create(:node, :storage) }
    let(:params) { { parent_id: 0 } }

    it "returns a failed result" do
      expect(result.success?).to be false
    end

    it "returns a not found error" do
      expect(result.errors).to include("Parent not found")
    end
  end

  describe "attempting to move under a thing node" do
    let(:node) { create(:node, :storage) }
    let(:thing_parent) { create(:node, :thing) }
    let(:params) { { parent_id: thing_parent.id } }

    it "returns a failed result" do
      expect(result.success?).to be false
    end

    it "returns a parent type error" do
      expect(result.errors).to include("Parent must be a storage node")
    end
  end

  describe "attempting to move a node under itself" do
    let(:node) { create(:node, :storage) }
    let(:params) { { parent_id: node.id } }

    it "returns a failed result" do
      expect(result.success?).to be false
    end

    it "returns a cycle error" do
      expect(result.errors).to include("Cannot move a node under itself or its descendants")
    end
  end

  describe "attempting to move a node under one of its descendants" do
    let(:node) { create(:node, :storage) }
    let(:child) { create(:node, :storage, parent: node) }
    let(:grandchild) { create(:node, :storage, parent: child) }
    let(:params) { { parent_id: grandchild.id } }

    it "returns a failed result" do
      expect(result.success?).to be false
    end

    it "returns a cycle error" do
      expect(result.errors).to include("Cannot move a node under itself or its descendants")
    end
  end
end
