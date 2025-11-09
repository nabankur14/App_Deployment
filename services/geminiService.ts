import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { Campaign } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCampaignContent = async (prompt: string): Promise<Campaign> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate an email marketing campaign based on this prompt: "${prompt}". Provide a compelling subject line and engaging body copy.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    subject: {
                        type: Type.STRING,
                        description: "A compelling, concise email subject line."
                    },
                    body: {
                        type: Type.STRING,
                        description: "Engaging and persuasive email body copy. Use Markdown for formatting (e.g., headings, bold text, lists)."
                    }
                },
                required: ["subject", "body"],
            },
        },
    });

    const jsonText = response.text.trim();
    const campaign = JSON.parse(jsonText);
    return campaign;
  } catch (error) {
    console.error("Error generating campaign content:", error);
    throw new Error("Failed to generate campaign content. Please check the console for details.");
  }
};


export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A visually appealing, high-quality marketing image for: ${prompt}. Clean, professional, and eye-catching.`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image. Please check the console for details.");
    }
};

export const startChat = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are a friendly and helpful AI assistant. Keep your responses concise and informative.',
        },
    });
};

export const sendMessage = async (chat: Chat, message: string): Promise<string> => {
    try {
        const response = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending message:", error);
        throw new Error("Failed to get a response from the chatbot.");
    }
};
