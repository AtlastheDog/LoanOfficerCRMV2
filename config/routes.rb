Rails.application.routes.draw do
  devise_for :users

  resources :leads
  resources :scenarios
  resources :feedbacks
  resources :loan_conditions
  resources :posts
  resources :comments
  resources :images, only: [:create]

  # Route to display OCR results
  get 'results', to: 'images#results'

  # Temporary route for testing OCR ingestion
  post 'test_ocr', to: 'images#test_ocr'

  root to: 'leads#index'
end

