export interface RatePoint {
  rate: number
  points: number
}

export interface ScenarioData {
  ficoScoreGroup: string
  loanTypeGroup: string
  propertyValueGroup: string
  loanValueGroup: string
  loanPurposeGroup: string
  state: string
  occupancy: string
}

export interface Scenario {
  id: number
  actual_interest_rate: number
  points: number
  fico_score_group: string
  loan_type_group: string
  property_value_group: string
  loan_value_group: string
  loan_purpose_group: string
  state: string
  occupancy: string
  created_at: string
}
