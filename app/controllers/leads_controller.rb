class LeadsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_lead, only: [:show, :edit, :update, :destroy, :add_ocr_results]

  # GET /leads
  def index
    @leads = Lead.includes(scenarios: :rate_points).all
  end

  # GET /leads/analyze
  def analyze
    @recommended_leads = LeadMatcher.match_all(current_user.leads)
  end

  # GET /leads/1
  def show
    @scenarios = @lead.scenarios.includes(:rate_points)
  end

  # GET /leads/new
  def new
    @lead = Lead.new
  end

  # GET /leads/1/edit
  def edit
  end

  # POST /leads
  def create
    @lead = Lead.new(lead_params)

    if @lead.save
      redirect_to @lead, notice: 'Lead was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /leads/1
  def update
    if @lead.update(lead_params)
      redirect_to @lead, notice: 'Lead was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /leads/1
  def destroy
    @lead.destroy
    redirect_to leads_url, notice: 'Lead was successfully destroyed.'
  end

  # POST /leads/1/add_ocr_results
  def add_ocr_results
    ocr_results = session[:ocr_results] || []

    if ocr_results.empty?
      redirect_to @lead, alert: "No OCR results found in session."
      return
    end

    ocr_results.each do |data|
      next unless data[:rate].present? && data[:points].present?

      scenario = @lead.scenarios.find_or_create_by(
        actual_interest_rate: data[:rate],
        points: data[:points]
      )

      scenario.rate_points.find_or_create_by(
        rate: data[:rate],
        points: data[:points]
      )
    end

    session.delete(:ocr_results)

    redirect_to @lead, notice: 'OCR results added to lead.'
  end

  private

  def set_lead
    @lead =
