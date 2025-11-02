import React, { useRef, useCallback } from 'react';
import type { ImageFile } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (files: FileList) => void;
  onRemoveImage: (index: number) => void;
  originalImages: ImageFile[];
}

const CloseIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onRemoveImage, originalImages }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onImageUpload(files);
    }
    // Reset the input value to allow uploading the same file again
    if(event.target) event.target.value = '';
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      onImageUpload(files);
    }
  }, [onImageUpload]);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-amber-400 mb-3">1. Upload Images</h2>
      <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {originalImages.map((image, index) => (
            <div key={`${image.name}-${index}`} className="relative group aspect-square">
              <img src={image.dataUrl} alt={image.name} className="w-full h-full object-cover rounded-md border-2 border-amber-500/50"/>
              <button
                onClick={() => onRemoveImage(index)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 backdrop-blur-sm"
                aria-label={`Remove ${image.name}`}
              >
                <CloseIcon />
              </button>
            </div>
          ))}
          <label
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
            className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-600 rounded-md cursor-pointer bg-gray-800/50 hover:bg-gray-700/50 hover:border-amber-400 transition-colors"
            aria-label="Upload new images"
          >
            <div className="flex flex-col items-center justify-center text-center p-2">
              <UploadIcon className="w-8 h-8 mb-2 text-gray-400" />
              <p className="text-sm text-gray-300 font-semibold">Add Images</p>
              <p className="text-xs text-gray-500">or drag & drop</p>
            </div>
          </label>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        multiple
      />
    </div>
  );
};
