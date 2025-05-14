class ImagesController < ApplicationController
  before_action :authenticate_user!

  def create
    uploaded_image = params[:image]

    if uploaded_image.blank?
      redirect_to root_path, alert: 'No image was uploaded.'
      return
    end

    image_path = uploaded_image.tempfile.path

    ocr_service = OcrService.new(ENV['OCR_SPACE_API_KEY'])
    parsed_text = ocr_service.parse_image(image_path)

    if parsed_text.present?
      extracted_data = ocr_service.extract_rates_and_points(parsed_text)

      if extracted_data.any?
        session[:ocr_results] = extracted_data
        redirect_to results_path, notice: 'Image processed successfully.'
      else
        redirect_to root_path, alert: 'OCR succeeded, but no rate/point data was found.'
      end
    else
      redirect_to root_path, alert: 'Failed to process image with OCR.'
    end
  end

  def results
    @ocr_results = session[:ocr_results] || []
  end
end
