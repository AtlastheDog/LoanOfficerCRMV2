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

export interface RateSheetUploadFormData {
  ficoScoreGroup: string
  loanTypeGroup: string
  propertyValueGroup: string
  loanValueGroup: string
  loanPurposeGroup: string
  state: string
  occupancy: string
}

export interface RateSheetResults {
  ocr_results: RatePoint[]
  scenario_data: ScenarioData
}
