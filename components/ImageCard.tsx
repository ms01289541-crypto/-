import React from 'react';
import type { GeneratedImage } from '../types';
import { GenerationStatus } from '../types';
import { DownloadIcon, WarningIcon, RegenerateIcon, PreviewIcon } from './icons';
import { useLocalization } from '../localization';

interface ImageCardProps {
  image: GeneratedImage;
  onRegenerate: () => void;
  onPreview: () => void;
}

const Spinner: React.FC = () => (
    <div className="flex items-center justify-center h-full">
        <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const ImageCard: React.FC<ImageCardProps> = ({ image, onRegenerate, onPreview }) => {
  const { t } = useLocalization();

  const downloadImage = () => {
    if (image.imageData) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${image.imageData}`;
      link.download = `${image.title.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderContent = () => {
    switch (image.status) {
      case GenerationStatus.LOADING:
        return <Spinner />;
      case GenerationStatus.ERROR:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <WarningIcon className="w-12 h-12 text-red-400 mb-3" />
            <p className="font-semibold text-red-700">{t('card.failed')}</p>
            <p className="text-xs text-red-600 mt-1">{image.error || t('card.error.unknown')}</p>
          </div>
        );
      case GenerationStatus.SUCCESS:
        return (
          <img
            src={`data:image/png;base64,${image.imageData}`}
            alt={image.title}
            className="w-full h-full object-cover"
          />
        );
      case GenerationStatus.PENDING:
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            {t('card.waiting')}
          </div>
        );
    }
  };

  return (
    <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {renderContent()}
      </div>
      <div className="p-4 bg-white flex justify-between items-center mt-auto">
        <h3 className="font-bold text-lg text-gray-800">{image.title}</h3>
        <div className="flex items-center gap-2">
           {(image.status === GenerationStatus.ERROR || image.status === GenerationStatus.SUCCESS) && (
              <button
                onClick={onRegenerate}
                disabled={image.status === GenerationStatus.LOADING}
                className="flex items-center justify-center p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                aria-label={t('card.regenerate_aria', {title: image.title})}
              >
                <RegenerateIcon className="w-5 h-5" />
              </button>
            )}
            {image.status === GenerationStatus.SUCCESS && (
              <>
                <button
                    onClick={onPreview}
                    className="flex items-center justify-center p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                    aria-label={t('card.preview_aria', {title: image.title})}
                >
                    <PreviewIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={downloadImage}
                  className="flex items-center justify-center p-2 bg-secondary text-white rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors duration-200"
                  aria-label={t('card.download_aria', {title: image.title})}
                >
                  <DownloadIcon className="w-5 h-5" />
                </button>
            </>
            )}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;