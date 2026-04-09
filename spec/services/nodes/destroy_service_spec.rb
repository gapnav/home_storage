require "rails_helper"

RSpec.describe Nodes::DestroyService do
  subject(:result) { described_class.new(node:).call }

  describe "destroying a thing node" do
    let!(:node) { create(:node, :thing) }

    it "returns a successful result" do
      expect(result.success?).to be true
    end

    it "removes the node from the database" do
      expect { result }.to change(Node, :count).by(-1)
    end
  end

  describe "destroying an empty storage node" do
    let!(:node) { create(:node, :storage) }

    it "returns a successful result" do
      expect(result.success?).to be true
    end

    it "removes the node from the database" do
      expect { result }.to change(Node, :count).by(-1)
    end
  end

  describe "destroying a child thing node" do
    let!(:parent) { create(:node, :storage) }
    let!(:node) { create(:node, :thing, parent:) }

    it "returns a successful result" do
      expect(result.success?).to be true
    end

    it "removes the child node" do
      expect { result }.to change(Node, :count).by(-1)
    end

    it "leaves the parent intact" do
      result
      expect(Node.exists?(parent.id)).to be true
    end
  end

  describe "attempting to destroy a storage node with a storage child" do
    let!(:node) { create(:node, :storage) }
    let!(:child) { create(:node, :storage, parent: node) }

    it "returns a failed result" do
      expect(result.success?).to be false
    end

    it "returns a non-empty storage error" do
      expect(result.errors).to include("Cannot delete a storage that contains items")
    end

    it "does not remove the node" do
      expect { result }.not_to change(Node, :count)
    end
  end

  describe "attempting to destroy a storage node with a thing child" do
    let!(:node) { create(:node, :storage) }
    let!(:child) { create(:node, :thing, parent: node) }

    it "returns a failed result" do
      expect(result.success?).to be false
    end

    it "returns a non-empty storage error" do
      expect(result.errors).to include("Cannot delete a storage that contains items")
    end
  end
end
