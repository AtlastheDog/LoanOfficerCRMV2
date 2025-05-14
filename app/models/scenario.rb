class Scenario < ApplicationRecord
  belongs_to :lead
  has_many :rate_points, dependent: :destroy

  # Optional: validations
  validates :points, numericality: true, allow_nil: true
end
