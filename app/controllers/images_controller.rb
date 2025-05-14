class ImagesController < ApplicationController
  # Skip authentication for the test_ocr endpoint
  before_action :authenticate_user!, except: [:test_ocr]

  def create
    uploaded_image = params[:image]

    if uploaded_image.blank?
      redirect_to root_path, alert: 'No image was uploaded.'
      return
    end

    image_path = uploaded_image.tempfile.path
    ocr_service = OcrService.new(ENV['OCR_SPACE_API_KEY'])

    # Parse full JSON response (Overlay + ParsedText)
    ocr_result = ocr_service.parse_image(image_path)

    if ocr_result.present?
      parsed_text = ocr_result.dig("ParsedResults", 0, "ParsedText")
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

  # ✅ Raw OCR test endpoint (for curl or browser testing)
  def test_ocr
    uploaded_image = params[:image]

    if uploaded_image.blank?
      render plain: "No image uploaded", status: :bad_request
      return
    end

    image_path = uploaded_image.tempfile.path
    ocr_service = OcrService.new(ENV['OCR_SPACE_API_KEY'])
    ocr_result = ocr_service.parse_image(image_path)

    if ocr_result.present?
      # Optional: support structured output via ?parsed=true
      if params[:parsed] == "true"
        structured_data = ocr_service.extract_rate_price_pairs_from_overlay(ocr_result)
        render json: structured_data
      else
        render json: ocr_result
      end
    else
      render plain: "OCR failed", status: :internal_server_error
    end
  end
end
