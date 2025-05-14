class OcrService
  include HTTParty
  base_uri 'https://api.ocr.space'

  def initialize(api_key)
    @api_key = api_key
  end

  def parse_image(image_path)
    options = {
      headers: { 'apikey' => @api_key },
      body: {
        'language' => 'eng',
        'isOverlayRequired' => true, # changed from false to true to enable overlay
        'url' => '',
        'iscreatesearchablepdf' => false,
        'issearchablepdfhidetextlayer' => false,
        'file' => File.open(image_path),
        'OCREngine' => 2
      }
    }

    begin
      response = self.class.post('/parse/image', options)
      result = JSON.parse(response.body)

      if result['IsErroredOnProcessing']
        raise "OCR Error: #{result['ErrorMessage']}"
      end

      result
    rescue => e
      puts "Error parsing image: #{e.message}"
      nil
    end
  end

  def extract_rates_and_points(parsed_text)
    return [] unless parsed_text

    rows = parsed_text.split("\n")
    results = []

    rows.each do |row|
      parts = row.strip.split(/\s+/)

      next unless parts[0] =~ /^\d+\.\d{3}$/ || parts[0] =~ /^\d+\.\d{2}$/ # detect Rate

      rate = parts[0].to_f
      points_raw = parts[4] rescue nil
      next unless points_raw

      points = points_raw.to_f
      results << { rate: rate, points: points }
    end

    results
  end

  def extract_rate_price_pairs_from_overlay(json_data)
    lines = json_data.dig("ParsedResults", 0, "Overlay", "Lines")
    return [] unless lines

    rows = Hash.new { |h, k| h[k] = {} }

    lines.each do |line|
      min_top = line["MinTop"]
      text = line["LineText"]

      if text.match?(/^\d+\.\d{3}$/)
        rows[min_top][:rate] ||= text.to_f
      elsif text.match?(/^\d{2,3}\.\d{3}$/)
        rows[min_top][:price] ||= text.to_f
      elsif text.match?(/^\$\d{1,3}(,\d{3})?$/)
        rows[min_top][:]()_]()
