module Nodes
  class MoveService
    def initialize(node:, params:)
      @node = node
      @new_parent_id = params.to_h.symbolize_keys[:parent_id]
    end

    def call
      if @new_parent_id
        return failure("Parent not found") unless new_parent
        return failure("Parent must be a storage node") unless new_parent.storage?
        return failure("Cannot move a node under itself or its descendants") if invalid_destination?
      end

      @node.parent = new_parent
      if @node.save
        Result.new(success?: true, node: @node, errors: [])
      else
        Result.new(success?: false, node: @node, errors: @node.errors.full_messages)
      end
    end

    private

    def new_parent
      return nil if @new_parent_id.nil?

      @new_parent ||= Node.find_by(id: @new_parent_id)
    end

    def invalid_destination?
      new_parent == @node || @node.descendant_ids.include?(new_parent.id)
    end

    def failure(message)
      Result.new(success?: false, node: @node, errors: [ message ])
    end
  end
end
