import { z } from 'zod';

export interface ParsedStory {
  entities: Array<{
    name: string;
    fields: Array<{ name: string; type: string }>;
  }>;
  features: string[];
  domain: string;
}

/**
 * Enhanced user story parser with improved entity and feature extraction
 */
export function parseUserStory(story: string): ParsedStory {
  const words = story.toLowerCase().split(/\s+/);
  const sentences = story.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Extract domain from keywords with better matching
  const domain = detectDomain(words);
  
  // Extract features with context awareness
  const features = extractFeatures(words, sentences);
  
  // Extract entities from nouns and context
  const entities = extractEntities(story, domain);
  
  return { entities, features, domain };
}

/**
 * Detect the domain based on keyword weighting
 */
function detectDomain(words: string[]): string {
  const domainKeywords: Record<string, { keywords: string[]; weight: number }> = {
    fitness: {
      keywords: ['fitness', 'workout', 'exercise', 'health', 'gym', 'training', 'athlete', 'muscle', 'cardio', 'yoga'],
      weight: 0,
    },
    finance: {
      keywords: ['finance', 'money', 'budget', 'expense', 'payment', 'invoice', 'accounting', 'tax', 'investment', 'banking'],
      weight: 0,
    },
    social: {
      keywords: ['social', 'friend', 'chat', 'message', 'post', 'share', 'follow', 'comment', 'like', 'community'],
      weight: 0,
    },
    productivity: {
      keywords: ['task', 'todo', 'project', 'note', 'team', 'collaborate', 'workflow', 'kanban', 'agile', 'sprint'],
      weight: 0,
    },
    ecommerce: {
      keywords: ['store', 'shop', 'product', 'cart', 'checkout', 'order', 'inventory', 'shipping', 'customer', 'catalog'],
      weight: 0,
    },
    education: {
      keywords: ['learn', 'course', 'lesson', 'student', 'teacher', 'class', 'education', 'training', 'quiz', 'assignment'],
      weight: 0,
    },
    healthcare: {
      keywords: ['health', 'medical', 'patient', 'doctor', 'appointment', 'diagnosis', 'treatment', 'clinic', 'hospital'],
      weight: 0,
    },
    realestate: {
      keywords: ['property', 'real estate', 'listing', 'rental', 'lease', 'tenant', 'landlord', 'apartment', 'house'],
      weight: 0,
    },
  };
  
  // Calculate weights for each domain
  for (const word of words) {
    for (const [domain, config] of Object.entries(domainKeywords)) {
      if (config.keywords.includes(word)) {
        config.weight += 1;
      }
    }
  }
  
  // Find domain with highest weight
  let maxWeight = 0;
  let detectedDomain = 'general';
  
  for (const [domain, config] of Object.entries(domainKeywords)) {
    if (config.weight > maxWeight) {
      maxWeight = config.weight;
      detectedDomain = domain;
    }
  }
  
  return detectedDomain;
}

/**
 * Extract features from the user story
 */
function extractFeatures(words: string[], sentences: string[]): string[] {
  const featureKeywords: Record<string, string[]> = {
    authentication: ['user', 'login', 'signup', 'auth', 'account', 'register', 'password'],
    billing: ['payment', 'subscription', 'billing', 'stripe', 'plan', 'pricing', 'invoice'],
    profile: ['profile', 'settings', 'preferences', 'avatar', 'bio'],
    notifications: ['notify', 'notification', 'alert', 'email', 'push', 'reminder'],
    analytics: ['analytics', 'track', 'metrics', 'dashboard', 'report', 'statistics', 'insights'],
    search: ['search', 'filter', 'find', 'query', 'lookup'],
    social: ['share', 'comment', 'like', 'follow', 'friend', 'social'],
    messaging: ['message', 'chat', 'conversation', 'inbox', 'direct'],
    calendar: ['calendar', 'schedule', 'event', 'appointment', 'booking'],
    file: ['upload', 'download', 'file', 'attachment', 'document', 'image'],
  };
  
  // Always include core features
  const features: string[] = ['authentication', 'profile'];
  
  // Add billing if it's mentioned or if it's a SaaS app
  const isSaaS = words.some(w => ['saas', 'subscription', 'plan', 'pricing'].includes(w));
  if (isSaaS) {
    features.push('billing');
  }
  
  // Extract features based on keywords
  for (const [feature, keywords] of Object.entries(featureKeywords)) {
    if (keywords.some((kw) => words.includes(kw)) && !features.includes(feature)) {
      features.push(feature);
    }
  }
  
  return features;
}

/**
 * Extract entities from the user story using noun detection
 */
function extractEntities(story: string, domain: string): ParsedStory['entities'] {
  // Common nouns that might indicate entities
  const commonEntityIndicators = [
    'user', 'customer', 'client', 'member', 'account',
    'post', 'article', 'blog', 'comment', 'message',
    'product', 'item', 'listing', 'order', 'cart',
    'task', 'project', 'todo', 'note', 'document',
    'event', 'appointment', 'booking', 'reservation',
    'course', 'lesson', 'class', 'student', 'teacher',
    'workout', 'exercise', 'routine', 'session',
    'property', 'listing', 'rental', 'lease',
  ];
  
  const words = story.toLowerCase().split(/\s+/);
  const detectedEntities = new Set<string>();
  
  // Always include User entity
  detectedEntities.add('User');
  
  // Detect entities from common indicators
  for (const word of words) {
    const cleanWord = word.replace(/[^a-z]/g, '');
    if (commonEntityIndicators.includes(cleanWord) && cleanWord !== 'user') {
      // Capitalize first letter
      const entityName = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
      detectedEntities.add(entityName);
    }
  }
  
  // Add domain-specific entities
  const domainEntities: Record<string, string[]> = {
    fitness: ['Workout', 'Exercise', 'Progress'],
    finance: ['Transaction', 'Account', 'Budget'],
    social: ['Post', 'Comment', 'Like'],
    productivity: ['Task', 'Project', 'Note'],
    ecommerce: ['Product', 'Order', 'Cart'],
    education: ['Course', 'Lesson', 'Assignment'],
    healthcare: ['Patient', 'Appointment', 'Treatment'],
    realestate: ['Property', 'Listing', 'Tenant'],
  };
  
  if (domainEntities[domain]) {
    domainEntities[domain].forEach(entity => detectedEntities.add(entity));
  }
  
  // Convert to entity objects with fields
  const entities: ParsedStory['entities'] = [];
  
  // Always add User entity first with standard fields
  entities.push({
    name: 'User',
    fields: [
      { name: 'id', type: 'String' },
      { name: 'email', type: 'String' },
      { name: 'name', type: 'String' },
      { name: 'password', type: 'String' },
      { name: 'createdAt', type: 'DateTime' },
      { name: 'updatedAt', type: 'DateTime' },
    ],
  });
  
  // Add other detected entities
  detectedEntities.forEach(entityName => {
    if (entityName !== 'User') {
      entities.push({
        name: entityName,
        fields: [
          { name: 'id', type: 'String' },
          { name: 'userId', type: 'String' },
          { name: 'title', type: 'String' },
          { name: 'content', type: 'String' },
          { name: 'createdAt', type: 'DateTime' },
          { name: 'updatedAt', type: 'DateTime' },
        ],
      });
    }
  });
  
  return entities;
}
