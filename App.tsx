import React, { useEffect } from 'react';
import { useTheme } from './hooks/useTheme.ts';
import { Header } from './components/Header.tsx'; // ADDED Header import
import { Form } from './components/Form.tsx';
import { ToastContainer } from './components/Toast.tsx'; 
import './src/style.css'; 

export const App: React.FC = () => {
    const { currentTheme } = useTheme();

    // Effect to apply CSS variables based on the current theme
    useEffect(() => {
        document.documentElement.style.setProperty('--color-primary', currentTheme.palette.primary);
        document.documentElement.style.setProperty('--color-secondary', currentTheme.palette.secondary);
        document.documentElement.style.setProperty('--shadow-glow', currentTheme.palette.glow);
    }, [currentTheme]);

    return (
        <div className={`min-h-screen flex flex-col items-center p-4 relative font-inter transition-colors duration-500`}>
            
            {/* --- HEADER --- */}
            <Header />

            <main className="w-full max-w-4xl mt-8 mb-16 relative z-10">
                <Form />
            </main>

            <ToastContainer />
        </div>
    );
};

export default App;