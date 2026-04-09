module Nodes
  class CreateService
    PERMITTED_ATTRS = %i[title node_type parent_id description code].freeze

    def initialize(params:)
      @attrs = params.to_h.symbolize_keys.slice(*PERMITTED_ATTRS)
    end

    def call
      node = Node.new(@attrs)
      if node.save
        Result.new(success?: true, node: node, errors: [])
      else
        Result.new(success?: false, node: node, errors: node.errors.full_messages)
      end
    rescue ArgumentError => e
      Result.new(success?: false, node: Node.new, errors: [ e.message ])
    end
  end
end
