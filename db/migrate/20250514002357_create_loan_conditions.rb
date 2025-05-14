class CreateLoanConditions < ActiveRecord::Migration[8.0]
  def change
    create_table :loan_conditions do |t|
      t.decimal :interest_rate
      t.text :fico_score_group
      t.text :loan_type_group
      t.text :property_value_group
      t.text :loan_value_group
      t.text :loan_purpose_group
      t.text :state
      t.text :occupancy
      t.decimal :cost
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
