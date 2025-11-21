import React from 'react';
import type { UploadedFile } from '../types.ts';
import { XIcon } from './icons/XIcon.tsx';
import { DocumentIcon } from './icons/DocumentIcon.tsx';
import { FileIcon } from './icons/FileIcon.tsx';

interface FileThumbnailProps {
  fileWrapper: UploadedFile;
  onRemove: () => void;
  onDragStart: () => void;
  onDrop: () => void;
}

const isImage = (file: File) => file.type.startsWith('image/');
const isVideo = (file: File) => file.type.startsWith('video/');
const isPdf = (file: File) => file.type === 'application/pdf';

export const FileThumbnail: React.FC<FileThumbnailProps> = ({ fileWrapper, onRemove, onDragStart, onDrop }) => {
  const { file, previewUrl } = fileWrapper;

  const renderPreview = () => {
    if (isImage(file)) {
      return <img src={previewUrl} alt={file.name} className="h-full w-full object-cover" />;
    }
    if (isVideo(file)) {
      return <video src={previewUrl} className="h-full w-full object-cover" muted playsInline />;
    }
    if (isPdf(file)) {
      return <div className="flex flex-col items-center justify-center h-full bg-gray-700 text-gray-300"><DocumentIcon className="w-8 h-8" /><span className="text-xs mt-1">PDF</span></div>;
    }
    return <div className="flex flex-col items-center justify-center h-full bg-gray-700 text-gray-300"><FileIcon className="w-8 h-8" /><span className="text-xs mt-1">File</span></div>;
  };
  
  return (
    <div
      className="relative group aspect-square overflow-hidden border-2 border-gray-700 hover:border-cyan-400 transition-all cursor-grab"
      draggable="true"
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      {renderPreview()}
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <p className="text-white text-xs text-center p-1 break-all">{file.name}</p>
      </div>
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500/80 transition-all"
        aria-label="Remove file"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};