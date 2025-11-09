import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { Icons } from './Icons';
import { LoadingSpinner } from './LoadingSpinner';

export const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) {
            setError('Please enter a prompt for the image.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setImageUrl(null);

        try {
            const url = await generateImage(prompt);
            setImageUrl(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-grow flex flex-col p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <form onSubmit={handleSubmit} className="w-full">
                <label htmlFor="image-prompt" className="block text-lg font-medium text-slate-300 mb-2">
                    Describe the image you want to create
                </label>
                <div className="flex gap-2">
                    <input
                        id="image-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A futuristic city skyline at sunset, cyberpunk style"
                        className="flex-grow bg-slate-900 border border-slate-600 rounded-md py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition disabled:opacity-50"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <LoadingSpinner size="sm" /> : <Icons.Image />}
                        <span>Generate</span>
                    </button>
                </div>
            </form>

            {error && <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-md">{error}</div>}
            
            <div className="flex-grow flex items-center justify-center mt-6">
                {isLoading ? (
                    <div className="text-center">
                        <LoadingSpinner />
                        <p className="mt-4 text-slate-400">Conjuring your masterpiece...</p>
                    </div>
                ) : imageUrl ? (
                     <div className="w-full max-w-2xl">
                         <img src={imageUrl} alt={prompt} className="rounded-lg shadow-lg border-2 border-slate-700 w-full aspect-video object-contain"/>
                         <a 
                            href={imageUrl} 
                            download={`gemini-generated-image.jpg`}
                            className="mt-4 inline-flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 w-full justify-center"
                        >
                            <Icons.Download />
                            Download Image
                        </a>
                     </div>
                ) : (
                    <div className="text-center text-slate-500">
                        <Icons.Image className="mx-auto h-16 w-16" />
                        <p className="mt-2">Your generated image will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
