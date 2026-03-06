import { describe, it, expect } from 'vitest';
import { generateTheme } from '../../src/parsers/theme-generator';
import type { ParsedStory } from '../../src/parsers/story-parser';

describe('generateTheme', () => {
  const createMockStory = (domain: string): ParsedStory => ({
    domain,
    features: ['authentication'],
    entities: [],
  });

  it('should generate fitness theme', () => {
    const theme = generateTheme(createMockStory('fitness'));
    expect(theme.primaryColor).toBe('#10b981'); // green
    expect(theme.fontFamily).toBe('Inter, system-ui, sans-serif');
  });

  it('should generate finance theme', () => {
    const theme = generateTheme(createMockStory('finance'));
    expect(theme.primaryColor).toBe('#3b82f6'); // blue
    expect(theme.secondaryColor).toBe('#1e40af');
  });

  it('should generate social theme', () => {
    const theme = generateTheme(createMockStory('social'));
    expect(theme.primaryColor).toBe('#8b5cf6'); // violet
    expect(theme.secondaryColor).toBe('#ec4899'); // pink
  });

  it('should generate productivity theme', () => {
    const theme = generateTheme(createMockStory('productivity'));
    expect(theme.primaryColor).toBe('#6366f1'); // indigo
    expect(theme.secondaryColor).toBe('#8b5cf6'); // violet
  });

  it('should generate ecommerce theme', () => {
    const theme = generateTheme(createMockStory('ecommerce'));
    expect(theme.primaryColor).toBe('#f59e0b'); // amber
    expect(theme.secondaryColor).toBe('#dc2626'); // red
  });

  it('should generate education theme', () => {
    const theme = generateTheme(createMockStory('education'));
    expect(theme.primaryColor).toBe('#0ea5e9'); // sky
    expect(theme.secondaryColor).toBe('#8b5cf6'); // violet
  });

  it('should fallback to general theme for unknown domain', () => {
    const theme = generateTheme(createMockStory('unknown'));
    expect(theme.primaryColor).toBe('#6366f1'); // indigo (general)
    expect(theme.fontFamily).toBe('Inter, system-ui, sans-serif');
  });

  it('should always include all required theme properties', () => {
    const theme = generateTheme(createMockStory('fitness'));
    expect(theme).toHaveProperty('primaryColor');
    expect(theme).toHaveProperty('secondaryColor');
    expect(theme).toHaveProperty('accentColor');
    expect(theme).toHaveProperty('fontFamily');
  });

  it('should use consistent color format (hex)', () => {
    const theme = generateTheme(createMockStory('fitness'));
    expect(theme.primaryColor).toMatch(/^#[0-9a-f]{6}$/i);
    expect(theme.secondaryColor).toMatch(/^#[0-9a-f]{6}$/i);
    expect(theme.accentColor).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
