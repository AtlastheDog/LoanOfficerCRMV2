class Lead < ApplicationRecord
  belongs_to :user
  has_many :scenarios, dependent: :destroy
  has_many :feedbacks, dependent: :destroy

  LOAN_TYPES = ['Conventional', 'FHA', 'VA/IRRL', 'USDA']
  LOAN_PURPOSES = ['Purchase', 'No cash-out refinance', 'Cash out refinance']
  PROPERTY_TYPES = ['SFR', 'Condo', 'MultiUnit', 'PUD']
  OCCUPANCY_TYPES = ['Primary', 'Secondary', 'Investment']
  STATES = %w[
    AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD
    MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC
    SD TN TX UT VT VA WA WV WI WY
  ]

  validates :loan_type, inclusion: { in: LOAN_TYPES }, allow_blank: true
  validates :loan_purpose, inclusion: { in: LOAN_PURPOSES }, allow_blank: true
  validates :property_type, inclusion: { in: PROPERTY_TYPES }, allow_blank: true
  validates :occupancy, inclusion: { in: OCCUPANCY_TYPES }, allow_blank: true
  validates :state, inclusion: { in: STATES }, allow_blank: true
end

