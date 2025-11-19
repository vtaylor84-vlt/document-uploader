import React from 'react';
import { useTheme } from '../hooks/useTheme.ts';

export const Header: React.FC = () => {
    const { currentTheme } = useTheme();

    // Use the DynamicLogo component provided by the theme hook
    const DynamicLogoComponent = currentTheme.logo;
    const glowingTextClass = currentTheme.name === 'Greenleaf Xpress' ? 'glowing-text-green' : 
                             currentTheme.name === 'BST Expedite' ? 'glowing-text-sky' : 
                             'glowing-text-cyan';

    return (
        <header className="text-center mb-8 relative z-10">
            {currentTheme.name === 'QLM Driver Upload' ? (
                // Default Header Text (When no company is selected)
                <h1 
                    className={`font-orbitron text-4xl md:text-5xl font-bold text-white ${glowingTextClass}`}
                >
                    QLM Driver Upload
                </h1>
            ) : (
                // Dynamic Logo Component (Greenleaf or BST)
                <div className="mt-4">
                    <DynamicLogoComponent />
                </div>
            )}
        </header>
    );
};