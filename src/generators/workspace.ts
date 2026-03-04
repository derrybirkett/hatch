import path from 'path';
import fs from 'fs-extra';
import { execa } from 'execa';
import ora from 'ora';
import { ParsedStory } from '../parsers/story-parser';
import { Theme } from '../parsers/theme-generator';

export interface WorkspaceConfig {
  projectName: string;
  description: string;
  story: string;
  author: string;
  parsedStory: ParsedStory;
  theme: Theme;
  install: boolean;
  git: boolean;
}

export async function generateWorkspace(config: WorkspaceConfig) {
  const projectPath = path.join(process.cwd(), config.projectName);
  
  // Check if directory already exists
  if (await fs.pathExists(projectPath)) {
    throw new Error(`Directory ${config.projectName} already exists`);
  }
  
  // Create project directory
  await fs.ensureDir(projectPath);
  
  // Generate base structure
  await generateBaseStructure(projectPath, config);
  
  // Install dependencies
  if (config.install) {
    const spinner = ora('Installing dependencies...').start();
    try {
      await installDependencies(projectPath);
      spinner.succeed('Dependencies installed');
    } catch (error) {
      spinner.fail('Failed to install dependencies');
      throw error;
    }
  }
  
  // Initialize git
  if (config.git) {
    const spinner = ora('Initializing git repository...').start();
    try {
      await initGit(projectPath);
      spinner.succeed('Git repository initialized');
    } catch (error) {
      spinner.warn('Git initialization skipped (git not available)');
    }
  }
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
      dev: 'echo "Development server coming soon..."',
      build: 'echo "Build coming soon..."',
      test: 'echo "Tests coming soon..."',
    },
    keywords: config.parsedStory.features,
    author: config.author,
    license: 'MIT',
  };
  
  await fs.writeJSON(
    path.join(projectPath, 'package.json'),
    packageJson,
    { spaces: 2 }
  );
  
  const readme = `# ${config.projectName}

${config.description}

> Generated with [Hatch](https://github.com/yourusername/hatch) 🐣

## User Story

${config.story}

## Project Details

- **Domain**: ${config.parsedStory.domain}
- **Features**: ${config.parsedStory.features.join(', ')}

## Theme

- **Primary Color**: ${config.theme.primaryColor}
- **Secondary Color**: ${config.theme.secondaryColor}
- **Accent Color**: ${config.theme.accentColor}
- **Font Family**: ${config.theme.fontFamily}

## Getting Started

\`\`\`bash
# Install dependencies (if not already done)
npm install

# Start development servers
npm run dev
\`\`\`

## Project Structure

\`\`\`
${config.projectName}/
├── apps/              # Applications (website, dashboard, blog, docs, api)
├── libs/              # Shared libraries (ui, auth, billing, shared)
├── e2e/               # End-to-end tests
└── tools/             # Build tools and generators
\`\`\`

## Generated Features

${config.parsedStory.features.map((f) => `- **${f}**: Ready to customize`).join('\n')}

## Next Steps

1. ⚡ Customize your theme colors
2. 🏗️  Add custom features specific to your needs
3. 🧪 Run tests: \`npm test\`
4. 🚀 Deploy to production

## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS, shadcn/ui
- **Backend**: NestJS, Prisma, PostgreSQL
- **Testing**: Playwright, Vitest
- **Deployment**: Ready for Vercel, Railway, Docker

---

Built with ❤️  using Hatch
`;
  
  await fs.writeFile(path.join(projectPath, 'README.md'), readme);
  
  // Create .gitignore
  const gitignore = `# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
.next/
out/

# Environment variables
.env
.env*.local

# Testing
coverage/
.nyc_output/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# Misc
.cache/
temp/
`;
  
  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);
  
  // Create basic .env.example
  const envExample = `# Database
DATABASE_URL="postgresql://user:password@localhost:5432/${config.projectName}"

# API Configuration
API_PORT=3333
API_URL="http://localhost:3333"
NODE_ENV="development"

# JWT Configuration
JWT_SECRET="change-me-in-production"
JWT_EXPIRES_IN="7d"

# Stripe (optional - add your keys)
STRIPE_PUBLIC_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Frontend URLs
WEBSITE_URL="http://localhost:3000"
DASHBOARD_URL="http://localhost:4200"
`;
  
  await fs.writeFile(path.join(projectPath, '.env.example'), envExample);
}

async function installDependencies(projectPath: string) {
  await execa('npm', ['install'], { cwd: projectPath });
}

async function initGit(projectPath: string) {
  await execa('git', ['init'], { cwd: projectPath });
  await execa('git', ['add', '.'], { cwd: projectPath });
  await execa(
    'git',
    ['commit', '-m', 'Initial commit from Hatch 🐣'],
    { cwd: projectPath }
  );
}
