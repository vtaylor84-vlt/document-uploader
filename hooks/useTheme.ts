import { useState, useMemo } from 'react';
import { CompanyName, CompanyTheme } from '../types';
import { THEME_CONFIG } from '../constants';

type UseThemeResult = {
    company: CompanyName;
    setCompany: (c: CompanyName) => void;
    currentTheme: CompanyTheme;
    DynamicLogo: React.FC;
    themeVars: string;
};

export const useTheme = (): UseThemeResult => {
    const [company, setCompany] = useState<CompanyName>('default');

    const currentTheme = useMemo(() => {
        return THEME_CONFIG[company] || THEME_CONFIG.default;
    }, [company]);

    const DynamicLogo = useMemo(() => {
        return currentTheme.logo;
    }, [currentTheme]);

    // Tailwind-compatible CSS variables for dynamic styling
    const themeVars = `
        --color-primary: ${currentTheme.palette.primary};
        --color-secondary: ${currentTheme.palette.secondary};
        --shadow-glow: ${currentTheme.palette.glow};
        --shadow-submit: ${currentTheme.palette.shadow};
    `;

    return { company, setCompany, currentTheme, DynamicLogo, themeVars };
};