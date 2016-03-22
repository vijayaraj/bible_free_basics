class Chapter
  def fetch_verses(chapter_id)
    perform_api_call do
      @url = construct_verse_end_point(chapter_id)
    end
  end

  def fetch_audio(chapter_id)
    perform_api_call do
      @url = construct_audio_end_point(chapter_id)
    end
  end

  private

  def perform_api_call
    yield if block_given?
    response = connection.get(@url)
    JSON.parse(response.body)
  rescue Timeout::Error => e
    Rails.logger.debug %(Timeout when trying to access Digital Bible Platform)
    nil
  rescue Exception => e
    Rails.logger.debug %(Error in Digital Bible Platform API - #{e})
    nil
  end

  def connection
    Faraday.new(url: API_CONFIG[:host]) do |c|
      c.use Faraday::Request::UrlEncoded  # encode request params as "www-form-urlencoded"
      c.use Faraday::Response::Logger     # log request & response to STDOUT
      c.use Faraday::Adapter::NetHttp     # perform requests with Net::HTTP
    end
  end

  def construct_verse_end_point(chapter_id)
    %(#{API_CONFIG[:host]}/text/verse?\
      key=#{API_CONFIG[:key]}&\
      dam_id=#{API_CONFIG[:verse_dam_id]}&\
      book_id=#{API_CONFIG[:book_id]}&\
      chapter_id=#{chapter_id}&\
      v=#{API_CONFIG[:version]}\
    )
  end

  def construct_audio_end_point(chapter_id)
    %(#{API_CONFIG[:host]}/audio/path?\
      key=#{API_CONFIG[:key]}&\
      dam_id=#{API_CONFIG[:audio_dam_id]}&\
      book_id=#{API_CONFIG[:book_id]}&\
      chapter_id=#{chapter_id}&\
      v=#{API_CONFIG[:version]}\
    )
  end
end
