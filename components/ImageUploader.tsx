import React, { useState, useCallback } from 'react';
import type { UploadedFile } from '../types';
import { useLocalization } from '../localization';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: UploadedFile) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useLocalization();

  const handleFileChange = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (e.g., JPG, PNG, WEBP).');
        return;
      }

      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        if (base64) {
          onImageUpload({ base64, mimeType: file.type });
        } else {
          setError('Could not read the image file.');
        }
      };
      reader.onerror = () => {
        setError('Error reading the file.');
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };


  return (
    <div className="flex flex-col items-center justify-center p-8 bg-base-100 rounded-2xl shadow-lg border border-gray-200">
      <div 
        className={`w-full max-w-2xl p-10 border-2 border-dashed rounded-xl transition-colors duration-300 ${isDragging ? 'border-primary bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center text-center">
          <UploadIcon className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700">{t('uploader.title')}</h2>
          <p className="text-gray-500 mt-2">{t('uploader.or')}</p>
          <label
            htmlFor="file-upload"
            className="mt-4 cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-transform transform hover:scale-105"
          >
            <span>{t('uploader.button')}</span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileChange(e.target.files)} />
          </label>
          <p className="mt-6 text-sm text-gray-500">
            {t('uploader.description')}
          </p>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>
      </div>
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 max-w-2xl text-center">
        <h3 className="font-semibold">{t('uploader.responsibility.title')}</h3>
        <p className="mt-1">{t('uploader.responsibility.body')}</p>
      </div>
    </div>
  );
};

export default ImageUploader;