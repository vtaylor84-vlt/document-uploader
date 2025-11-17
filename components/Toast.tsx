import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'warning';

interface ToastMessage {
    id: number;
    message: string;
    type: ToastType;
}

const getColors = (type: ToastType) => {
    switch (type) {
        case 'success': return { bg: 'bg-green-600', border: 'border-green-400', icon: '✅' };
        case 'error': return { bg: 'bg-red-600', border: 'border-red-400', icon: '🚨' };
        case 'warning': return { bg: 'bg-amber-500', border: 'border-amber-300', icon: '⚠️' };
        default: return { bg: 'bg-gray-600', border: 'border-gray-400', icon: '💬' };
    }
};

const ToastComponent: React.FC<{ message: ToastMessage }> = ({ message }) => {
    const { bg, border, icon } = getColors(message.type);

    return (
        <div 
            className={`fixed bottom-4 right-4 z-50 p-4 border-2 rounded-lg shadow-2xl transition-all duration-300 ease-out transform translate-y-0 opacity-100 ${bg} ${border}`}
            style={{ 
                minWidth: '250px',
                animation: 'slideIn 0.3s ease-out forwards',
            }}
        >
            <div className="flex items-center space-x-3">
                <span className="text-2xl">{icon}</span>
                <p className="font-inter text-white font-medium">{message.message}</p>
            </div>
        </div>
    );
};

// Global toast manager hook
type ToastHook = (message: string, type: ToastType, duration?: number) => void;

const globalToasts: ToastMessage[] = [];
let updateCallback: (() => void) | null = null;
let nextId = 0;

export const useToast: () => ToastHook = () => {
    const showToast = useCallback((message: string, type: ToastType, duration: number = 3000) => {
        const id = nextId++;
        const newToast: ToastMessage = { id, message, type };
        globalToasts.push(newToast);
        if (updateCallback) updateCallback();

        setTimeout(() => {
            const index = globalToasts.findIndex(t => t.id === id);
            if (index > -1) {
                globalToasts.splice(index, 1);
                if (updateCallback) updateCallback();
            }
        }, duration);
    }, []);

    return showToast;
};


export const ToastContainer: React.FC = () => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    useEffect(() => {
        updateCallback = () => setToasts([...globalToasts]);
        return () => { updateCallback = null; };
    }, []);

    if (toasts.length === 0) return null;

    return createPortal(
        <div className="fixed bottom-0 right-0 p-4 space-y-2 z-[9999]">
            {toasts.map((toast, index) => (
                <div key={toast.id} className="transition-transform duration-300 transform" style={{ bottom: `${index * 80 + 16}px` }}>
                     <ToastComponent message={toast} />
                </div>
            ))}
        </div>,
        document.body
    );
};