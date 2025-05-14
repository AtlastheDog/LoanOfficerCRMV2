class AddPointsToScenarios < ActiveRecord::Migration[8.0]
  def change
    add_column :scenarios, :points, :decimal
  end
end
