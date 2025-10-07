import React, { useState, useCallback } from 'react';
import type { UploadedFile, GeneratedImage } from '../types';
import { GenerationStatus } from '../types';
import { ANGLES, IMAGE_STYLES } from '../constants';
import { generateImageFromAngle } from '../services/geminiService';
import ImageCard from './ImageCard';
import PreviewModal from './PreviewModal';
import { SparklesIcon } from './icons';
import { useLocalization } from '../localization';


interface ImageGeneratorProps {
  uploadedFile: UploadedFile;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ uploadedFile }) => {
  const { t } = useLocalization();
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedStyleId, setSelectedStyleId] = useState<string>(IMAGE_STYLES[0].id);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>(
    ANGLES.map(angle => ({ id: angle.id, title: angle.title, status: GenerationStatus.PENDING }))
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewingImage, setPreviewingImage] = useState<GeneratedImage | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setGeneratedImages(
      ANGLES.map(angle => ({ id: angle.id, title: angle.title, status: GenerationStatus.LOADING }))
    );
    
    const stylePrompt = IMAGE_STYLES.find(s => s.id === selectedStyleId)?.prompt || '';

    const generationPromises = ANGLES.map(angle =>
      generateImageFromAngle(uploadedFile, angle.prompt, customPrompt, stylePrompt)
        .then(imageData => ({
          id: angle.id,
          title: angle.title,
          status: GenerationStatus.SUCCESS,
          imageData,
        }))
        .catch(error => ({
          id: angle.id,
          title: angle.title,
          status: GenerationStatus.ERROR,
          error: error.message,
        }))
    );

    const results = await Promise.all(generationPromises);

    setGeneratedImages(results);
    setIsGenerating(false);
  }, [uploadedFile, customPrompt, selectedStyleId]);
  
  const handleRegenerateOne = useCallback(async (imageId: string) => {
    const angle = ANGLES.find(a => a.id === imageId);
    if (!angle) return;

    setGeneratedImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, status: GenerationStatus.LOADING, error: undefined } : img
    ));

    const stylePrompt = IMAGE_STYLES.find(s => s.id === selectedStyleId)?.prompt || '';

    try {
        const imageData = await generateImageFromAngle(uploadedFile, angle.prompt, customPrompt, stylePrompt);
        setGeneratedImages(prev => prev.map(img =>
            img.id === imageId ? { ...img, status: GenerationStatus.SUCCESS, imageData } : img
        ));
    } catch (error) {
        setGeneratedImages(prev => prev.map(img =>
            img.id === imageId ? { ...img, status: GenerationStatus.ERROR, error: (error as Error).message } : img
        ));
    }
  }, [uploadedFile, customPrompt, selectedStyleId]);


  return (
    <>
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 bg-base-100 rounded-2xl shadow-lg border border-gray-200">
          <div className="lg:col-span-1 flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">{t('generator.original_image')}</h2>
            <img
              src={`data:${uploadedFile.mimeType};base64,${uploadedFile.base64}`}
              alt="Uploaded content"
              className="rounded-lg shadow-md max-w-full h-auto max-h-80 object-contain"
            />
          </div>
          <div className="lg:col-span-2 flex flex-col justify-center space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">{t('generator.details.title')}</h3>
              <p className="text-sm text-gray-500 mb-2">
                {t('generator.details.description')}
              </p>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={t('generator.details.placeholder')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-200"
                rows={3}
                disabled={isGenerating}
              />
            </div>
             <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('generator.styles.title')}</h3>
              <div className="flex flex-wrap gap-2">
                {IMAGE_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyleId(style.id)}
                    disabled={isGenerating}
                    className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                      selectedStyleId === style.id
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {t(style.nameKey)}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('generator.button.generating')}
                </>
              ) : (
                  <>
                      <SparklesIcon className="w-5 h-5 me-2" />
                      {t('generator.button.generate')}
                  </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {generatedImages.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onRegenerate={() => handleRegenerateOne(image.id)}
              onPreview={() => setPreviewingImage(image)}
            />
          ))}
        </div>
      </div>
      {previewingImage && previewingImage.imageData && (
         <PreviewModal 
            src={`data:image/png;base64,${previewingImage.imageData}`}
            alt={previewingImage.title}
            onClose={() => setPreviewingImage(null)}
         />
      )}
    </>
  );
};

export default ImageGenerator;