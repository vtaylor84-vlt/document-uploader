import React from 'react';
import { SelectedFile, FileType, BolCategory } from '../types';

interface FilePreviewProps {
    file: SelectedFile;
    onRemove: (id: string) => void;
    index: number;
    dragHandleProps: any;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove, index, dragHandleProps }) => {
    const isImageOrVideo = file.file.type.startsWith('image/') || file.file.type.startsWith('video/');
    const isPDF = file.file.type === 'application/pdf';

    const renderPreview = () => {
        if (file.file.type.startsWith('image/')) {
            return <img src={file.previewUrl} alt={file.file.name} className="object-cover w-full h-full" />;
        }
        if (file.file.type.startsWith('video/')) {
             // For video, show the thumbnail URL (which can be a simple 'play' icon if no thumbnail is generated)
            return (
                <div className="flex items-center justify-center w-full h-full bg-slate-900">
                    <span className="text-4xl text-[--color-primary]">🎬</span>
                </div>
            );
        }
        if (isPDF) {
            return (
                <div className="flex flex-col items-center justify-center w-full h-full bg-slate-900 p-2">
                    <span className="text-4xl text-red-500">📄</span>
                    <span className="text-xs text-white break-words w-full text-center mt-1">{file.file.name.substring(0, 15)}...</span>
                </div>
            );
        }
        return <div className="flex items-center justify-center w-full h-full bg-slate-900"><span className="text-xs text-white">FILE</span></div>;
    };

    return (
        <div 
            className="group relative w-full h-full border-2 border-[--color-secondary] rounded-lg overflow-hidden shadow-lg hover:shadow-[0_0_15px_var(--color-secondary)] transition-all duration-200"
            data-index={index}
            {...dragHandleProps}
        >
            <div className="w-full h-full aspect-square">
                {renderPreview()}
            </div>

            {/* Overlay for details and removal */}
            <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex justify-between items-start">
                    {/* File Type Tag */}
                    <span className={`px-2 py-0.5 text-xs font-bold rounded ${file.type === 'BOL' ? 'bg-indigo-600' : 'bg-amber-600'} text-white`}>
                        {file.type}
                    </span>
                    {/* Remove Button */}
                    <button
                        onClick={() => onRemove(file.id)}
                        className="p-1 text-white bg-red-600 rounded-full hover:bg-red-500 transition-colors shadow-lg"
                        aria-label="Remove file"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                {/* File Details and Category */}
                <div className="text-xs text-white">
                    <p className="font-bold truncate">{file.file.name}</p>
                    {file.type === 'BOL' && (
                        <span className={`mt-1 inline-block px-1 py-0 border border-white text-white text-[10px] rounded-full`}>
                            {file.category}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};