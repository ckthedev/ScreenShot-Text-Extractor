import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File | null): boolean => {
    if (!file) return false;
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, or WEBP file.');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 5MB. Please upload a smaller image.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleFile = useCallback((file: File | null) => {
    if (validateFile(file)) {
      onImageUpload(file as File);
    }
  }, [onImageUpload]);
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    handleFile(file);
  };
  
  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`w-full p-10 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:bg-gray-700/50'}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={SUPPORTED_FORMATS.join(',')}
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center text-center space-y-4">
          <UploadIcon className="w-12 h-12 text-gray-400" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            <span className="text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Supports: JPG, PNG, WEBP (Max 5MB)
          </p>
        </div>
      </div>
      {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};
