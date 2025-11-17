import React from 'react';
import { useTheme } from './hooks/useTheme.ts'; // Corrected
import { Form } from './components/Form.tsx'; // Corrected
import { ToastContainer } from './components/Toast.tsx'; // Corrected

const App: React.FC = () => {
    const { currentTheme, DynamicLogo, themeVars } = useTheme();

    return (
        // Apply dynamic CSS variables and base styling to the main container
        <div className="min-h-screen pb-12" style={{ cssText: themeVars }}>
            {/* --- DYNAMIC HEADER/LOGO --- */}
            <div className="bg-slate-900 shadow-2xl border-b-4 border-b-[--color-primary] sticky top-0 z-10">
                <div className="max-w-4xl mx-auto">
                    {currentTheme.name === 'QLM Driver Upload' ? (
                        <header className="text-center py-6">
                            <h1 className="text-4xl font-orbitron font-bold text-white tracking-widest"
                                style={{ textShadow: `0 0 15px var(--color-primary)` }}>
                                {currentTheme.name}
                            </h1>
                        </header>
                    ) : (
                        <DynamicLogo />
                    )}
                </div>
            </div>

            {/* --- MAIN FORM --- */}
            <main className="max-w-4xl mx-auto p-4">
                <Form />
            </main>

            {/* --- GLOBAL TOAST SYSTEM --- */}
            <ToastContainer />
        </div>
    );
};

export default App;