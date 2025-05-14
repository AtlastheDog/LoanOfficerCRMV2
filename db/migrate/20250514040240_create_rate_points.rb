class CreateRatePoints < ActiveRecord::Migration[8.0]
  def change
    create_table :rate_points do |t|
      t.references :scenario, null: false, foreign_key: true
      t.decimal :rate
      t.decimal :points

      t.timestamps
    end
  end
end
