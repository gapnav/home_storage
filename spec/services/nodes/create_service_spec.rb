require "rails_helper"

RSpec.describe Nodes::CreateService do
  subject(:result) { described_class.new(params:).call }

  describe "creating a root storage node" do
    let(:params) { { title: "Shed", node_type: "storage" } }

    it "returns a successful result" do
      expect(result.success?).to be true
    end

    it "persists the node" do
      expect { result }.to change(Node, :count).by(1)
    end

    it "returns the created node with correct attributes" do
      expect(result.node.title).to eq("Shed")
      expect(result.node.node_type).to eq("storage")
    end

    it "returns no errors" do
      expect(result.errors).to be_empty
    end
  end

  describe "creating a root thing node" do
    let(:params) { { title: "Drill", node_type: "thing" } }

    it "returns a successful result" do
      expect(result.success?).to be true
    end

    it "persists the node" do
      expect { result }.to change(Node, :count).by(1)
    end

    it "returns the created node with correct attributes" do
      expect(result.node.title).to eq("Drill")
      expect(result.node.node_type).to eq("thing")
    end

    it "returns no errors" do
      expect(result.errors).to be_empty
    end
  end

  describe "creating a child node under a storage parent" do
    let(:parent) { create(:node, :storage) }
    let(:params) { { title: "Box A", node_type: "storage", parent_id: parent.id } }

    it "returns a successful result" do
      expect(result.success?).to be true
    end

    it "sets the parent relationship" do
      expect(result.node.parent).to eq(parent)
    end
  end

  describe "attempting to create a child under a thing node" do
    let!(:parent) { create(:node, :thing) }
    let(:params) { { title: "Sub-thing", node_type: "thing", parent_id: parent.id } }

    it "returns a failed result" do
      expect(result.success?).to be false
    end

    it "returns a parent type error" do
      expect(result.errors).to include("Parent must be a storage node")
    end

    it "does not persist the node" do
      expect { result }.not_to change(Node, :count)
    end
  end

  describe "attempting to create a node without a title" do
    let(:params) { { node_type: "storage" } }

    it "returns a failed result" do
      expect(result.success?).to be false
    end

    it "returns a title presence error" do
      expect(result.errors).to include("Title can't be blank")
    end
  end

  describe "attempting to create a node with an invalid node_type" do
    let(:params) { { title: "X", node_type: "invalid" } }

    it "returns a failed result" do
      expect(result.success?).to be false
    end

    it "returns an error" do
      expect(result.errors).not_to be_empty
    end
  end

  describe "attempting to create a node with a duplicate code" do
    before { create(:node, :storage, code: "A1") }

    let(:params) { { title: "Another", node_type: "storage", code: "A1" } }

    it "returns a failed result" do
      expect(result.success?).to be false
    end

    it "returns a code uniqueness error" do
      expect(result.errors).to include("Code has already been taken")
    end
  end

  describe "code uniqueness is case-insensitive" do
    before { create(:node, :storage, code: "A1") }

    let(:params) { { title: "Another", node_type: "storage", code: "a1" } }

    it "returns a failed result" do
      expect(result.success?).to be false
    end

    it "returns a code uniqueness error" do
      expect(result.errors).to include("Code has already been taken")
    end
  end

  describe "creating a node with an optional code" do
    let(:params) { { title: "Labelled box", node_type: "storage", code: "B7" } }

    it "returns a successful result" do
      expect(result.success?).to be true
    end

    it "persists the code" do
      expect(result.node.code).to eq("B7")
    end
  end
end
