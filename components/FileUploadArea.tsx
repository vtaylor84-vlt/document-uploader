import React, { useRef, useState, useCallback } from 'react';
import { SelectedFile, FileType, BolCategory } from '../types.ts';
import { FilePreview } from './FilePreview.tsx'; // Assuming FilePreview exists and is correctly structured
import { useToast } from './Toast.tsx'; // Assuming useToast exists and is correctly structured

interface FileUploadAreaProps {
    files: SelectedFile[];
    setFiles: (files: SelectedFile[]) => void;
    fileType: FileType;
    maxFiles?: number;
}

const fileToSelectedFile = (file: File, fileType: FileType, category?: BolCategory): SelectedFile => {
    return {
        id: crypto.randomUUID(), // For internal tracking and keying
        file: file,
        type: fileType,
        category: category,
        previewUrl: file.type.startsWith('image/') || file.type.startsWith('video/') 
            ? URL.createObjectURL(file) 
            : '',
    };
};

const areFilesEqual = (file1: File, file2: File): boolean => {
    // Duplicate file detection based on name, size, and last modified date
    return file1.name === file2.name && 
           file1.size === file2.size && 
           file1.lastModified === file2.lastModified;
};

// Simple reorder utility
function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({ files, setFiles, fileType, maxFiles = 100 }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const [bolCategory, setBolCategory] = useState<BolCategory>('Pick Up');
    const showToast = useToast();

    // Drag-to-reorder state
    const [draggedItem, setDraggedItem] = useState<SelectedFile | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const handleFiles = useCallback((newFiles: FileList | null) => {
        if (!newFiles) return;

        const filesArray = Array.from(newFiles);
        const newSelectedFiles: SelectedFile[] = [];

        filesArray.forEach(file => {
            // 1. Duplicate Detection
            const isDuplicate = files.some(existingFile => areFilesEqual(existingFile.file, file));
            if (isDuplicate) {
                showToast(`Warning: File '${file.name}' is already attached.`, 'warning');
                return;
            }

            // 2. Add File
            if (newSelectedFiles.length + files.length < maxFiles) {
                newSelectedFiles.push(fileToSelectedFile(file, fileType, fileType === 'BOL' ? bolCategory : undefined));
            }
        });

        if (newSelectedFiles.length > 0) {
            setFiles([...files, ...newSelectedFiles]);
        }
    }, [files, setFiles, fileType, bolCategory, maxFiles, showToast]);

    const handleManualClick = () => {
        fileInputRef.current?.click();
    };

    const handleCameraClick = () => {
        cameraInputRef.current?.click();
    };

    const handleRemove = (id: string) => {
        setFiles(files.filter(f => f.id !== id));
    };

    // --- Drag-to-Reorder Handlers (Minimal Implementation) ---
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, file: SelectedFile) => {
        setDraggedItem(file);
        e.currentTarget.style.opacity = '0.4';
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', file.id);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
        e.preventDefault();
        if (!draggedItem) return;

        const dragIndex = files.findIndex(f => f.id === draggedItem.id);
        if (dragIndex === -1) return;

        const newFiles = reorder(files, dragIndex, dropIndex);
        setFiles(newFiles);
        setDraggedItem(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.style.opacity = '1';
        setDraggedItem(null);
        setDragOverIndex(null);
    };
    // -----------------------------------------------------------------

    const acceptedFileTypes = fileType === 'BOL' 
        ? 'image/*,application/pdf' 
        : 'image/*,video/*';

    return (
        <div className="p-4 border-2 border-slate-700 rounded-lg bg-slate-800 shadow-xl space-y-4">
            <h3 className="text-xl font-orbitron text-[--color-primary] border-b border-slate-700 pb-2">
                {fileType === 'BOL' ? 'BOL / POD Uploads' : 'Freight / Video Uploads'}
            </h3>

            {/* BOL Category Selector */}
            {fileType === 'BOL' && (
                <div className="flex space-x-4">
                    <label className="text-sm font-inter text-[--color-secondary] font-semibold">BOL Type:</label>
                    <div className="flex space-x-4">
                        {['Pick Up', 'Delivery'].map(cat => (
                            <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="bolCategory"
                                    value={cat}
                                    checked={bolCategory === cat}
                                    onChange={() => setBolCategory(cat as BolCategory)}
                                    className="h-4 w-4 text-[--color-primary] bg-slate-800 border-slate-500 focus:ring-[--color-primary] accent-[--color-primary]"
                                />
                                <span className="text-white text-sm">{cat}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Buttons */}
            <div className="flex space-x-3">
                <button
                    type="button"
                    onClick={handleManualClick}
                    className="flex-1 py-2 px-4 rounded-lg bg-slate-600 text-white font-bold hover:bg-slate-500 transition-colors shadow-md border-2 border-slate-600 hover:border-[--color-primary]"
                >
                    📁 Select Files
                </button>
                <button
                    type="button"
                    onClick={handleCameraClick}
                    className="flex-1 py-2 px-4 rounded-lg bg-slate-600 text-white font-bold hover:bg-slate-500 transition-colors shadow-md border-2 border-slate-600 hover:border-[--color-secondary]"
                >
                    📸 Use Camera
                </button>
            </div>

            {/* Hidden File Inputs */}
            <input
                type="file"
                ref={fileInputRef}
                multiple
                accept={acceptedFileTypes}
                onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
                className="hidden"
            />
            <input
                type="file"
                ref={cameraInputRef}
                multiple
                accept={acceptedFileTypes}
                capture="environment" // Prioritize rear camera for logistics
                onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
                className="hidden"
            />

            {/* File Previews (Drag-to-Reorder Grid) */}
            {files.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
                    {files.map((file, index) => (
                        <div
                            key={file.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, file)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`
                                relative aspect-square transition-all duration-150 rounded-lg
                                ${dragOverIndex === index && draggedItem?.id !== file.id ? 'border-4 border-dashed border-[--color-primary] scale-[1.03]' : ''}
                            `}
                        >
                            <FilePreview
                                file={file}
                                onRemove={handleRemove}
                                index={index}
                                dragHandleProps={{}} // Drag handlers are on the container div
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};