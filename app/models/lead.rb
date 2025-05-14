class Lead < ApplicationRecord
  belongs_to :user
  has_many :scenarios
  has_many :feedbacks
end