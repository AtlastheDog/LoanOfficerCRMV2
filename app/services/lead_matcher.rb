class LeadMatcher
  FICO_SCORE_GROUPS = {
    'Low' => 300..600,
    'Medium' => 601..700,
    'High' => 701..850
  }

  VALUE_GROUPS = {
    'Low' => 1..200_000,
    'Medium' => 201_000..600_000,
    'High' => 601_000..Float::INFINITY
  }

  def self.determine_fico_group(fico_score)
    return nil if fico_score.nil?

    FICO_SCORE_GROUPS.each do |group, range|
      return group if range.include?(fico_score)
    end
    nil
  end

  def self.determine_value_group(value)
    return nil if value.nil?

    VALUE_GROUPS.each do |group, range|
      return group if range.include?(value)
    end
    nil
  end

  def self.match_all(leads, scenarios = Scenario.where(rate_sheet_date: Date.current))
    matched = []

    leads.each do |lead|
      scenarios.each do |scenario|
        next unless matches?(lead, scenario)

        matched << {
          first_name: lead.first_name,
          last_name: lead.last_name,
          email: lead.email,
          fico_score: lead.fico_score,
          loan_purpose: lead.loan_purpose,
          minimum_rate_needed: lead.minimum_rate_needed,
          maximum_points_needed: lead.maximum_points_needed
        }

        break # Stop at first match
      end
    end

    matched.sort_by { |lead| -completeness_score(leads.find { |l| l.email == lead[:email] }) }
  end

  def self.matches?(lead, scenario)
    return false if scenario.actual_interest_rate.nil? || scenario.points.nil?
    return false if lead.minimum_rate_needed.nil? || lead.maximum_points_needed.nil?

    rate_and_points_match =
      scenario.actual_interest_rate <= lead.minimum_rate_needed &&
      scenario.points <= lead.maximum_points_needed

    return false unless rate_and_points_match

    fico_match = lead.fico_score.nil? || determine_fico_group(lead.fico_score) == scenario.fico_score_group
    loan_type_match = lead.loan_type.nil? || lead.loan_type == scenario.loan_type_group
    property_type_match = lead.property_type.nil? || lead.property_type == scenario.property_type_group
    property_value_match = lead.property_value.nil? || determine_value_group(lead.property_value) == scenario.property_value_group
    loan_value_match = lead.loan_value.nil? || determine_value_group(lead.loan_value) == scenario.loan_value_group
    loan_purpose_match = lead.loan_purpose.nil? || lead.loan_purpose == scenario.loan_purpose_group
    state_match = lead.state.nil? || lead.state == scenario.state
    occupancy_match = lead.occupancy.nil? || lead.occupancy == scenario.occupancy

    fico_match && loan_type_match && property_type_match &&
      property_value_match && loan_value_match && loan_purpose_match &&
      state_match && occupancy_match
  end

  def self.completeness_score(lead)
    [
      lead.fico_score,
      lead.loan_type,
      lead.property_type,
      lead.property_value,
      lead.loan_value,
      lead.loan_purpose,
      lead.state,
      lead.occupancy
    ].count(&:present?)
  end
end

