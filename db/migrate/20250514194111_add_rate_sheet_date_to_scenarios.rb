class AddRateSheetDateToScenarios < ActiveRecord::Migration[8.0]
  def change
    add_column :scenarios, :rate_sheet_date, :date
  end
end
