import { ParsedStory } from './story-parser';

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
}

export function generateTheme(story: ParsedStory): Theme {
  // Map domains to color schemes
  const colorSchemes: Record<string, Theme> = {
    fitness: {
      primaryColor: '#10b981', // green-500
      secondaryColor: '#3b82f6', // blue-500
      accentColor: '#f59e0b', // amber-500
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    finance: {
      primaryColor: '#3b82f6', // blue-500
      secondaryColor: '#1e40af', // blue-800
      accentColor: '#10b981', // green-500
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    social: {
      primaryColor: '#8b5cf6', // violet-500
      secondaryColor: '#ec4899', // pink-500
      accentColor: '#f59e0b', // amber-500
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    productivity: {
      primaryColor: '#6366f1', // indigo-500
      secondaryColor: '#8b5cf6', // violet-500
      accentColor: '#14b8a6', // teal-500
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    ecommerce: {
      primaryColor: '#f59e0b', // amber-500
      secondaryColor: '#dc2626', // red-600
      accentColor: '#10b981', // green-500
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    education: {
      primaryColor: '#0ea5e9', // sky-500
      secondaryColor: '#8b5cf6', // violet-500
      accentColor: '#f59e0b', // amber-500
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    general: {
      primaryColor: '#6366f1', // indigo-500
      secondaryColor: '#8b5cf6', // violet-500
      accentColor: '#10b981', // green-500
      fontFamily: 'Inter, system-ui, sans-serif',
    },
  };
  
  return colorSchemes[story.domain] || colorSchemes.general;
}
