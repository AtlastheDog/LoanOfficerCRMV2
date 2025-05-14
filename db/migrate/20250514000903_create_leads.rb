class CreateLeads < ActiveRecord::Migration[8.0]
  def change
    create_table :leads do |t|
      t.text :first_name
      t.text :last_name
      t.text :phone_number
      t.text :email
      t.date :creation_date
      t.date :last_contacted_date
      t.integer :fico_score
      t.text :loan_type
      t.decimal :property_value
      t.decimal :loan_value
      t.text :loan_purpose
      t.text :state
      t.text :occupancy
      t.integer :interest_level
      t.text :notes
      t.decimal :minimum_rate_needed
      t.decimal :maximum_points_needed
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
