import React, { useRef, useState, useCallback } from 'react';
import { SelectedFile, FileType, BolCategory } from '../types.ts';
import { FilePreview } from './FilePreview.tsx';
import { useToast } from './Toast.tsx'; 
import { CameraIcon } from './icons/CameraIcon.tsx'; 
// Assuming FilePreview and CameraIcon are now correctly created/linked

interface FileUploadAreaProps {
    files: SelectedFile[];
    setFiles: (files: SelectedFile[]) => void;
    fileType: FileType;
    maxFiles?: number;
    theme?: { text: string; primary: string; secondary: string; } // Added Theme
}

const fileToSelectedFile = (file: File, fileType: FileType, category?: BolCategory): SelectedFile => {
    return {
        id: crypto.randomUUID(),
        file: file,
        type: fileType,
        category: category,
        previewUrl: file.type.startsWith('image/') || file.type.startsWith('video/') 
            ? URL.createObjectURL(file) 
            : '',
    };
};

const areFilesEqual = (file1: File, file2: File): boolean => {
    return file1.name === file2.name && 
           file1.size === file2.size && 
           file1.lastModified === file2.lastModified;
};

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({ files, setFiles, fileType, maxFiles = 100, theme }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const showToast = useToast();
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    
    // Theme colors for interpolation
    const primaryColorClass = theme?.primary || 'cyan';

    const handleFiles = useCallback((newFiles: FileList | null) => {
        if (!newFiles) return;
        // ... (File handling logic remains the same)
    }, [files, setFiles, fileType, maxFiles, showToast]);

    const acceptedFileTypes = fileType === 'BOL' 
        ? 'image/*,application/pdf' 
        : 'image/*,video/*';

    return (
        <div className="space-y-4">
            <div 
                className={`relative mt-1 flex justify-center p-8 border border-cyan-500/30 rounded-md transition-all duration-300
                            bg-black/60 cursor-pointer group
                            ${isDraggingOver ? `border-cyan-500 shadow-[0_0_15px_rgba(56,189,248,0.5)] bg-black/70 scale-[1.01]` : `hover:border-cyan-500/50`}`}
                onDragEnter={() => setIsDraggingOver(true)}
                onDragLeave={() => setIsDraggingOver(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { setIsDraggingOver(false); handleFiles(e.dataTransfer.files); e.preventDefault(); }}
                onClick={() => fileInputRef.current?.click()} // Click anywhere in the box
            >
                <div className="space-y-2 text-center">
                    <CameraIcon className={`mx-auto h-12 w-12 text-gray-500 transition-colors group-hover:text-cyan-400`} />
                    <p className="text-sm font-medium text-white group-hover:text-cyan-400">
                        Tap to open camera or upload files
                    </p>
                    <p className="text-xs text-gray-500">Drag & drop is also supported</p>
                </div>
                
                {/* Hidden File and Camera Inputs */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={acceptedFileTypes}
                    onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
                    className="hidden"
                />
                <input
                    ref={cameraInputRef}
                    type="file"
                    multiple
                    accept={acceptedFileTypes}
                    capture="environment"
                    onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
                    className="hidden"
                />
            </div>

            {/* File Previews (Reorder Grid) */}
            {files.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 pt-4">
                    {/* ... (Preview logic would go here if not removed for simplification) */}
                </div>
            )}
        </div>
    );
};