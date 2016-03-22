class ChaptersController < ApplicationController
  def show
    @verses = chapter.fetch_verses(params[:id])
    @audio = chapter.fetch_audio(params[:id])
  end

  private

  def chapter
    @chapter ||= Chapter.new
  end
end
