class AddPropertyTypeToLeads < ActiveRecord::Migration[8.0]
  def change
    add_column :leads, :property_type, :string
  end
end
