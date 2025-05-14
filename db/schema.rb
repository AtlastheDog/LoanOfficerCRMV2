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

ActiveRecord::Schema[8.0].define(version: 2025_05_14_040240) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "feedbacks", force: :cascade do |t|
    t.bigint "lead_id", null: false
    t.bigint "user_id", null: false
    t.text "feedback"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["lead_id"], name: "index_feedbacks_on_lead_id"
    t.index ["user_id"], name: "index_feedbacks_on_user_id"
  end

  create_table "leads", force: :cascade do |t|
    t.text "first_name"
    t.text "last_name"
    t.text "phone_number"
    t.text "email"
    t.date "creation_date"
    t.date "last_contacted_date"
    t.integer "fico_score"
    t.text "loan_type"
    t.decimal "property_value"
    t.decimal "loan_value"
    t.text "loan_purpose"
    t.text "state"
    t.text "occupancy"
    t.integer "interest_level"
    t.text "notes"
    t.decimal "minimum_rate_needed"
    t.decimal "maximum_points_needed"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_leads_on_user_id"
  end

  create_table "loan_conditions", force: :cascade do |t|
    t.decimal "interest_rate"
    t.text "fico_score_group"
    t.text "loan_type_group"
    t.text "property_value_group"
    t.text "loan_value_group"
    t.text "loan_purpose_group"
    t.text "state"
    t.text "occupancy"
    t.decimal "cost"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_loan_conditions_on_user_id"
  end

  create_table "rate_points", force: :cascade do |t|
    t.bigint "scenario_id", null: false
    t.decimal "rate"
    t.decimal "points"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["scenario_id"], name: "index_rate_points_on_scenario_id"
  end

  create_table "scenarios", force: :cascade do |t|
    t.bigint "lead_id", null: false
    t.decimal "actual_interest_rate"
    t.text "fico_score_group"
    t.text "loan_type_group"
    t.text "property_type_group"
    t.text "property_value_group"
    t.text "loan_value_group"
    t.text "loan_purpose_group"
    t.text "state"
    t.text "occupancy"
    t.decimal "actual_cost"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "points"
    t.index ["lead_id"], name: "index_scenarios_on_lead_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "feedbacks", "leads"
  add_foreign_key "feedbacks", "users"
  add_foreign_key "leads", "users"
  add_foreign_key "loan_conditions", "users"
  add_foreign_key "rate_points", "scenarios"
  add_foreign_key "scenarios", "leads"
end
