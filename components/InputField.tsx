import React, { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    value: string;
    theme?: {
        primary: string;
        secondary: string;
        text: string;
    };
}

// Custom Input Field with Cyberpunk aesthetic
export const InputField: React.FC<InputFieldProps> = ({ label, id, value, theme, ...props }) => {
    // Fallback theme colors (optional, but good for robustness)
    const primaryColor = theme?.primary || 'cyan';
    const secondaryColor = theme?.secondary || 'purple';
    const textColor = theme?.text || 'text-white';

    return (
        <div className="flex flex-col space-y-1">
            <label htmlFor={id} className={`text-sm font-inter font-semibold ${textColor}`}>
                {label}
            </label>
            <div className={`relative group transition-all duration-300 ease-in-out focus-within:ring-1 focus-within:ring-transparent`}>
                {/* Glowing border effect using pseudo-element */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300`}></div>
                
                <input
                    id={id}
                    value={value}
                    {...props}
                    className={`relative block w-full bg-black/80 border border-gray-700 rounded-lg shadow-sm py-3 px-4
                                text-white placeholder-gray-500 font-inter text-base
                                focus:outline-none focus:ring-0 focus:border-transparent
                                transition-all duration-300 ease-in-out
                                border-b-2 border-b-transparent focus:border-b-4 focus:border-b-white/80
                                `}
                    style={{
                        // Apply dynamic gradient based on theme variables for the glow
                        '--tw-gradient-from': `var(--color-primary)`,
                        '--tw-gradient-to': `var(--color-secondary)`,
                    } as React.CSSProperties}
                />
            </div>
        </div>
    );
};