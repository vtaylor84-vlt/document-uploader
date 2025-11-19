import React, { useState } from 'react';
import { SelectedFile } from '../types.ts';
import { useToast } from './Toast.tsx';
import { generateDescription } from '../services/geminiService.ts';

interface GeminiAISectionProps {
    freightFiles: SelectedFile[];
    description: string;
    setDescription: (desc: string) => void;
}

export const GeminiAISection: React.FC<GeminiAISectionProps> = ({ freightFiles, description, setDescription }) => {
    const [isLoading, setIsLoading] = useState(false);
    const showToast = useToast();

    const handleGenerate = async () => {
        if (freightFiles.length === 0) {
            showToast("Please attach freight photos to generate a description.", 'warning');
            return;
        }
        
        // Filter out videos/PDFs, only send images to the visual model
        const imageFiles = freightFiles.filter(f => f.file.type.startsWith('image/'));
        if (imageFiles.length === 0) {
            showToast("No images found. Gemini requires images for visual analysis.", 'warning');
            return;
        }
        
        setIsLoading(true);
        try {
            const result = await generateDescription(imageFiles);
            setDescription(result);
            showToast("AI description successfully generated!", 'success');
        } catch (error) {
            console.error("Gemini AI Error:", error);
            showToast("AI generation failed. Check API key/connection.", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 border-2 border-slate-700 rounded-lg bg-slate-800 shadow-xl space-y-3">
            <h3 className="text-xl font-orbitron text-[--color-primary] border-b border-slate-700 pb-2">
                AI Cargo Analysis
            </h3>
            
            <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
                className={`
                    w-full py-3 px-4 rounded-lg text-white font-bold font-inter text-lg
                    transition-all duration-300 transform 
                    ${isLoading ? 'bg-gray-500 opacity-70 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg'}
                `}
                style={!isLoading ? { boxShadow: `0 0 10px rgba(168, 85, 247, 0.5)` } : {}}
            >
                {isLoading ? '🤖 Analyzing Cargo...' : '✨ Generate AI Description (Gemini)'}
            </button>
            
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="AI-generated or manual cargo description for BOL..."
                rows={4}
                className="
                    w-full p-3 border-2 rounded-lg 
                    bg-slate-900 text-white border-slate-700 
                    transition-all duration-200 focus:outline-none 
                    focus:border-[--color-secondary] focus:shadow-[0_0_10px_var(--color-secondary)] 
                    font-inter text-base resize-none
                "
            />
        </div>
    );
};