Rails.application.routes.draw do
  devise_for :users

  resources :leads do
    collection do
      get :analyze  # GET /leads/analyze → LeadsController#analyze
    end

    resources :feedbacks, only: [:new, :create]
  end

  resources :scenarios
  resources :loan_conditions, only: [:index, :show]
  resources :rate_points, only: [:index, :show, :new, :create]
  resources :images, only: [:create]

  # Display OCR results stored in session
  get 'results', to: 'images#results'

  # Test endpoint for verifying OCR ingestion
  post 'test_ocr', to: 'images#test_ocr'

  root to: 'leads#index'
end
