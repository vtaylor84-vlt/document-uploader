import React, { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    value: string;
}

// Custom Input Field with Cyberpunk aesthetic
export const InputField: React.FC<InputFieldProps> = ({ label, id, value, ...props }) => {
    return (
        <div className="flex flex-col space-y-1">
            <label htmlFor={id} className="text-sm font-inter text-[--color-secondary] font-semibold">
                {label}
            </label>
            <input
                id={id}
                value={value}
                {...props}
                className="
                    p-3 border-2 rounded-lg 
                    bg-slate-800 text-white border-slate-700 
                    transition-all duration-200 focus:outline-none 
                    focus:border-[--color-primary] focus:shadow-[0_0_10px_var(--color-primary)] 
                    font-inter text-base
                    "
            />
        </div>
    );
};