
import { GoogleGenAI, Type } from "@google/genai";
import type { ProcessedTextResult } from '../types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const fileToGenerativePart = async (file: File) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5 MB limit.');
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

export const extractTextAndProcess = async (file: File): Promise<ProcessedTextResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Step 1: Extract text from the image
  const imagePart = await fileToGenerativePart(file);
  const ocrResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        imagePart,
        { text: 'Extract all text from this image. If no text is found, respond with "No text found.".' }
      ],
    },
  });

  const extractedText = ocrResponse.text.trim();
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
  
  const response = await ai.models.generateContent({
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

  let parsedResponse;
  try {
     parsedResponse = JSON.parse(response.text);
  } catch (e) {
      console.error("Failed to parse Gemini JSON response:", response.text);
      throw new Error("AI failed to generate a valid response. Please try again.");
  }


  return {
    extracted_text: extractedText,
    ...parsedResponse,
  };
};
