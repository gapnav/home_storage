# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_04_09_001735) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  # Custom types defined in this database.
  # Note that some types may not work with other database engines. Be careful if changing database.
  create_enum "node_type", ["storage", "thing"]

  create_table "nodes", force: :cascade do |t|
    t.string "ancestry"
    t.string "code"
    t.datetime "created_at", null: false
    t.text "description"
    t.enum "node_type", null: false, enum_type: "node_type"
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index ["ancestry"], name: "index_nodes_on_ancestry"
    t.index ["code"], name: "index_nodes_on_code", unique: true, where: "(code IS NOT NULL)"
  end
end
