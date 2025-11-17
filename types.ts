import React from 'react';

// --- Theme Types ---
export type ThemePalette = {
    primary: string;
    secondary: string;
    glow: string;
    shadow: string;
};

export type CompanyTheme = {
    name: string;
    logo: React.FC;
    palette: ThemePalette;
};

// --- Form & Data Types ---
export type CompanyName = 'default' | 'Greenleaf Xpress' | 'BST Expedite';

export type LoadSubmission = {
    company: CompanyName;
    driverName: string;
    loadNumber: string;
    bolNumber: string;
    pickupCity: string;
    pickupState: string;
    deliveryCity: string;
    deliveryState: string;
    description: string;
    files: QueuedFile[];
    timestamp: number;
    submissionId: string;
};

export type FileType = 'BOL' | 'FREIGHT';
export type BolCategory = 'Pick Up' | 'Delivery';

export type SelectedFile = {
    id: string; // Unique ID for file preview/tracking
    file: File;
    type: FileType;
    category?: BolCategory; // Only relevant for BOL type
    previewUrl: string; // URL for thumbnail display
};

// IndexedDB Queue Item
export type QueuedSubmission = {
    id?: number; // IndexedDB key
    data: Omit<LoadSubmission, 'files'> & { fileIds: string[] }; // Metadata
    files: { id: string, content: Blob, fileName: string, fileType: string }[]; // File Blobs
    status: 'pending' | 'failed';
    attemptCount: number;
    timestamp: number;
};