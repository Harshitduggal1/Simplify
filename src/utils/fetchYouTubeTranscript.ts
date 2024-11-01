import { YoutubeTranscript } from 'youtube-transcript';

export default async function fetchYouTubeTranscript(videoId: string): Promise<string> {
  if (!videoId) {
    throw new Error('Video ID is required');
  }

  try {
    // Clean the video ID
    const cleanVideoId = videoId.trim();
    
    // Fetch transcript with retry logic
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        const transcriptResponse = await YoutubeTranscript.fetchTranscript(cleanVideoId);
        
        if (!transcriptResponse || transcriptResponse.length === 0) {
          throw new Error('No transcript found for this video');
        }

        // Process and clean the transcript
        const fullTranscript = transcriptResponse
          .map(item => item.text)
          .join(' ')
          .replace(/\s+/g, ' ')
          .replace(/\n+/g, ' ')
          .trim();

        if (!fullTranscript) {
          throw new Error('Empty transcript received');
        }

        return fullTranscript;

      } catch (error) {
        attempts++;
        if (attempts === maxAttempts) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }

    throw new Error('Failed to fetch transcript after multiple attempts');

  } catch (error) {
    console.error('Transcript fetch error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Video unavailable')) {
        throw new Error('This video is unavailable or private');
      }
      if (error.message.includes('Transcript disabled')) {
        throw new Error('Transcripts are not available for this video');
      }
    }
    
    throw new Error('Failed to fetch video transcript. Please try another video.');
  }
} 