import React, { SelectHTMLAttributes } from 'react';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    id: string;
    options: string[];
    theme?: {
        primary: string;
        secondary: string;
        text: string;
    };
    srOnlyLabel?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, id, options, theme, srOnlyLabel, ...props }) => {
    const textColor = theme?.text || 'text-gray-200';

    return (
        <div className="flex flex-col space-y-1">
            <label htmlFor={id} className={`text-sm font-inter font-semibold ${textColor} ${srOnlyLabel ? 'sr-only' : 'block'}`}>
                {label}
            </label>
            <div className={`relative group transition-all duration-300 ease-in-out`}>
                {/* Glowing border effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-[--color-primary] to-[--color-secondary] rounded-lg blur opacity-0 group-focus-within:opacity-75 transition-opacity duration-300`}></div>
                
                <select
                    id={id}
                    {...props}
                    className={`relative block w-full bg-black/80 border border-gray-700 rounded-lg shadow-sm py-3 px-4
                                text-white appearance-none font-inter text-base cursor-pointer
                                focus:outline-none focus:ring-0 focus:border-transparent
                                transition-all duration-300 ease-in-out
                                border-b-2 border-b-transparent focus:border-b-4 focus:border-b-white/80
                            `}
                    style={{ backgroundColor: '#171717' }} // Enforced dark background color
                >
                    <option value="" disabled className="bg-gray-800 text-gray-500">Select an option</option>
                    {options.map(option => (
                        <option key={option} value={option} className="bg-gray-800 text-white">{option}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path></svg>
                </div>
            </div>
        </div>
    );
};