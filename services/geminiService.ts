import { GoogleGenAI, Modality } from "@google/genai";
import type { UploadedFile } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateImageFromAngle(
  uploadedFile: UploadedFile,
  prompt: string,
  customDescription: string,
  stylePrompt: string
): Promise<string> {
  try {
    const fullPrompt = `${prompt} ${customDescription} ${stylePrompt}`.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: uploadedFile.base64,
              mimeType: uploadedFile.mimeType,
            },
          },
          {
            text: fullPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const candidate = response?.candidates?.[0];

    // Added safe navigation and checks to prevent crash on unexpected API response.
    if (!candidate || !candidate.content || !candidate.content.parts) {
      if (response?.promptFeedback?.blockReason) {
        throw new Error(`Generation failed due to safety policies (${response.promptFeedback.blockReason}). Please try a different image or prompt.`);
      }
      throw new Error('Generation failed because the API returned an invalid or empty response.');
    }

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    // Check if the model returned only text, which might be an explanation for failure.
    const textResponse = candidate.content.parts.map(p => p.text).filter(Boolean).join(' ').trim();
    if (textResponse) {
        throw new Error(`API returned a text response instead of an image: "${textResponse}"`);
    }

    throw new Error('No image data was returned from the API.');
  } catch (error) {
    console.error('Error generating image:', error);

    let friendlyErrorMessage = 'An unknown error occurred while generating the image.';

    // Updated error handling: more robustly parse JSON from API error messages.
    if (error instanceof Error) {
      const message = error.message;
      // Attempt to find and parse a JSON object within the error message string.
      // The 's' flag allows '.' to match newline characters, making the regex more robust.
      const jsonMatch = message.match(/\{.*\}/s);

      if (jsonMatch && jsonMatch[0]) {
        try {
          const parsedError = JSON.parse(jsonMatch[0]);
          if (parsedError?.error?.message) {
            friendlyErrorMessage = parsedError.error.message;
          } else {
            // JSON is valid but doesn't have the expected structure.
            friendlyErrorMessage = message;
          }
        } catch (jsonError) {
          // The matched substring wasn't valid JSON. Fallback to the original message.
          friendlyErrorMessage = message;
        }
      } else {
        // No JSON found in the message, use the original message.
        friendlyErrorMessage = message;
      }
    }
    
    throw new Error(friendlyErrorMessage);
  }
}