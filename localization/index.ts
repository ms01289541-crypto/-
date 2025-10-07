import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

type Language = 'en' | 'ar';

const translations = {
  en: {
    // App.tsx
    'app.title': 'AI Angle Generator',
    'app.upload_new': 'Upload New Image',
    'app.footer.copy': `© ${new Date().getFullYear()} AI Angle Generator. All Rights Reserved.`,
    'app.footer.notice': 'Generated images are for creative purposes. Users are responsible for ensuring content complies with all applicable policies.',

    // ImageUploader.tsx
    'uploader.title': 'Drag & Drop an Image',
    'uploader.or': 'or',
    'uploader.button': 'Upload an Image',
    'uploader.description': "Upload a single image, and we'll transform it into 3 different angles using advanced AI.",
    'uploader.responsibility.title': 'User Responsibility Notice',
    'uploader.responsibility.body': 'By uploading an image, you agree to our terms of service. You are solely responsible for the content you upload and generate. Ensure your images do not violate any copyrights or community guidelines.',

    // ImageGenerator.tsx
    'generator.original_image': 'Your Original Image',
    'generator.details.title': 'Add more details (Optional)',
    'generator.details.description': 'Describe the image for better results. For example: "A cat sitting on a red velvet couch".',
    'generator.details.placeholder': 'You can add a custom description for each angle if you wish to customize details, or leave it blank.',
    'generator.styles.title': 'Choose an Image Style',
    'generator.button.generate': 'Generate 3 New Angles',
    'generator.button.generating': 'Generating Angles...',
    
    // ImageCard.tsx
    'card.waiting': 'Waiting to generate...',
    'card.failed': 'Generation Failed',
    'card.error.unknown': 'An unknown error occurred.',
    'card.download_aria': 'Download {title}',
    'card.regenerate_aria': 'Regenerate {title}',
    'card.preview_aria': 'Preview {title}',

    // Styles
    'style.none': 'None',
    'style.dramatic': 'Dramatic',
    'style.artistic': 'Artistic',
    'style.modern': 'Modern',
    'style.cinematic': 'Cinematic',
    'style.vintage': 'Vintage',
    'style.retro': 'Retro',
    'style.graffiti': 'Graffiti',
    'style.futuristic': 'Futuristic',
  },
  ar: {
    // App.tsx
    'app.title': 'مولد الزوايا بالذكاء الاصطناعي',
    'app.upload_new': 'رفع صورة جديدة',
    'app.footer.copy': `© ${new Date().getFullYear()} مولد الزوايا بالذكاء الاصطناعي. جميع الحقوق محفوظة.`,
    'app.footer.notice': 'الصور التي يتم إنشاؤها هي لأغراض إبداعية. يتحمل المستخدمون مسؤولية التأكد من أن المحتوى يتوافق مع جميع السياسات المعمول بها.',
    
    // ImageUploader.tsx
    'uploader.title': 'اسحب وأفلت صورة هنا',
    'uploader.or': 'أو',
    'uploader.button': 'رفع صورة',
    'uploader.description': 'قم برفع صورة واحدة، وسنحولها إلى 3 صور بزوايا مختلفة باستخدام تقنيات الذكاء الاصطناعي المتقدمة.',
    'uploader.responsibility.title': 'إشعار مسؤولية المستخدم',
    'uploader.responsibility.body': 'عبر رفعك لصورة، فإنك توافق على شروط الخدمة. أنت المسؤول الوحيد عن المحتوى الذي تقوم برفعه وتوليده. تأكد من أن صورك لا تنتهك أي حقوق نشر أو إرشادات مجتمعية.',

    // ImageGenerator.tsx
    'generator.original_image': 'صورتك الأصلية',
    'generator.details.title': 'أضف المزيد من التفاصيل (اختياري)',
    'generator.details.description': 'صف الصورة للحصول على نتائج أفضل. على سبيل المثال: "قطة تجلس على أريكة مخملية حمراء".',
    'generator.details.placeholder': 'يمكنك إضافة وصف مخصص لكل زاوية إذا رغبت في تخصيص التفاصيل، أو تركه فارغًا.',
    'generator.styles.title': 'اختر نمط الصورة',
    'generator.button.generate': 'إنشاء 3 زوايا جديدة',
    'generator.button.generating': 'جاري إنشاء الزوايا...',

    // ImageCard.tsx
    'card.waiting': 'في انتظار الإنشاء...',
    'card.failed': 'فشل الإنشاء',
    'card.error.unknown': 'حدث خطأ غير معروف.',
    'card.download_aria': 'تنزيل {title}',
    'card.regenerate_aria': 'إعادة إنشاء {title}',
    'card.preview_aria': 'معاينة {title}',

    // Styles
    'style.none': 'بدون',
    'style.dramatic': 'درامي',
    'style.artistic': 'فني',
    'style.modern': 'عصري',
    'style.cinematic': 'سينمائي',
    'style.vintage': 'عتيق',
    'style.retro': 'ريترو',
    'style.graffiti': 'جرافيتي',
    'style.futuristic': 'مستقبلي',
  },
};

type Translations = typeof translations.en;

// Fix: Export TranslationKey to be used in other files for type safety.
export type TranslationKey = keyof Translations;

interface LocalizationContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  // Fix: Use TranslationKey for the key parameter for better type checking.
  t: (key: TranslationKey, replacements?: Record<string, string>) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');

  const t = useMemo(() => (key: TranslationKey, replacements?: Record<string, string>): string => {
    // The type system ensures key is valid for 'en'.
    // We fall back to English if the key doesn't exist in the current language.
    let translation = (translations[lang] as any)[key] || translations['en'][key];
    if (replacements) {
        Object.entries(replacements).forEach(([key, value]) => {
            translation = translation.replace(`{${key}}`, value);
        });
    }
    return translation;
  }, [lang]);

  return (
    // Fix: Replaced JSX with React.createElement to avoid parsing errors in a .ts file.
    // This resolves multiple errors related to incorrect JSX parsing.
    React.createElement(LocalizationContext.Provider, { value: { lang, setLang, t } }, children)
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
