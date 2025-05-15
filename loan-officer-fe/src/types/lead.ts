export interface Lead {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  loan_type: string
  loan_purpose: string
  property_type: string
  property_value: number
  loan_value: number
  fico_score: number
  state: string
  occupancy: string
  minimum_rate_needed: number
  maximum_points_needed: number
  created_at: string
  updated_at: string
}

export interface LeadInput {
  first_name: string
  last_name: string
  email: string
  phone?: string
  loan_type?: string
  loan_purpose?: string
  property_type?: string
  property_value?: number
  loan_value?: number
  fico_score?: number
  state?: string
  occupancy?: string
  minimum_rate_needed?: number
  maximum_points_needed?: number
}

export interface LeadFeedback {
  satisfied_rate: boolean
  satisfied_points: boolean
}

export interface LeadWithFeedback extends Lead {
  feedback?: LeadFeedback
}
