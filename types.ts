// Fix: Import TranslationKey for type-safe localization keys.
import type { TranslationKey } from './localization';

export interface UploadedFile {
  base64: string;
  mimeType: string;
}

export interface Angle {
  id: string;
  title: string;
  prompt: string;
}

export enum GenerationStatus {
  PENDING = 'PENDING',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GeneratedImage {
  id: string;
  title: string;
  status: GenerationStatus;
  imageData?: string;
  error?: string;
}

export interface ImageStyle {
  id: string;
  // Fix: Use the specific TranslationKey type instead of a generic string for nameKey.
  // This resolves the type error in ImageGenerator.tsx when calling the t() function.
  nameKey: TranslationKey;
  prompt: string;
}