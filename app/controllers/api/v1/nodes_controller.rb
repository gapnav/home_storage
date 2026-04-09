module Api
  module V1
    class NodesController < ApplicationController
      before_action :set_node, only: [ :show, :update, :destroy ]

      def index
        nodes = if params[:q].present?
          Node.where(Node.arel_table[:title].matches("%#{params[:q].strip}%"))
        elsif params[:parent_id]
          parent = Node.find_by(id: params[:parent_id])
          return render json: { errors: [ "Parent not found" ] }, status: :not_found unless parent
          parent.children
        else
          Node.roots
        end
        render json: { data: nodes.map { |n| node_json(n) } }
      end

      def show
        render json: { data: node_detail_json(@node) }
      end

      def create
        result = Nodes::CreateService.new(params: create_params).call
        if result.success?
          render json: { data: node_json(result.node) }, status: :created
        else
          render json: { errors: result.errors }, status: :unprocessable_entity
        end
      end

      def update
        all_params = update_params

        if all_params.include?("parent_id")
          result = Nodes::MoveService.new(node: @node, params: all_params).call
          return render json: { errors: result.errors }, status: :unprocessable_entity unless result.success?
          @node = result.node
        end

        attr_params = all_params.except("parent_id")
        if attr_params.present? && !@node.update(attr_params)
          return render json: { errors: @node.errors.full_messages }, status: :unprocessable_entity
        end

        render json: { data: node_json(@node) }
      end

      def destroy
        result = Nodes::DestroyService.new(node: @node).call
        if result.success?
          head :no_content
        else
          render json: { errors: result.errors }, status: :unprocessable_entity
        end
      end

      private

      def set_node
        @node = Node.find_by(id: params[:id])
        render json: { errors: [ "Not found" ] }, status: :not_found unless @node
      end

      def create_params
        params.require(:node).permit(:title, :node_type, :parent_id, :description, :code)
      end

      def update_params
        params.require(:node).permit(:title, :description, :code, :parent_id)
      end

      def node_json(node)
        {
          id: node.id,
          nodeType: node.node_type,
          title: node.title,
          description: node.description,
          code: node.code,
          parentId: node.parent_id
        }
      end

      def node_detail_json(node)
        node_json(node).merge(
          path: node.path_nodes.map { |n| { id: n.id, title: n.title } },
          children: node.children.map { |c| node_json(c) }
        )
      end
    end
  end
end
