class ScenariosController < ApplicationController
  before_action :authenticate_user!
  before_action :set_scenario, only: [:show, :edit, :update, :destroy]

  # GET /scenarios
  def index
    @scenarios = Scenario.includes(:rate_points).all
  end

  # GET /scenarios/1
  def show
    @rate_points = @scenario.rate_points
  end

  # GET /scenarios/new
  def new
    @scenario = Scenario.new
  end

  # GET /scenarios/1/edit
  def edit
  end

  # POST /scenarios
  def create
    @scenario = Scenario.new(scenario_params)

    if @scenario.save
      redirect_to @scenario, notice: 'Scenario was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /scenarios/1
  def update
    if @scenario.update(scenario_params)
      redirect_to @scenario, notice: 'Scenario was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /scenarios/1
  def destroy
    @scenario.destroy
    redirect_to scenarios_url, notice: 'Scenario was successfully destroyed.'
  end

  private

  def set_scenario
    @scenario = Scenario.includes(:rate_points).find(params[:id])
  end

  def scenario_params
    params.require(:scenario).permit(
      :lead_id,
      :actual_interest_rate,
      :fico_score_group,
      :loan_type_group,
      :property_value_group,
      :loan_value_group,
      :loan_purpose_group,
      :state,
      :occupancy,
      :actual_cost,
      :points
    )
  end
end
