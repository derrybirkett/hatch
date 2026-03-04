# Getting Started with Hatch Development

This guide will help you start building the Hatch CLI tool.

---

## Prerequisites

- Node.js 18+ and pnpm installed
- PostgreSQL (for testing generated apps)
- Docker (optional, for containerization)
- Basic TypeScript knowledge

---

## Quick Start

### Step 1: Initialize the CLI Project

```bash
cd /Users/dbirkett/Projects/hatch

# Initialize package.json
pnpm init

# Install core dependencies
pnpm add commander inquirer chalk ora execa fs-extra ejs zod cosmiconfig

# Install dev dependencies
pnpm add -D typescript @types/node @types/inquirer @types/fs-extra \
  @types/ejs ts-node nodemon prettier eslint @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin

# Initialize TypeScript
npx tsc --init
```

### Step 2: Create Project Structure

```bash
mkdir -p src/{commands,generators,templates,parsers,utils}
mkdir -p templates/{workspace,apps,libs,configs}
mkdir -p test
```

### Step 3: Configure package.json

```json
{
  "name": "hatch-cli",
  "version": "0.1.0",
  "description": "Bootstrap SaaS applications from user stories",
  "main": "dist/index.js",
  "bin": {
    "hatch": "./dist/index.js"
  },
  "scripts": {
    "dev": "nodemon --watch src --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write \"src/**/*.ts\"",
    "prepublishOnly": "pnpm build"
  },
  "keywords": ["cli", "saas", "bootstrap", "generator", "nx"],
  "author": "Your Name",
  "license": "MIT"
}
```

### Step 4: Configure TypeScript

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test"]
}
```

---

## Minimal Working Implementation

### src/index.ts
```typescript
#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init';
import { version } from '../package.json';

const program = new Command();

program
  .name('hatch')
  .description('Bootstrap SaaS applications from user stories')
  .version(version);

program
  .command('init [project-name]')
  .description('Initialize a new SaaS project')
  .option('-s, --story <story>', 'User story describing the app')
  .option('--no-install', 'Skip installing dependencies')
  .action(initCommand);

program.parse();
```

### src/commands/init.ts
```typescript
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { generateWorkspace } from '../generators/workspace';
import { parseUserStory } from '../parsers/story-parser';
import { generateTheme } from '../parsers/theme-generator';

interface InitOptions {
  story?: string;
  install: boolean;
}

export async function initCommand(
  projectName?: string,
  options: InitOptions = { install: true }
) {
  console.log(chalk.blue.bold('\n🐣 Welcome to Hatch!\n'));

  // Gather project info
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: projectName || 'my-saas-app',
      when: !projectName,
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description:',
      default: 'A SaaS application',
    },
    {
      type: 'input',
      name: 'story',
      message: 'User story (describe your app):',
      default: 'A simple SaaS application with authentication and billing',
      when: !options.story,
    },
  ]);

  const config = {
    projectName: projectName || answers.projectName,
    description: answers.description,
    story: options.story || answers.story,
  };

  // Parse user story
  const spinner = ora('Analyzing user story...').start();
  const parsedStory = parseUserStory(config.story);
  const theme = generateTheme(parsedStory);
  spinner.succeed('User story analyzed');

  // Generate workspace
  spinner.start('Generating workspace...');
  await generateWorkspace({
    ...config,
    parsedStory,
    theme,
    install: options.install,
  });
  spinner.succeed('Workspace generated');

  // Success message
  console.log(chalk.green.bold('\n✨ Project created successfully!\n'));
  console.log(chalk.cyan('Next steps:'));
  console.log(chalk.gray(`  cd ${config.projectName}`));
  if (!options.install) {
    console.log(chalk.gray('  pnpm install'));
  }
  console.log(chalk.gray('  pnpm dev\n'));
}
```

### src/parsers/story-parser.ts
```typescript
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
  const domainKeywords = {
    fitness: ['fitness', 'workout', 'exercise', 'health'],
    finance: ['finance', 'money', 'budget', 'expense'],
    social: ['social', 'friend', 'chat', 'message'],
    productivity: ['task', 'todo', 'project', 'note'],
  };
  
  let domain = 'general';
  for (const [key, keywords] of Object.entries(domainKeywords)) {
    if (keywords.some(kw => words.includes(kw))) {
      domain = key;
      break;
    }
  }
  
  // Extract potential entities (nouns)
  // This is simplified - in production, use proper NLP
  const commonNouns = ['user', 'profile', 'account', 'setting'];
  const entities = commonNouns.map(noun => ({
    name: noun.charAt(0).toUpperCase() + noun.slice(1),
    fields: [
      { name: 'id', type: 'String' },
      { name: 'createdAt', type: 'DateTime' },
    ],
  }));
  
  // Extract features
  const features = ['authentication', 'billing', 'profile'];
  
  return { entities, features, domain };
}
```

### src/parsers/theme-generator.ts
```typescript
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
      primaryColor: '#10b981', // green
      secondaryColor: '#3b82f6', // blue
      accentColor: '#f59e0b',   // amber
      fontFamily: 'Inter, sans-serif',
    },
    finance: {
      primaryColor: '#3b82f6', // blue
      secondaryColor: '#1e40af', // dark blue
      accentColor: '#10b981',   // green
      fontFamily: 'Inter, sans-serif',
    },
    social: {
      primaryColor: '#8b5cf6', // purple
      secondaryColor: '#ec4899', // pink
      accentColor: '#f59e0b',   // amber
      fontFamily: 'Inter, sans-serif',
    },
    general: {
      primaryColor: '#6366f1', // indigo
      secondaryColor: '#8b5cf6', // purple
      accentColor: '#10b981',   // green
      fontFamily: 'Inter, sans-serif',
    },
  };
  
  return colorSchemes[story.domain] || colorSchemes.general;
}
```

### src/generators/workspace.ts
```typescript
import path from 'path';
import fs from 'fs-extra';
import { execa } from 'execa';
import { ParsedStory } from '../parsers/story-parser';
import { Theme } from '../parsers/theme-generator';

interface WorkspaceConfig {
  projectName: string;
  description: string;
  story: string;
  parsedStory: ParsedStory;
  theme: Theme;
  install: boolean;
}

export async function generateWorkspace(config: WorkspaceConfig) {
  const projectPath = path.join(process.cwd(), config.projectName);
  
  // Create project directory
  await fs.ensureDir(projectPath);
  
  // Generate base structure
  await generateBaseStructure(projectPath, config);
  
  // Install dependencies
  if (config.install) {
    await installDependencies(projectPath);
  }
  
  // Initialize git
  await initGit(projectPath);
}

async function generateBaseStructure(
  projectPath: string,
  config: WorkspaceConfig
) {
  // For MVP: Create basic package.json and README
  // In full implementation, this will generate entire Nx workspace
  
  const packageJson = {
    name: config.projectName,
    version: '0.1.0',
    description: config.description,
    private: true,
    scripts: {
      dev: 'echo "Development server not yet configured"',
      build: 'echo "Build not yet configured"',
      test: 'echo "Tests not yet configured"',
    },
  };
  
  await fs.writeJSON(
    path.join(projectPath, 'package.json'),
    packageJson,
    { spaces: 2 }
  );
  
  const readme = `# ${config.projectName}

${config.description}

## User Story
${config.story}

## Theme
- Primary Color: ${config.theme.primaryColor}
- Secondary Color: ${config.theme.secondaryColor}
- Font: ${config.theme.fontFamily}

## Getting Started

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

## Generated Features
${config.parsedStory.features.map(f => `- ${f}`).join('\n')}
`;
  
  await fs.writeFile(path.join(projectPath, 'README.md'), readme);
  
  // Create .gitignore
  const gitignore = `node_modules
dist
.env
.env.local
.DS_Store
*.log
`;
  
  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);
}

async function installDependencies(projectPath: string) {
  await execa('pnpm', ['install'], { cwd: projectPath });
}

async function initGit(projectPath: string) {
  try {
    await execa('git', ['init'], { cwd: projectPath });
    await execa('git', ['add', '.'], { cwd: projectPath });
    await execa(
      'git',
      ['commit', '-m', 'Initial commit from Hatch'],
      { cwd: projectPath }
    );
  } catch (error) {
    // Git not installed or other error - continue anyway
  }
}
```

### src/utils/file-system.ts
```typescript
import fs from 'fs-extra';
import path from 'path';
import ejs from 'ejs';

export async function renderTemplate(
  templatePath: string,
  outputPath: string,
  data: Record<string, any>
) {
  const template = await fs.readFile(templatePath, 'utf-8');
  const rendered = ejs.render(template, data);
  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, rendered);
}

export async function copyTemplate(
  sourcePath: string,
  destPath: string
) {
  await fs.copy(sourcePath, destPath);
}
```

---

## Testing the CLI Locally

### 1. Build the CLI
```bash
pnpm build
```

### 2. Link globally (for testing)
```bash
npm link
# or
pnpm link --global
```

### 3. Test the command
```bash
# Create a test project
hatch init test-app --story "A simple task management app"

# Verify it worked
cd test-app
ls -la
cat README.md
```

### 4. Unlink when done
```bash
npm unlink -g hatch-cli
# or
pnpm unlink --global
```

---

## Development Workflow

### 1. Watch mode during development
```bash
pnpm dev init my-test-app
```

### 2. Test changes quickly
```bash
# Terminal 1: Watch and rebuild
pnpm build -- --watch

# Terminal 2: Test the CLI
node dist/index.js init test-app
```

---

## Next Implementation Steps

### Week 1 Tasks
1. ✅ Set up CLI project structure
2. ✅ Implement basic `init` command
3. ✅ Add user story parser (basic version)
4. ✅ Add theme generator
5. ⬜ Create Nx workspace template
6. ⬜ Generate basic Next.js app (website)
7. ⬜ Add `dev` command to run generated apps

### Week 2 Tasks
1. ⬜ Create shadcn/ui component templates
2. ⬜ Generate @hatch/ui library
3. ⬜ Generate @hatch/auth library
4. ⬜ Generate dashboard React app
5. ⬜ Implement login page generator

---

## Debugging Tips

### CLI not found after linking
```bash
# Check where it's linked
which hatch

# Re-link
npm link --force
```

### Template rendering issues
```bash
# Test EJS templates in isolation
node -e "const ejs = require('ejs'); console.log(ejs.render('Hello <%= name %>', {name: 'World'}))"
```

### Dependency installation fails
```bash
# Clear pnpm cache
pnpm store prune

# Try with verbose logging
pnpm install --verbose
```

---

## Resources

- [Commander.js Docs](https://github.com/tj/commander.js)
- [Inquirer.js Examples](https://github.com/SBoudrias/Inquirer.js)
- [Nx Documentation](https://nx.dev)
- [EJS Templates](https://ejs.co/)
- [Zod Validation](https://zod.dev/)

---

## Contributing

Once the basic CLI is working, we can:
1. Add more sophisticated user story parsing
2. Create comprehensive templates for all apps
3. Add more CLI commands (generate, deploy, etc.)
4. Implement proper testing
5. Add documentation generation

---

**Ready to start coding! Run the commands above to begin.** 🚀
