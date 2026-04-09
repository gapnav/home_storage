require "rails_helper"

RSpec.describe "Api::V1::Nodes", type: :request do
  let(:parsed)     { JSON.parse(response.body) }
  let(:json_data)  { parsed["data"] }
  let(:json_errors) { parsed["errors"] }

  describe "GET /api/v1/nodes" do
    context "with no params" do
      let!(:root1) { create(:node, :storage, title: "Shed") }
      let!(:root2) { create(:node, :storage, title: "Garage") }
      let!(:child)  { create(:node, :thing, title: "Hammer", parent: root1) }

      it "returns only root nodes" do
        get "/api/v1/nodes"
        expect(response).to have_http_status(:ok)
        expect(json_data.pluck("id")).to contain_exactly(root1.id, root2.id)
      end

      it "returns lightweight nodes without path or children" do
        get "/api/v1/nodes"
        shed = json_data.find { |n| n["id"] == root1.id }
        expect(shed.key?("path")).to be false
        expect(shed.key?("children")).to be false
      end
    end

    context "with parent_id" do
      let!(:parent) { create(:node, :storage) }
      let!(:child1) { create(:node, :thing, parent:) }
      let!(:child2) { create(:node, :storage, parent:) }
      let!(:other)  { create(:node, :thing) }

      it "returns only direct children" do
        get "/api/v1/nodes", params: { parent_id: parent.id }
        expect(response).to have_http_status(:ok)
        expect(json_data.pluck("id")).to contain_exactly(child1.id, child2.id)
      end
    end

    context "with non-existent parent_id" do
      it "returns 404" do
        get "/api/v1/nodes", params: { parent_id: 0 }
        expect(response).to have_http_status(:not_found)
      end
    end

    context "with q param" do
      let!(:box)   { create(:node, :storage, title: "Big Box") }
      let!(:other) { create(:node, :thing, title: "Hammer") }

      it "returns matching nodes" do
        get "/api/v1/nodes", params: { q: "box" }
        expect(response).to have_http_status(:ok)
        expect(json_data.pluck("id")).to contain_exactly(box.id)
      end

      it "returns empty array when no matches" do
        get "/api/v1/nodes", params: { q: "zzznomatch" }
        expect(json_data).to be_empty
      end

      it "is case-insensitive" do
        get "/api/v1/nodes", params: { q: "BIG BOX" }
        expect(json_data.pluck("id")).to contain_exactly(box.id)
      end

      it "strips surrounding whitespace from query" do
        get "/api/v1/nodes", params: { q: "  box  " }
        expect(json_data.pluck("id")).to contain_exactly(box.id)
      end
    end
  end

  describe "GET /api/v1/nodes/:id" do
    let!(:parent) { create(:node, :storage, title: "Shed") }
    let!(:node)   { create(:node, :storage, title: "Shelf A", parent:) }
    let!(:child)  { create(:node, :thing, title: "Hammer", parent: node) }

    it "returns the node with path and children" do
      get "/api/v1/nodes/#{node.id}"
      expect(response).to have_http_status(:ok)
      expect(json_data["id"]).to eq(node.id)
      expect(json_data["path"].pluck("id")).to eq([ parent.id, node.id ])
      expect(json_data["children"].pluck("id")).to eq([ child.id ])
    end

    it "returns 404 for unknown id" do
      get "/api/v1/nodes/0"
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /api/v1/nodes" do
    context "with valid params" do
      let(:params) { { node: { title: "Attic", node_type: "storage" } } }

      it "creates the node and returns 201" do
        expect {
          post("/api/v1/nodes", params:)
        }.to change(Node, :count).by(1)
        expect(response).to have_http_status(:created)
      end

      it "returns the created node" do
        post("/api/v1/nodes", params:)
        expect(json_data["title"]).to eq("Attic")
        expect(json_data["nodeType"]).to eq("storage")
      end
    end

    context "with missing title" do
      it "returns 422 with errors" do
        post("/api/v1/nodes", params: { node: { node_type: "storage" } })
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_errors).to be_present
      end
    end
  end

  describe "PATCH /api/v1/nodes/:id" do
    let!(:node) { create(:node, :storage, title: "Old Title") }

    context "updating title" do
      it "updates and returns the node" do
        patch "/api/v1/nodes/#{node.id}", params: { node: { title: "New Title" } }
        expect(response).to have_http_status(:ok)
        expect(json_data["title"]).to eq("New Title")
        expect(node.reload.title).to eq("New Title")
      end
    end

    context "moving via parent_id" do
      let!(:new_parent) { create(:node, :storage) }

      it "moves the node and returns the updated node" do
        patch "/api/v1/nodes/#{node.id}", params: { node: { parent_id: new_parent.id } }
        expect(response).to have_http_status(:ok)
        expect(json_data["parentId"]).to eq(new_parent.id)
        expect(node.reload.parent).to eq(new_parent)
      end
    end

    context "moving to an invalid parent" do
      let!(:thing) { create(:node, :thing) }

      it "returns 422" do
        patch "/api/v1/nodes/#{node.id}", params: { node: { parent_id: thing.id } }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context "moving under a descendant" do
      let!(:child)      { create(:node, :storage, parent: node) }
      let!(:grandchild) { create(:node, :storage, parent: child) }

      it "returns 422" do
        patch "/api/v1/nodes/#{node.id}", params: { node: { parent_id: grandchild.id } }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_errors).to include("Cannot move a node under itself or its descendants")
      end
    end

    context "moving and updating attributes together" do
      let!(:new_parent) { create(:node, :storage) }

      it "moves and updates attributes in one request" do
        patch "/api/v1/nodes/#{node.id}", params: { node: { parent_id: new_parent.id, title: "New Title" } }
        expect(response).to have_http_status(:ok)
        expect(json_data["parentId"]).to eq(new_parent.id)
        expect(json_data["title"]).to eq("New Title")
      end

      it "does not update attributes if the move fails" do
        patch "/api/v1/nodes/#{node.id}", params: { node: { parent_id: 0, title: "New Title" } }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(node.reload.title).to eq("Old Title")
      end
    end

    context "with unknown id" do
      it "returns 404" do
        patch "/api/v1/nodes/0", params: { node: { title: "x" } }
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "DELETE /api/v1/nodes/:id" do
    context "deleting an empty storage" do
      let!(:node) { create(:node, :storage) }

      it "deletes and returns 204" do
        expect {
          delete "/api/v1/nodes/#{node.id}"
        }.to change(Node, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end

    context "deleting a non-empty storage" do
      let!(:node)  { create(:node, :storage) }
      let!(:child) { create(:node, :thing, parent: node) }

      it "returns 422 and does not delete" do
        expect {
          delete "/api/v1/nodes/#{node.id}"
        }.not_to change(Node, :count)
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context "with unknown id" do
      it "returns 404" do
        delete "/api/v1/nodes/0"
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
