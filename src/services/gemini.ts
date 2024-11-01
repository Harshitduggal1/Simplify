import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

export async function summarizeWithGemini(transcript: string): Promise<string> {
  let attempt = 0;
  
  while (attempt < RETRY_ATTEMPTS) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
        Create a well-structured blog post from the following video transcript.
        Make it engaging, clear, and maintain the key points.
        Add appropriate headings and format it for easy reading.
        Transcript: ${transcript}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text) throw new Error('Empty response from Gemini');
      
      return text;

    } catch (error) {
      attempt++;
      console.error(`Gemini API attempt ${attempt} failed:`, error);
      
      if (attempt === RETRY_ATTEMPTS) {
        throw new Error('Failed to generate content after multiple attempts');
      }
      
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
    }
  }

  throw new Error('Failed to generate content');
} 