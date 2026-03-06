import { describe, it, expect } from 'vitest';
import { parseUserStory } from '../../src/parsers/story-parser';

describe('parseUserStory', () => {
  describe('domain detection', () => {
    it('should detect fitness domain', () => {
      const result = parseUserStory(
        'A fitness app where users can track workouts and monitor exercise progress'
      );
      expect(result.domain).toBe('fitness');
    });

    it('should detect finance domain', () => {
      const result = parseUserStory(
        'A budgeting app where users can track expenses and manage their money'
      );
      expect(result.domain).toBe('finance');
    });

    it('should detect social domain', () => {
      const result = parseUserStory(
        'A social network where users can share posts and chat with friends'
      );
      expect(result.domain).toBe('social');
    });

    it('should detect productivity domain', () => {
      const result = parseUserStory(
        'A task management tool where teams can collaborate on projects and track todos'
      );
      expect(result.domain).toBe('productivity');
    });

    it('should detect ecommerce domain', () => {
      const result = parseUserStory(
        'An online store where customers can browse products and checkout with their cart'
      );
      expect(result.domain).toBe('ecommerce');
    });

    it('should detect education domain', () => {
      const result = parseUserStory(
        'A learning platform where students can take courses and teachers can create lessons'
      );
      expect(result.domain).toBe('education');
    });

    it('should default to general for unknown domains', () => {
      const result = parseUserStory(
        'A miscellaneous application for various purposes'
      );
      expect(result.domain).toBe('general');
    });

    it('should prioritize domain with most keyword matches', () => {
      const result = parseUserStory(
        'A fitness and health tracking app where users can log workouts, track exercise routines, and monitor gym progress'
      );
      expect(result.domain).toBe('fitness');
    });
  });

  describe('feature extraction', () => {
    it('should always include authentication and profile features', () => {
      const result = parseUserStory('A simple application');
      expect(result.features).toContain('authentication');
      expect(result.features).toContain('profile');
    });

    it('should detect billing feature from keywords', () => {
      const result = parseUserStory(
        'A SaaS application with subscription plans and payment processing'
      );
      expect(result.features).toContain('billing');
    });

    it('should detect notifications feature', () => {
      const result = parseUserStory(
        'An app that sends email notifications and alerts to users'
      );
      expect(result.features).toContain('notifications');
    });

    it('should detect analytics feature', () => {
      const result = parseUserStory(
        'A dashboard with analytics and metrics tracking for reporting insights'
      );
      expect(result.features).toContain('analytics');
    });

    it('should detect search feature', () => {
      const result = parseUserStory(
        'Users can search and filter content to find what they need'
      );
      expect(result.features).toContain('search');
    });

    it('should detect messaging feature', () => {
      const result = parseUserStory(
        'Users can chat and send messages in conversations'
      );
      expect(result.features).toContain('messaging');
    });

    it('should detect multiple features', () => {
      const result = parseUserStory(
        'A SaaS platform where users can chat, receive notifications, and view analytics on their dashboard'
      );
      expect(result.features).toContain('messaging');
      expect(result.features).toContain('notifications');
      expect(result.features).toContain('analytics');
    });

    it('should add billing for SaaS applications', () => {
      const result = parseUserStory('A SaaS application for project management');
      expect(result.features).toContain('billing');
    });
  });

  describe('entity extraction', () => {
    it('should always include User entity', () => {
      const result = parseUserStory('A simple application');
      const userEntity = result.entities.find((e) => e.name === 'User');
      
      expect(userEntity).toBeDefined();
      expect(userEntity?.fields).toEqual(
        expect.arrayContaining([
          { name: 'id', type: 'String' },
          { name: 'email', type: 'String' },
          { name: 'name', type: 'String' },
          { name: 'password', type: 'String' },
          { name: 'createdAt', type: 'DateTime' },
          { name: 'updatedAt', type: 'DateTime' },
        ])
      );
    });

    it('should extract domain-specific entities for fitness', () => {
      const result = parseUserStory(
        'A fitness app where users can track workouts and exercises'
      );
      expect(result.entities.some((e) => e.name === 'Workout')).toBe(true);
      expect(result.entities.some((e) => e.name === 'Exercise')).toBe(true);
    });

    it('should extract domain-specific entities for ecommerce', () => {
      const result = parseUserStory(
        'An online store where users can browse products and place orders'
      );
      expect(result.entities.some((e) => e.name === 'Product')).toBe(true);
      expect(result.entities.some((e) => e.name === 'Order')).toBe(true);
    });

    it('should extract entities from common nouns', () => {
      const result = parseUserStory(
        'Users can create posts and add comments to articles'
      );
      expect(result.entities.some((e) => e.name === 'Post')).toBe(true);
      expect(result.entities.some((e) => e.name === 'Comment')).toBe(true);
    });

    it('should not duplicate User entity', () => {
      const result = parseUserStory('Users and customers can manage accounts');
      const userEntities = result.entities.filter((e) => e.name === 'User');
      expect(userEntities).toHaveLength(1);
    });

    it('should extract task-related entities for productivity domain', () => {
      const result = parseUserStory(
        'A productivity tool where users can create tasks, manage projects, and write notes'
      );
      expect(result.entities.some((e) => e.name === 'Task')).toBe(true);
      expect(result.entities.some((e) => e.name === 'Project')).toBe(true);
      expect(result.entities.some((e) => e.name === 'Note')).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty user story', () => {
      const result = parseUserStory('');
      expect(result.domain).toBe('general');
      expect(result.features).toContain('authentication');
      expect(result.entities).toHaveLength(1); // Just User
    });

    it('should handle very short user story', () => {
      const result = parseUserStory('An app');
      expect(result.domain).toBe('general');
      expect(result.features.length).toBeGreaterThan(0);
    });

    it('should handle user story with special characters', () => {
      const result = parseUserStory(
        'A fitness app! Users can track workouts & exercises... Amazing!'
      );
      expect(result.domain).toBe('fitness');
      expect(result.entities.length).toBeGreaterThan(0);
    });

    it('should handle case-insensitive keywords', () => {
      const result = parseUserStory(
        'A FITNESS app where USERS can TRACK workouts'
      );
      expect(result.domain).toBe('fitness');
      expect(result.features).toContain('authentication');
    });
  });
});
