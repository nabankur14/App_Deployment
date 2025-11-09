import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { startChat, sendMessage } from '../services/geminiService';
import type { ChatMessage, ChatBotState } from '../types';
import { Icons } from './Icons';
import { LoadingSpinner } from './LoadingSpinner';

export const ChatBot: React.FC = () => {
    const [state, setState] = useState<ChatBotState>({
        chatSession: null,
        chatHistory: [],
        isLoading: false,
    });
    const [currentMessage, setCurrentMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initializeChat = () => {
            try {
                const session = startChat();
                setState(prevState => ({ ...prevState, chatSession: session }));
            } catch (err) {
                 setError(err instanceof Error ? err.message : 'Failed to initialize chat session.');
            }
        };
        initializeChat();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [state.chatHistory]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentMessage.trim() || !state.chatSession || state.isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: currentMessage };
        setState(prevState => ({
            ...prevState,
            isLoading: true,
            chatHistory: [...prevState.chatHistory, userMessage],
        }));
        setCurrentMessage('');
        setError(null);

        try {
            const responseText = await sendMessage(state.chatSession, currentMessage);
            const modelMessage: ChatMessage = { role: 'model', text: responseText };
            setState(prevState => ({
                ...prevState,
                chatHistory: [...prevState.chatHistory, modelMessage],
            }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            // Revert user message on error
            setState(prevState => ({
                ...prevState,
                chatHistory: prevState.chatHistory.slice(0, -1),
            }));
        } finally {
            setState(prevState => ({ ...prevState, isLoading: false }));
        }
    };

    return (
        <div className="flex-grow flex flex-col bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {state.chatHistory.map((msg, index) => (
                    <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                             <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                                <Icons.Gemini />
                            </div>
                        )}
                        <div className={`max-w-xs md:max-w-md lg:max-w-xl p-3 rounded-2xl ${
                            msg.role === 'user' 
                                ? 'bg-blue-600 text-white rounded-br-lg' 
                                : 'bg-slate-700 text-slate-200 rounded-bl-lg'
                        }`}>
                           <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {state.isLoading && (
                    <div className="flex justify-start gap-3">
                         <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                            <Icons.Gemini />
                        </div>
                        <div className="bg-slate-700 text-slate-200 rounded-2xl rounded-bl-lg p-3 flex items-center">
                           <LoadingSpinner size="sm" />
                        </div>
                    </div>
                )}
                 <div ref={messagesEndRef} />
            </div>
             {error && <div className="m-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-md text-sm">{error}</div>}
            <div className="p-4 border-t border-slate-700">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Ask Gemini anything..."
                        className="flex-grow bg-slate-900 border border-slate-600 rounded-full py-2 px-4 focus:ring-2 focus:ring-purple-500 focus:outline-none transition disabled:opacity-50"
                        disabled={state.isLoading || !state.chatSession}
                    />
                    <button
                        type="submit"
                        disabled={state.isLoading || !currentMessage.trim()}
                        className="bg-purple-600 text-white rounded-full p-2.5 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition disabled:bg-slate-500 disabled:cursor-not-allowed"
                    >
                        <Icons.Send />
                    </button>
                </form>
            </div>
        </div>
    );
};
