module Nodes
  class DestroyService
    def initialize(node:)
      @node = node
    end

    def call
      if @node.storage? && @node.children.any?
        return Result.new(success?: false, node: @node, errors: [ "Cannot delete a storage that contains items" ])
      end

      @node.destroy!
      Result.new(success?: true, node: @node, errors: [])
    end
  end
end
