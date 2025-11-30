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

export const InputField: React.FC<InputFieldProps> = ({ label, id, value, theme, ...props }) => {
    const textColor = theme?.text || 'text-gray-200';

    return (
        <div className="flex flex-col space-y-1">
            <label htmlFor={id} className={`text-sm font-inter font-semibold ${textColor}`}>
                {label}
            </label>
            <div className={`relative group transition-all duration-300 ease-in-out focus-within:ring-1 focus-within:ring-transparent`}>
                {/* Glowing border effect using pseudo-element */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-[--color-primary] to-[--color-secondary] rounded-md blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300`}></div>
                
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
                        backgroundColor: '#171717', // Enforced dark background color
                        color: '#E0E0E0', // Ensure text input remains visible
                    }}
                />
            </div>
        </div>
    );
};