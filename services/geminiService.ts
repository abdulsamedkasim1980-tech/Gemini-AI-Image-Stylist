import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const editImageWithPrompt = async (
  images: { base64Data: string; mimeType: string }[],
  prompt: string
): Promise<string> => {
  try {
    const imageParts = images.map(image => ({
      inlineData: {
        data: image.base64Data,
        mimeType: image.mimeType,
      },
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          ...imageParts,
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const candidate = response.candidates?.[0];

    if (!candidate) {
        throw new Error('No candidates returned from the model.');
    }

    if (candidate.finishReason && candidate.finishReason !== 'STOP') {
        throw new Error(`Image generation stopped due to: ${candidate.finishReason}. The prompt may have been blocked.`);
    }

    for (const part of candidate.content?.parts ?? []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    const textResponse = response.text?.trim();
    if (textResponse) {
        throw new Error(`Model returned a text response instead of an image: "${textResponse}"`);
    }

    throw new Error('No image was generated. The model may have refused the request.');
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.startsWith('Gemini API Error:')) {
            throw error;
        }
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};
