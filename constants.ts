import { CompanyName, CompanyTheme } from './types';
import { GreenleafLogo } from './assets/GreenleafLogo';
import { BstLogo } from './assets/BstLogo';

export const COMPANY_OPTIONS: CompanyName[] = ['Greenleaf Xpress', 'BST Expedite'];

export const THEME_CONFIG: Record<CompanyName, CompanyTheme> = {
    default: {
        name: 'QLM Driver Upload',
        logo: () => null, // Placeholder for text display
        palette: {
            primary: '#06b6d4', // Cyan-500
            secondary: '#a855f7', // Purple-500
            glow: '0 0 10px #06b6d4, 0 0 20px #a855f7',
            shadow: '0 4px 6px -1px rgba(6, 182, 212, 0.5), 0 2px 4px -2px rgba(168, 85, 247, 0.5)',
        },
    },
    'Greenleaf Xpress': {
        name: 'Greenleaf Xpress',
        logo: GreenleafLogo,
        palette: {
            primary: '#10b981', // Emerald-500
            secondary: '#4ade80', // Green-400
            glow: '0 0 10px #10b981, 0 0 20px #4ade80',
            shadow: '0 4px 6px -1px rgba(16, 185, 129, 0.5), 0 2px 4px -2px rgba(74, 222, 128, 0.5)',
        },
    },
    'BST Expedite': {
        name: 'BST Expedite',
        logo: BstLogo,
        palette: {
            primary: '#3b82f6', // Blue-500
            secondary: '#818cf8', // Indigo-400
            glow: '0 0 10px #3b82f6, 0 0 20px #818cf8',
            shadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5), 0 2px 4px -2px rgba(129, 140, 248, 0.5)',
        },
    },
};

export const STATES_US = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];