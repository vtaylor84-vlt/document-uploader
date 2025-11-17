import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './services/queueService'; // Initialize the queue processor on load

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}