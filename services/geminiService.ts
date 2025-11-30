
import { GoogleGenAI, Type } from "@google/genai";
import type { ProcessedTextResult } from '../types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const fileToGenerativePart = async (file: File) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 10 MB limit.');
  }
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); // Should not happen with readAsDataURL
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const handleApiError = (error: any) => {
  console.error("Gemini API Error details:", error);
  const msg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  if (msg.includes('api key') || msg.includes('403') || msg.includes('permission denied')) {
    throw new Error("Access denied. Please check your API key configuration.");
  }
  if (msg.includes('429') || msg.includes('quota') || msg.includes('resource exhausted')) {
    throw new Error("Usage limit exceeded. Please try again later.");
  }
  if (msg.includes('503') || msg.includes('overloaded') || msg.includes('service unavailable')) {
    throw new Error("AI service is currently overloaded. Please wait a moment and try again.");
  }
  if (msg.includes('safety') || msg.includes('blocked') || msg.includes('harmful')) {
    throw new Error("The image content was blocked by safety filters.");
  }
  if (msg.includes('fetch failed') || msg.includes('network')) {
    throw new Error("Network error. Please check your internet connection.");
  }
  
  // Fallback for other errors
  throw new Error(error instanceof Error ? error.message : "An unexpected error occurred during processing.");
};

export const extractTextAndProcess = async (file: File): Promise<ProcessedTextResult> => {
  // Check if API_KEY is available. Safe check for 'process' to avoid reference errors in some environments.
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;

  if (!apiKey) {
    throw new Error(
      "API_KEY is missing. If running locally, please create a .env file with 'API_KEY=your_key' and ensure your bundler (like Vite or Webpack) is configured to expose it."
    );
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Step 1: Extract text from the image
  let ocrResponse;
  try {
    const imagePart = await fileToGenerativePart(file);
    ocrResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          imagePart,
          { text: 'Extract all text from this image. If no text is found, respond with "No text found.".' }
        ],
      },
    });
  } catch (error) {
    handleApiError(error);
    throw error; // handleApiError throws, but typescript needs this for control flow if return type was different
  }

  const extractedText = ocrResponse?.text?.trim();
  
  if (!extractedText || extractedText.toLowerCase() === 'no text found.') {
    return {
      extracted_text: "No text could be extracted from the image.",
      cleaned_text: "",
      summary: "",
      translations: { English: "", Hindi: "", Malayalam: "", Tamil: "", Telugu: "" },
    };
  }

  // Step 2: Clean, summarize, and translate the extracted text in a single call
  const processingPrompt = `
    Given the following text, perform three tasks and return the output in a valid JSON format.
    1. Rewrite it in clean, grammatically correct professional English.
    2. Summarize the cleaned text in 3-5 bullet points.
    3. Translate the cleaned text into Hindi, Tamil, Malayalam, and Telugu. Also include the English version.
    
    Text: "${extractedText}"
  `;
  
  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: processingPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cleaned_text: {
              type: Type.STRING,
              description: "The grammatically corrected version of the text."
            },
            summary: {
              type: Type.STRING,
              description: "A summary of the text in 3-5 bullet points."
            },
            translations: {
              type: Type.OBJECT,
              properties: {
                English: { type: Type.STRING, description: "Translation in English." },
                Hindi: { type: Type.STRING, description: "Translation in Hindi." },
                Tamil: { type: Type.STRING, description: "Translation in Tamil." },
                Malayalam: { type: Type.STRING, description: "Translation in Malayalam." },
                Telugu: { type: Type.STRING, description: "Translation in Telugu." },
              },
              required: ["English", "Hindi", "Tamil", "Malayalam", "Telugu"]
            },
          },
          required: ["cleaned_text", "summary", "translations"],
        },
      },
    });
  } catch (error) {
    handleApiError(error);
    throw error;
  }

  let parsedResponse;
  try {
     parsedResponse = JSON.parse(response.text || '{}');
  } catch (e) {
      console.error("Failed to parse Gemini JSON response:", response?.text);
      throw new Error("The AI response was not in the expected format. Please try again.");
  }


  return {
    extracted_text: extractedText,
    ...parsedResponse,
  };
};
