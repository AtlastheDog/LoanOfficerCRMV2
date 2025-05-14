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

  root to: 'leads#index'
end
