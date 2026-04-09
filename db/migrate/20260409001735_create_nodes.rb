class CreateNodes < ActiveRecord::Migration[8.1]
  def change
    create_enum :node_type, %w[storage thing]

    create_table :nodes do |t|
      t.enum :node_type, enum_type: :node_type, null: false
      t.string :title, null: false
      t.text :description
      t.string :code
      t.string :ancestry

      t.timestamps
    end

    add_index :nodes, :ancestry
    add_index :nodes, :code, unique: true, where: "code IS NOT NULL"
  end
end
