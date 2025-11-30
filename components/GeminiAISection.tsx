// components/GeminiAISection.tsx
import React, { useState } from 'react';
import { FileData, Theme } from '../types.ts';
import { generateCargoDescription } from '../services/geminiService.ts';
import { useToasts } from '../hooks/useToasts.ts';
import { FormField } from './FormField.tsx'; // Assuming this is now InputField.tsx/SelectField.tsx

interface GeminiAISectionProps {
  freightFiles: FileData[];
  description: string;
  setDescription: (desc: string) => void;
  theme: Theme;
}

export const GeminiAISection: React.FC<GeminiAISectionProps> = ({
  freightFiles,
  description,
  setDescription,
  theme,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToasts();

  const handleGenerateDescription = async () => {
    if (freightFiles.length === 0) {
      addToast('warning', 'Please attach freight photos/videos first.');
      return;
    }

    setIsLoading(true);
    setDescription('Generating AI description...');
    try {
      const result = await generateCargoDescription(freightFiles);
      setDescription(result);
      addToast('success', 'AI description generated successfully.');
    } catch (error) {
      console.error('Gemini AI Error:', error);
      setDescription(`AI generation failed: ${(error as Error).message}`);
      addToast('error', 'Failed to generate AI description.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Custom Tailwind style for the button glow
  const focusStyle = {
    boxShadow: `0 0 0 2px ${theme.glowColor}, 0 0 10px ${theme.glowColor}`,
  };

  return (
    <div className="mb-6 p-4 rounded-xl bg-gray-900 border-2 border-gray-700">
      <h3 className={`text-xl font-orbitron mb-3 ${theme.primaryColor}`}>AI Cargo Analysis</h3>
      
      <button
        type="button"
        onClick={handleGenerateDescription}
        disabled={isLoading}
        className={`w-full p-3 rounded-lg text-white font-bold transition duration-300 border-2 border-gray-700 ${theme.accentColor} mb-4 ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
        style={isLoading ? {} : { boxShadow: `0 0 8px ${theme.glowColor}` }}
        onFocus={(e) => {
            if (!isLoading) e.currentTarget.style.boxShadow = focusStyle.boxShadow;
        }}
        onBlur={(e) => {
            if (!isLoading) e.currentTarget.style.boxShadow = `0 0 8px ${theme.glowColor}`;
        }}
      >
        {isLoading ? '🧠 Analyzing Cargo...' : '✨ Generate Description (Gemini AI)'}
      </button>

      {/* Note: This component assumes a FormField that supports a textarea type */}
      <textarea
        id="description"
        name="description"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={isLoading ? 'AI is generating content...' : 'AI-generated or manual cargo description for BOL...'}
        className={`w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white transition duration-300`}
        style={{
            boxShadow: isLoading ? `0 0 0 2px ${theme.glowColor}` : 'none',
            minHeight: '100px'
        }}
        disabled={isLoading}
      />
    </div>
  );
};