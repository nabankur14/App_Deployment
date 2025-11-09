import React, { useState } from 'react';
import { generateCampaignContent, generateImage } from '../services/geminiService';
import type { GeneratedCampaign } from '../types';
import { Icons } from './Icons';
import { LoadingSpinner } from './LoadingSpinner';

export const CampaignGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [campaign, setCampaign] = useState<GeneratedCampaign | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) {
            setError('Please enter a prompt for your campaign.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setCampaign(null);

        try {
            const [campaignContent, imageUrl] = await Promise.all([
                generateCampaignContent(prompt),
                generateImage(prompt)
            ]);
            
            setCampaign({ ...campaignContent, imageUrl });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-grow flex flex-col p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <form onSubmit={handleSubmit} className="w-full">
                <label htmlFor="campaign-prompt" className="block text-lg font-medium text-slate-300 mb-2">
                    Describe your campaign goal
                </label>
                <div className="relative">
                    <textarea
                        id="campaign-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A launch campaign for a new line of eco-friendly sneakers..."
                        className="w-full h-28 p-3 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none transition resize-none disabled:opacity-50"
                        disabled={isLoading}
                    />
                     <button
                        type="submit"
                        disabled={isLoading}
                        className="absolute bottom-3 right-3 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <LoadingSpinner size="sm" /> : <Icons.Wand />}
                        <span>Generate</span>
                    </button>
                </div>
            </form>

            {error && <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-md">{error}</div>}
            
            {isLoading && (
                 <div className="flex-grow flex flex-col items-center justify-center text-center mt-6">
                    <LoadingSpinner />
                    <p className="mt-4 text-slate-400">Generating your campaign...</p>
                    <p className="text-sm text-slate-500">This may take a moment.</p>
                </div>
            )}

            {campaign && (
                <div className="mt-6 flex-grow overflow-y-auto space-y-6 pr-2">
                    <h2 className="text-2xl font-bold text-purple-400">Your Generated Campaign</h2>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-300">Subject:</h3>
                        <p className="mt-1 text-slate-100">{campaign.subject}</p>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                         <h3 className="text-lg font-semibold text-slate-300 mb-2">Visual:</h3>
                         <img src={campaign.imageUrl} alt="Generated campaign visual" className="rounded-md w-full max-w-lg mx-auto aspect-video object-cover border border-slate-600"/>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-300">Body:</h3>
                        <div className="prose prose-invert mt-2 text-slate-300" dangerouslySetInnerHTML={{ __html: campaign.body.replace(/\n/g, '<br />') }} />
                    </div>
                </div>
            )}
        </div>
    );
};
