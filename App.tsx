import React, { useState, useEffect } from 'react';
import ImageUploader from './components/ImageUploader';
import ImageGenerator from './components/ImageGenerator';
import { CameraIcon, LanguageIcon } from './components/icons';
import type { UploadedFile } from './types';
import { useLocalization } from './localization';

const App: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const { lang, setLang, t } = useLocalization();

  const handleImageUpload = (file: UploadedFile) => {
    setUploadedFile(file);
  };

  const handleReset = () => {
    setUploadedFile(null);
  };

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  return (
    <div className="min-h-screen bg-gray-50 text-base-content font-sans">
      <header className="bg-base-100 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
               <CameraIcon className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-800">
                {t('app.title')}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {uploadedFile && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors duration-200"
                >
                  {t('app.upload_new')}
                </button>
              )}
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Toggle language"
              >
                <LanguageIcon className="w-6 h-6 text-gray-600"/>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {!uploadedFile ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <ImageGenerator uploadedFile={uploadedFile} />
        )}
      </main>

      <footer className="text-center p-6 text-gray-500 text-sm">
        <p>{t('app.footer.copy')}</p>
        <p className="mt-2">{t('app.footer.notice')}</p>
      </footer>
    </div>
  );
};

export default App;