class AddFeedbackColumnsToFeedbacks < ActiveRecord::Migration[6.1]
  def change
    add_column :feedbacks, :satisfied_rate, :boolean
    add_column :feedbacks, :satisfied_points, :boolean
    add_column :feedbacks, :comments, :text
  end
end
