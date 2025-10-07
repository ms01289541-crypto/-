import type { Angle, ImageStyle } from './types';

// Updated to generate 3 angles instead of 6.
export const ANGLES: Angle[] = [
  {
    id: 'side',
    title: 'Side Angle',
    prompt: 'Generate an image of the subject from a side angle view, keeping the original style.',
  },
  {
    id: 'low',
    title: 'Low Angle',
    prompt: 'Generate an image of the subject from a low angle, looking up, to make it appear more prominent, keeping the original style.',
  },
  {
    id: 'high',
    title: 'High Angle',
    prompt: 'Generate an image of the subject from a high angle, looking down, to give a sense of perspective, keeping the original style.',
  },
];

// Updated with a new list of 8 artistic styles.
export const IMAGE_STYLES: ImageStyle[] = [
  {
    id: 'none',
    nameKey: 'style.none',
    prompt: '',
  },
  {
    id: 'dramatic',
    nameKey: 'style.dramatic',
    prompt: "Apply a dramatic style using intense, high-contrast lighting to create deep, dark shadows and sharp highlights. Use a dark color palette (like blacks and deep blues) with high contrast to make the main subjects stand out. Add strong shadow effects on the sides and bright lighting on key focal points for a majestic and powerful look.",
  },
  {
    id: 'artistic',
    nameKey: 'style.artistic',
    prompt: "Transform the image into an artistic painting. Apply effects like oil paint, watercolor, or a cartoonish drawing style. Use unconventional color gradients and artistic effects like abstraction or modern art to make it look like a unique and distinctive piece of art.",
  },
  {
    id: 'modern',
    nameKey: 'style.modern',
    prompt: "Give the image a modern style with a simple, clean design and bright, vibrant colors. Minimize heavy shadows and focus on clear, precise lines. The overall look should be fresh and contemporary, suitable for a modern and appealing aesthetic.",
  },
  {
    id: 'cinematic',
    nameKey: 'style.cinematic',
    prompt: "Recreate the image with a cinematic style. Use soft lighting and warm colors to create a movie-like feel. Add effects like dark letterbox bars (cinemascope) and a subtle haze or fog to create depth. The image should look like a still from a real movie scene, with dramatic lighting and powerful cinematic effects.",
  },
  {
    id: 'vintage',
    nameKey: 'style.vintage',
    prompt: "Apply a vintage style to the image. Use warm, faded colors like sepia, pale yellow, or dark brown. Add aging effects like film grain, scratches, or light leaks to give the photo an old, historic feel, as if it were a photograph from the past.",
  },
  {
    id: 'retro',
    nameKey: 'style.retro',
    prompt: "Give the image a retro style inspired by the 1980s. Use vibrant, neon colors or a classic black and white look. Add effects like blur, noise, or light trails to create an old-school feel. The image should look like a vintage photo with a distinct retro vibe.",
  },
  {
    id: 'graffiti',
    nameKey: 'style.graffiti',
    prompt: "Transform the image with a graffiti style. Add bold, spray-painted graphics and free-form artistic lines. Use bright, vibrant colors like red, blue, and yellow with effects on the edges. The image should be full of energy and life, like a piece of street art.",
  },
  {
    id: 'futuristic',
    nameKey: 'style.futuristic',
    prompt: "Create a futuristic look for the image. Use effects like glowing lights, 3D designs, and modern technology to create a futuristic appearance. Focus on metallic colors like silver and black with tech-inspired effects. The image should look like a scene from the future, with advanced technology and a sleek design.",
  }
];
