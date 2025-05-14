class CreateScenarios < ActiveRecord::Migration[8.0]
  def change
    create_table :scenarios do |t|
      t.references :lead, null: false, foreign_key: true
      t.decimal :actual_interest_rate
      t.text :fico_score_group
      t.text :loan_type_group
      t.text :property_type_group
      t.text :property_value_group
      t.text :loan_value_group
      t.text :loan_purpose_group
      t.text :state
      t.text :occupancy
      t.decimal :actual_cost

      t.timestamps
    end
  end
end
