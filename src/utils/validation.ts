import { z } from 'zod';

/**
 * Project name validation schema
 * Must be lowercase, alphanumeric with hyphens, 3-50 characters
 */
export const projectNameSchema = z
  .string()
  .min(3, 'Project name must be at least 3 characters long')
  .max(50, 'Project name must be less than 50 characters')
  .regex(
    /^[a-z0-9-]+$/,
    'Project name must contain only lowercase letters, numbers, and hyphens (e.g., my-saas-app)'
  )
  .refine(
    (name) => !name.startsWith('-') && !name.endsWith('-'),
    'Project name cannot start or end with a hyphen'
  )
  .refine(
    (name) => !name.includes('..'),
    'Project name cannot contain path traversal sequences'
  );

/**
 * User story validation schema
 * Must be at least 5 words
 */
export const userStorySchema = z
  .string()
  .min(1, 'User story is required')
  .refine(
    (story) => story.trim().split(/\s+/).length >= 5,
    'Please provide a more detailed user story (at least 5 words)'
  );

/**
 * Description validation schema
 */
export const descriptionSchema = z
  .string()
  .min(1, 'Description is required')
  .max(500, 'Description must be less than 500 characters');

/**
 * Author name validation schema
 */
export const authorSchema = z
  .string()
  .min(1, 'Author name is required')
  .max(100, 'Author name must be less than 100 characters');

/**
 * Init options validation schema
 */
export const initOptionsSchema = z.object({
  story: userStorySchema.optional(),
  description: descriptionSchema.optional(),
  author: authorSchema.optional(),
  install: z.boolean().default(true),
  git: z.boolean().default(true),
});

/**
 * Workspace config validation schema
 */
export const workspaceConfigSchema = z.object({
  projectName: projectNameSchema,
  description: descriptionSchema,
  story: userStorySchema,
  author: authorSchema,
  parsedStory: z.object({
    entities: z.array(
      z.object({
        name: z.string(),
        fields: z.array(
          z.object({
            name: z.string(),
            type: z.string(),
          })
        ),
      })
    ),
    features: z.array(z.string()),
    domain: z.string(),
  }),
  theme: z.object({
    primaryColor: z.string(),
    secondaryColor: z.string(),
    accentColor: z.string(),
    fontFamily: z.string(),
  }),
  install: z.boolean(),
  git: z.boolean(),
});

export type InitOptions = z.infer<typeof initOptionsSchema>;
export type WorkspaceConfig = z.infer<typeof workspaceConfigSchema>;
