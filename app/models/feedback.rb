class Feedback < ApplicationRecord
  # Associations
  belongs_to :lead
  belongs_to :user

  # Validations
  validates :satisfied_rate, inclusion: { in: [true, false] }
  validates :satisfied_points, inclusion: { in: [true, false] }
  validates :comments, length: { maximum: 1000 }, allow_blank: true

  # Prevent duplicate feedback per lead/user pair (optional safeguard)
  validates :lead_id, uniqueness: { scope: :user_id, message: "feedback already submitted" }

  # Scopes
  scope :satisfied, -> { where(satisfied_rate: true, satisfied_points: true) }

  # Instance Methods
  def fully_satisfied?
    satisfied_rate && satisfied_points
  end
end

