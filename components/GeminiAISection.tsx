import React from 'react';
import type { Status } from '../types';
import { SparkleIcon } from './icons/SparkleIcon';

interface GeminiAISectionProps {
    onGenerate: () => void;
    description: string;
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    status: Status;
}

export const GeminiAISection: React.FC<GeminiAISectionProps> = ({ onGenerate, description, handleInputChange, status }) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                 <h3 className="font-orbitron font-bold text-lg">AI Cargo Analysis</h3>
                <button
                    type="button"
                    onClick={onGenerate}
                    disabled={status === 'loading'}
                    className="flex items-center space-x-2 px-3 py-1 text-sm font-semibold text-black bg-yellow-400 hover:bg-yellow-300 rounded-sm transition-all disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-wait"
                >
                    <SparkleIcon className="w-4 h-4" />
                    <span>{status === 'loading' ? 'Analyzing...' : 'Generate AI Description (Gemini)'}</span>
                </button>
            </div>
            <div className="terminal-input-container">
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={description}
                    onChange={handleInputChange}
                    placeholder={status === 'loading' ? 'AI is generating content...' : 'AI-generated or manual cargo description for BOL...'}
                    className="terminal-input"
                />
            </div>
        </div>
    );
};