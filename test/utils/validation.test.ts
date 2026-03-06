import { describe, it, expect } from 'vitest';
import {
  projectNameSchema,
  userStorySchema,
  descriptionSchema,
  authorSchema,
  initOptionsSchema,
} from '../../src/utils/validation';

describe('validation schemas', () => {
  describe('projectNameSchema', () => {
    it('should accept valid project names', () => {
      expect(projectNameSchema.parse('my-app')).toBe('my-app');
      expect(projectNameSchema.parse('my-saas-app')).toBe('my-saas-app');
      expect(projectNameSchema.parse('fitness-tracker')).toBe('fitness-tracker');
      expect(projectNameSchema.parse('app123')).toBe('app123');
    });

    it('should reject names with uppercase letters', () => {
      expect(() => projectNameSchema.parse('MyApp')).toThrow();
      expect(() => projectNameSchema.parse('my-App')).toThrow();
    });

    it('should reject names with special characters', () => {
      expect(() => projectNameSchema.parse('my_app')).toThrow();
      expect(() => projectNameSchema.parse('my.app')).toThrow();
      expect(() => projectNameSchema.parse('my app')).toThrow();
      expect(() => projectNameSchema.parse('my@app')).toThrow();
    });

    it('should reject names that are too short', () => {
      expect(() => projectNameSchema.parse('ab')).toThrow();
      expect(() => projectNameSchema.parse('a')).toThrow();
    });

    it('should reject names that are too long', () => {
      const longName = 'a'.repeat(51);
      expect(() => projectNameSchema.parse(longName)).toThrow();
    });

    it('should reject names starting or ending with hyphen', () => {
      expect(() => projectNameSchema.parse('-myapp')).toThrow();
      expect(() => projectNameSchema.parse('myapp-')).toThrow();
    });

    it('should reject names with path traversal', () => {
      expect(() => projectNameSchema.parse('my..app')).toThrow();
      expect(() => projectNameSchema.parse('../app')).toThrow();
    });
  });

  describe('userStorySchema', () => {
    it('should accept valid user stories', () => {
      const story = 'A fitness app where users can track workouts';
      expect(userStorySchema.parse(story)).toBe(story);
    });

    it('should reject empty stories', () => {
      expect(() => userStorySchema.parse('')).toThrow();
    });

    it('should reject stories with less than 5 words', () => {
      expect(() => userStorySchema.parse('A simple app')).toThrow();
      expect(() => userStorySchema.parse('One two three four')).toThrow();
    });

    it('should accept stories with 5 or more words', () => {
      expect(userStorySchema.parse('One two three four five')).toBe(
        'One two three four five'
      );
    });

    it('should handle stories with extra whitespace', () => {
      const story = '  A  fitness  app  for  tracking  ';
      const parsed = userStorySchema.parse(story);
      expect(parsed).toBe(story);
    });
  });

  describe('descriptionSchema', () => {
    it('should accept valid descriptions', () => {
      expect(descriptionSchema.parse('A SaaS application')).toBe(
        'A SaaS application'
      );
    });

    it('should reject empty descriptions', () => {
      expect(() => descriptionSchema.parse('')).toThrow();
    });

    it('should reject very long descriptions', () => {
      const longDesc = 'a'.repeat(501);
      expect(() => descriptionSchema.parse(longDesc)).toThrow();
    });

    it('should accept descriptions up to 500 characters', () => {
      const maxDesc = 'a'.repeat(500);
      expect(descriptionSchema.parse(maxDesc)).toBe(maxDesc);
    });
  });

  describe('authorSchema', () => {
    it('should accept valid author names', () => {
      expect(authorSchema.parse('John Doe')).toBe('John Doe');
      expect(authorSchema.parse('Alice')).toBe('Alice');
    });

    it('should reject empty author names', () => {
      expect(() => authorSchema.parse('')).toThrow();
    });

    it('should reject very long author names', () => {
      const longName = 'a'.repeat(101);
      expect(() => authorSchema.parse(longName)).toThrow();
    });

    it('should accept author names up to 100 characters', () => {
      const maxName = 'a'.repeat(100);
      expect(authorSchema.parse(maxName)).toBe(maxName);
    });
  });

  describe('initOptionsSchema', () => {
    it('should accept valid options', () => {
      const options = {
        story: 'A fitness app for tracking workouts and progress',
        description: 'A fitness tracking application',
        author: 'John Doe',
        install: true,
        git: true,
      };
      
      const result = initOptionsSchema.parse(options);
      expect(result).toEqual(options);
    });

    it('should set default values for missing fields', () => {
      const result = initOptionsSchema.parse({});
      expect(result.install).toBe(true);
      expect(result.git).toBe(true);
    });

    it('should allow partial options', () => {
      const options = {
        story: 'A simple SaaS application for tracking',
        install: false,
      };
      
      const result = initOptionsSchema.parse(options);
      expect(result.install).toBe(false);
      expect(result.git).toBe(true); // default
    });

    it('should validate nested fields', () => {
      const options = {
        story: 'Too short',
        install: true,
        git: true,
      };
      
      expect(() => initOptionsSchema.parse(options)).toThrow();
    });

    it('should accept all optional fields as undefined', () => {
      const options = {
        install: true,
        git: false,
      };
      
      const result = initOptionsSchema.parse(options);
      expect(result.story).toBeUndefined();
      expect(result.description).toBeUndefined();
      expect(result.author).toBeUndefined();
    });
  });
});
