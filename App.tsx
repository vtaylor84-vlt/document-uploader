import React, { useEffect } from 'react';
import { useTheme } from './hooks/useTheme.ts';
import { Header } from './components/Header.tsx';
import { Form } from './components/Form.tsx';
import { ToastContainer } from './components/Toast.tsx';
import './src/style.css'; // Ensure global styles are loaded

const App: React.FC = () => {
    const { currentTheme } = useTheme();

    // CRITICAL: This injects the dynamic colors into CSS variables for Tailwind to use
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', currentTheme.palette.primary);
        root.style.setProperty('--color-secondary', currentTheme.palette.secondary);
        root.style.setProperty('--shadow-glow', currentTheme.palette.glow);
    }, [currentTheme]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 selection:bg-cyan-400 selection:text-black relative z-10">
            
            {/* --- HEADER --- */}
            <Header />

            {/* --- MAIN FORM CONTAINER --- */}
            <main className="w-full max-w-2xl mx-auto mt-8 mb-16 relative z-10">
                <Form />
            </main>

            {/* --- GLOBAL TOAST SYSTEM --- */}
            <ToastContainer />
        </div>
    );
};

export default App;