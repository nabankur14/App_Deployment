import type { Chat } from '@google/genai';

export type Tab = 'campaign' | 'chat' | 'image';

export interface Campaign {
  subject: string;
  body: string;
}

export interface GeneratedCampaign extends Campaign {
  imageUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ChatBotState {
    chatSession: Chat | null;
    chatHistory: ChatMessage[];
    isLoading: boolean;
}
