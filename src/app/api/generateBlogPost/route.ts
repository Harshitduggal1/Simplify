import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import fetchYouTubeTranscript from '@/utils/fetchYouTubeTranscript';
import { summarizeWithGemini } from '@/services/gemini';

interface YouTubeMetadata {
  thumbnail: string;
  views: string;
  likes: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
}

// Update success response to include metadata
interface SuccessResponse {
  blogPost: string;
  metadata: YouTubeMetadata;
}

interface ErrorResponse {
  error: string;
}

// More flexible URL validation
const RequestSchema = z.object({
  videoUrl: z.string()
    .url('Must be a valid URL')
    .refine(
      (url) => {
        const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        return pattern.test(url);
      },
      'Must be a valid YouTube URL'
    )
});
//updated url validation

// Add YouTube metadata fetch function
async function fetchYouTubeMetadata(videoId: string): Promise<YouTubeMetadata | null> {
  try {
    // Check if API key exists
    if (!process.env.YOUTUBE_API_KEY) {
      console.error('YouTube API key is not configured');
      throw new Error('YouTube API key is missing');
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`YouTube API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      console.error('No video data found for ID:', videoId);
      throw new Error('Video not found');
    }

    const video = data.items[0];
    const snippet = video.snippet;
    const statistics = video.statistics;

    // Ensure all required fields exist
    if (!snippet || !statistics) {
      throw new Error('Incomplete video data received');
    }

    return {
      thumbnail: snippet.thumbnails?.maxres?.url || 
                snippet.thumbnails?.high?.url || 
                snippet.thumbnails?.medium?.url || 
                snippet.thumbnails?.default?.url || '',
      views: new Intl.NumberFormat('en-US', { 
        notation: 'compact',
        maximumFractionDigits: 1 
      }).format(Number(statistics.viewCount) || 0),
      likes: new Intl.NumberFormat('en-US', { 
        notation: 'compact',
        maximumFractionDigits: 1 
      }).format(Number(statistics.likeCount) || 0),
      title: snippet.title || 'Untitled Video',
      channelTitle: snippet.channelTitle || 'Unknown Channel',
      publishedAt: new Date(snippet.publishedAt || Date.now()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    // Re-throw the error to be handled by the caller
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch video metadata');
  }
}

export async function POST(req: NextRequest): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    // Parse and validate request body
    const body = await req.json().catch(() => ({}));
    const result = RequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({
        error: `Invalid request: ${result.error.errors[0].message}`
      }, { status: 400 });
    }

    // Extract and validate video ID
    const videoId = extractVideoId(result.data.videoUrl);
    if (!videoId) {
      return NextResponse.json({
        error: 'Could not extract valid video ID from URL.'
      }, { status: 400 });
    }

    // Fetch metadata and transcript with better error handling
    let transcript: string | null = null;
    let metadata: YouTubeMetadata | null = null;

    try {
      [transcript, metadata] = await Promise.all([
        Promise.race([
          fetchYouTubeTranscript(videoId),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Transcript fetch timeout')), 15000)
          )
        ]),
        fetchYouTubeMetadata(videoId)
      ]);
    } catch (error) {
      console.error('Fetch error:', error);
      return NextResponse.json({
        error: error instanceof Error 
          ? error.message 
          : 'Failed to fetch video data'
      }, { status: 500 });
    }

    if (!metadata) {
      return NextResponse.json({
        error: 'Failed to fetch video metadata'
      }, { status: 500 });
    }

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json({
        error: 'Empty transcript received'
      }, { status: 500 });
    }

    // Generate blog post with Gemini
    let blogPost: string;
    try {
      blogPost = await summarizeWithGemini(transcript);
      
      if (!blogPost || blogPost.trim().length === 0) {
        throw new Error('Empty blog post generated');
      }
    } catch (error) {
      console.error('Blog post generation error:', error);
      return NextResponse.json({
        error: error instanceof Error
          ? `Failed to generate blog post: ${error.message}`
          : 'Failed to generate blog post'
      }, { status: 500 });
    }

    // Return successful response with both blog post and metadata
    return NextResponse.json({
      blogPost,
      metadata
    }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      error: 'Failed to process request'
    }, { status: 500 });
  }
}

function extractVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    let videoId: string | null = null;

    // Handle different YouTube URL formats
    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    } else if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      videoId = urlObj.searchParams.get('v');
    }

    // Validate video ID format (11 characters)
    if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return videoId;
    }

    return null;
  } catch {
    return null;
  }
}


function isError(error: unknown): error is Error {
  return error instanceof Error;
}