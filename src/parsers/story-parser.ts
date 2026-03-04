import { z } from 'zod';

export interface ParsedStory {
  entities: Array<{
    name: string;
    fields: Array<{ name: string; type: string }>;
  }>;
  features: string[];
  domain: string;
}

export function parseUserStory(story: string): ParsedStory {
  // Simple keyword extraction for MVP
  // TODO: Enhance with actual NLP in Phase 2
  
  const words = story.toLowerCase().split(/\s+/);
  
  // Extract domain from common keywords
  const domainKeywords: Record<string, string[]> = {
    fitness: ['fitness', 'workout', 'exercise', 'health', 'gym', 'training'],
    finance: ['finance', 'money', 'budget', 'expense', 'payment', 'invoice'],
    social: ['social', 'friend', 'chat', 'message', 'post', 'share'],
    productivity: ['task', 'todo', 'project', 'note', 'team', 'collaborate'],
    ecommerce: ['store', 'shop', 'product', 'cart', 'checkout', 'order'],
    education: ['learn', 'course', 'lesson', 'student', 'teacher', 'class'],
  };
  
  let domain = 'general';
  for (const [key, keywords] of Object.entries(domainKeywords)) {
    if (keywords.some((kw) => words.includes(kw))) {
      domain = key;
      break;
    }
  }
  
  // Extract features based on keywords
  const featureKeywords: Record<string, string[]> = {
    authentication: ['user', 'login', 'signup', 'auth', 'account'],
    billing: ['payment', 'subscription', 'billing', 'stripe', 'plan'],
    profile: ['profile', 'user', 'account', 'settings'],
    notifications: ['notify', 'notification', 'alert', 'email'],
    analytics: ['analytics', 'track', 'metrics', 'dashboard', 'report'],
  };
  
  const features: string[] = ['authentication', 'billing', 'profile']; // Always include core features
  
  for (const [feature, keywords] of Object.entries(featureKeywords)) {
    if (keywords.some((kw) => words.includes(kw)) && !features.includes(feature)) {
      features.push(feature);
    }
  }
  
  // Extract potential entities (nouns)
  // This is simplified - in production, use proper NLP
  const entities = [
    {
      name: 'User',
      fields: [
        { name: 'id', type: 'String' },
        { name: 'email', type: 'String' },
        { name: 'name', type: 'String' },
        { name: 'createdAt', type: 'DateTime' },
      ],
    },
  ];
  
  return { entities, features, domain };
}
