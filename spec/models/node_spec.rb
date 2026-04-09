require "rails_helper"

RSpec.describe Node, type: :model do
  describe "validations" do
    it "is valid with a title and node_type" do
      expect(build(:node)).to be_valid
    end

    it "requires a title" do
      expect(build(:node, title: nil)).not_to be_valid
    end

    it "requires a title to be non-blank" do
      expect(build(:node, title: "")).not_to be_valid
    end

    it "allows nil code" do
      expect(build(:node, code: nil)).to be_valid
    end

    it "rejects duplicate codes (case-insensitive)" do
      create(:node, :with_code, code: "A1")
      expect(build(:node, code: "a1")).not_to be_valid
    end

    it "allows two nodes with nil code" do
      create(:node, code: nil)
      expect(build(:node, code: nil)).to be_valid
    end
  end

  describe "parent validation" do
    it "allows a child under a storage node" do
      storage = create(:node, :storage)
      expect(build(:node, parent: storage)).to be_valid
    end

    it "rejects a child under a thing node" do
      thing = create(:node, :thing)
      child = build(:node, parent: thing)

      expect(child).not_to be_valid
      expect(child.errors[:base]).to include("Parent must be a storage node")
    end
  end

  describe "ancestry" do
    it "tracks parent/child relationships" do
      shed = create(:node, title: "Shed")
      shelf = create(:node, title: "Shelf", parent: shed)

      expect(shelf.parent).to eq(shed)
      expect(shed.children).to include(shelf)
    end

    it "returns path nodes from root to self" do
      shed = create(:node, title: "Shed")
      box = create(:node, title: "Box", parent: shed)

      expect(box.path_nodes).to eq([ shed, box ])
    end

    it "restricts deletion of nodes with children" do
      parent = create(:node)
      create(:node, parent: parent)

      expect { parent.destroy! }.to raise_error(Ancestry::AncestryException)
    end
  end

  describe "scopes" do
    it "returns root nodes" do
      root = create(:node)
      child = create(:node, parent: root)

      expect(Node.roots).to include(root)
      expect(Node.roots).not_to include(child)
    end
  end
end
