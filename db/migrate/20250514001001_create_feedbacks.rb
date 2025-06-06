class CreateFeedbacks < ActiveRecord::Migration[8.0]
  def change
    create_table :feedbacks do |t|
      t.references :lead, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.text :feedback

      t.timestamps
    end
  end
end
