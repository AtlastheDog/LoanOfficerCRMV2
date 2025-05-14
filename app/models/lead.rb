class Lead < ApplicationRecord
  # Associations
  belongs_to :user
  has_many :scenarios, dependent: :destroy
  has_many :feedbacks, dependent: :destroy

  # Constants for dropdown options
  LOAN_TYPES = ['Conventional', 'FHA', 'VA/IRRL', 'USDA']
  PROPERTY_TYPES = ['SFR', 'Condo', 'MultiUnit', 'PUD']
  LOAN_PURPOSES = ['Purchase', 'No cash-out refinance', 'Cash out refinance']
  OCCUPANCY_TYPES = ['Primary', 'Secondary', 'Investment']

  # Validations
  validates :loan_type, inclusion: { in: LOAN_TYPES }, allow_blank: true
  validates :property_type, inclusion: { in: PROPERTY_TYPES }, allow_blank: true
  validates :loan_purpose, inclusion: { in: LOAN_PURPOSES }, allow_blank: true
  validates :occupancy, inclusion: { in: OCCUPANCY_TYPES }, allow_blank: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true
  validates :fico_score, numericality: { greater_than_or_equal_to: 300, less_than_or_equal_to: 850 }, allow_blank: true
end
