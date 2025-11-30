import React, { useRef } from 'react';
import type { UploadedFile } from '../types.ts';
import { FileThumbnail } from './FileThumbnail.tsx';
import { CameraIcon } from './icons/CameraIcon'; // FINAL FIX: Removed .tsx extension
import { FolderIcon } from './icons/FolderIcon'; // FINAL FIX: Removed .tsx extension
// Note: Ensure all components used below (e.g., FileThumbnail) also have the explicit .tsx extension in their imports.

interface FileUploadAreaProps {
  id: 'bolFiles' | 'freightFiles';
  files: UploadedFile[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, fileType: 'bolFiles' | 'freightFiles') => void;
  onRemoveFile: (fileId: string, fileType: 'bolFiles' | 'freightFiles') => void;
  onFileReorder: (draggedId: string, targetId: string, fileType: 'bolFiles' | 'freightFiles') => void;
  accept: string;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  id,
  files,
  onFileChange,
  onRemoveFile,
  onFileReorder,
  accept,
}) => {
  const dragId = useRef<string | null>(null);
  
  const handleDragStart = (id: string) => {
    dragId.current = id;
  };

  const handleDrop = (targetId: string) => {
    if (dragId.current && dragId.current !== targetId) {
      onFileReorder(dragId.current, targetId, id);
    }
    dragId.current = null;
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => fileInputRef.current?.click();
  const triggerCameraInput = () => cameraInputRef.current?.click();

  return (
    <div className="space-y-4">
      {/* Buttons: Side-by-side file and camera inputs */}
      <div className="grid grid-cols-2 gap-px bg-gray-700 border border-gray-700">
        {/* Hidden File Input */}
        <input 
            ref={fileInputRef}
            id={`${id}-file`}
            name={`${id}-file`} 
            type="file" 
            className="sr-only" 
            multiple 
            accept={accept}
            onChange={(e) => onFileChange(e, id)} 
        />
        {/* Hidden Camera Input */}
        <input 
            ref={cameraInputRef}
            id={`${id}-camera`}
            name={`${id}-camera`}
            type="file" 
            className="sr-only" 
            multiple 
            accept="image/*"
            capture="environment"
            onChange={(e) => onFileChange(e, id)} 
        />

        <button type="button" onClick={triggerFileInput} className="bg-gray-200 text-black p-2 flex items-center justify-center space-x-2 hover:bg-white transition-colors">
            <FolderIcon className="w-5 h-5" />
            <span className="font-semibold">Select Files</span>
        </button>
        <button type="button" onClick={triggerCameraInput} className="bg-gray-200 text-black p-2 flex items-center justify-center space-x-2 hover:bg-white transition-colors">
            <CameraIcon className="w-5 h-5" />
            <span className="font-semibold">Use Camera</span>
        </button>

      </div>
      
      {/* File Thumbnails Display */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 pt-2">
          {files.map((file) => (
            <FileThumbnail
              key={file.id}
              fileWrapper={file}
              onRemove={() => onRemoveFile(file.id, id)}
              onDragStart={() => handleDragStart(file.id)}
              onDrop={() => handleDrop(file.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};