import React from 'react';

interface PreviewModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ src, alt, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
    >
      <div 
        className="relative bg-white p-2 rounded-lg shadow-2xl max-w-4xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image container
      >
        <div className="flex justify-between items-center p-2">
            <h2 id="preview-modal-title" className="text-lg font-semibold text-gray-800">{alt}</h2>
            <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Close preview"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            </button>
        </div>
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-auto object-contain max-h-[calc(90vh-60px)]"
        />
      </div>
    </div>
  );
};

export default PreviewModal;