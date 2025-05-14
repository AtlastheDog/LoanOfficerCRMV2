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
        'isOverlayRequired' => false,
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

      result['ParsedResults'].first['ParsedText']
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
end