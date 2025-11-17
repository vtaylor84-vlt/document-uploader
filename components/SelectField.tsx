import React, { SelectHTMLAttributes } from 'react';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    id: string;
    options: string[];
}

// Custom Select Field with Cyberpunk aesthetic
export const SelectField: React.FC<SelectFieldProps> = ({ label, id, options, ...props }) => {
    return (
        <div className="flex flex-col space-y-1">
            <label htmlFor={id} className="text-sm font-inter text-[--color-secondary] font-semibold">
                {label}
            </label>
            <select
                id={id}
                {...props}
                className="
                    p-3 border-2 rounded-lg appearance-none 
                    bg-slate-800 text-white border-slate-700 
                    transition-all duration-200 focus:outline-none 
                    focus:border-[--color-primary] focus:shadow-[0_0_10px_var(--color-primary)]
                    font-inter text-base cursor-pointer
                "
            >
                <option value="" disabled>Select an option</option>
                {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};