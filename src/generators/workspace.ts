import path from 'path';
import fs from 'fs-extra';
import { execa } from 'execa';
import ora from 'ora';
import ejs from 'ejs';
import { ParsedStory } from '../parsers/story-parser';
import { Theme } from '../parsers/theme-generator';
import { generateLibrary } from './library';
import { generateApp } from './app';

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
    throw new Error(`Directory '${config.projectName}' already exists`);
  }

  // Validate project name
  if (!/^[a-z0-9-]+$/.test(config.projectName)) {
    throw new Error('Project name must contain only lowercase letters, numbers, and hyphens');
  }
  
  try {
    // Create project directory
    await fs.ensureDir(projectPath);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('EACCES')) {
        throw new Error('Permission denied: Cannot create project directory. Check your permissions.');
      } else if (error.message.includes('ENOSPC')) {
        throw new Error('Not enough disk space to create project.');
      }
    }
    throw new Error(`Failed to create project directory: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  try {
    // Generate base structure
    await generateBaseStructure(projectPath, config);
  } catch (error) {
    throw new Error(`Failed to generate base structure: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  // Generate shared libraries
  const libSpinner = ora('Generating shared libraries...').start();
  try {
    await generateLibrary({
      projectName: config.projectName,
      projectPath,
      libraryName: 'shared',
      libraryType: 'shared',
    });
    
    await generateLibrary({
      projectName: config.projectName,
      projectPath,
      libraryName: 'auth',
      libraryType: 'auth',
    });
    
    await generateLibrary({
      projectName: config.projectName,
      projectPath,
      libraryName: 'ui',
      libraryType: 'ui',
    });
    
    libSpinner.succeed('Shared libraries generated (shared, auth, ui)');
  } catch (error) {
    libSpinner.fail('Failed to generate libraries');
    throw new Error(`Library generation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  // Generate apps
  const appSpinner = ora('Generating applications...').start();
  try {
    await generateApp({
      projectName: config.projectName,
      projectPath,
      appName: 'website',
      appType: 'website',
    });
    
    await generateApp({
      projectName: config.projectName,
      projectPath,
      appName: 'dashboard',
      appType: 'dashboard',
    });
    
    await generateApp({
      projectName: config.projectName,
      projectPath,
      appName: 'api',
      appType: 'api',
    });
    
    appSpinner.succeed('Applications generated (website, dashboard, api)');
  } catch (error) {
    appSpinner.fail('Failed to generate applications');
    throw new Error(`Application generation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  // Generate E2E tests
  const e2eSpinner = ora('Generating E2E tests...').start();
  try {
    await generateE2ETests(projectPath, config);
    e2eSpinner.succeed('E2E tests generated with Playwright');
  } catch (error) {
    e2eSpinner.fail('Failed to generate E2E tests');
    throw new Error(`E2E test generation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  // Install dependencies
  if (config.install) {
    const spinner = ora('Installing dependencies (this may take a few minutes)...').start();
    try {
      await installDependencies(projectPath);
      spinner.succeed('Dependencies installed successfully');
    } catch (error) {
      spinner.fail('Failed to install dependencies');
      throw new Error(`npm install failed: ${error instanceof Error ? error.message : String(error)}. You can install them manually later.`);
    }
  }
  
  // Initialize git
  if (config.git) {
    const spinner = ora('Initializing git repository...').start();
    try {
      await initGit(projectPath);
      spinner.succeed('Git repository initialized');
    } catch (error) {
      spinner.warn('Git initialization skipped (git not found or not configured)');
      // Don't throw error, just warn - git is optional
    }
  }
}

async function generateBaseStructure(
  projectPath: string,
  config: WorkspaceConfig
) {
  const templatesDir = path.join(__dirname, '../../templates/workspace');
  
  // Create Nx workspace directory structure
  await fs.ensureDir(path.join(projectPath, 'apps'));
  await fs.ensureDir(path.join(projectPath, 'libs'));
  await fs.ensureDir(path.join(projectPath, 'tools'));
  await fs.ensureDir(path.join(projectPath, 'e2e'));
  
  // Template data for EJS rendering
  const templateData = {
    projectName: config.projectName,
    description: config.description,
    story: config.story,
    author: config.author,
    parsedStory: config.parsedStory,
    theme: config.theme,
  };
  
  // Render and write configuration files
  await renderTemplate(
    path.join(templatesDir, 'package.json.ejs'),
    path.join(projectPath, 'package.json'),
    templateData
  );
  
  await renderTemplate(
    path.join(templatesDir, 'nx.json.ejs'),
    path.join(projectPath, 'nx.json'),
    templateData
  );
  
  await renderTemplate(
    path.join(templatesDir, 'tsconfig.base.json.ejs'),
    path.join(projectPath, 'tsconfig.base.json'),
    templateData
  );
  
  await renderTemplate(
    path.join(templatesDir, 'README.md.ejs'),
    path.join(projectPath, 'README.md'),
    templateData
  );
  
  await renderTemplate(
    path.join(templatesDir, 'prettierrc.ejs'),
    path.join(projectPath, '.prettierrc'),
    templateData
  );
  
  await renderTemplate(
    path.join(templatesDir, 'eslintrc.json.ejs'),
    path.join(projectPath, '.eslintrc.json'),
    templateData
  );
  
  await renderTemplate(
    path.join(templatesDir, 'gitignore.ejs'),
    path.join(projectPath, '.gitignore'),
    templateData
  );
  
  await renderTemplate(
    path.join(templatesDir, 'env.example.ejs'),
    path.join(projectPath, '.env.example'),
    templateData
  );
  
  // Create .nvmrc for Node version management
  await renderTemplate(
    path.join(templatesDir, 'nvmrc.ejs'),
    path.join(projectPath, '.nvmrc'),
    templateData
  );
  
  // Create VSCode workspace settings
  await fs.ensureDir(path.join(projectPath, '.vscode'));
  await renderTemplate(
    path.join(templatesDir, 'vscode-extensions.json.ejs'),
    path.join(projectPath, '.vscode/extensions.json'),
    templateData
  );
  await renderTemplate(
    path.join(templatesDir, 'vscode-settings.json.ejs'),
    path.join(projectPath, '.vscode/settings.json'),
    templateData
  );
  
  // Create DevOps files (Docker, CI/CD)
  await renderTemplate(
    path.join(templatesDir, 'docker-compose.yml.ejs'),
    path.join(projectPath, 'docker-compose.yml'),
    templateData
  );
  
  await renderTemplate(
    path.join(templatesDir, '.dockerignore.ejs'),
    path.join(projectPath, '.dockerignore'),
    templateData
  );
  
  await renderTemplate(
    path.join(templatesDir, 'DEPLOYMENT.md.ejs'),
    path.join(projectPath, 'DEPLOYMENT.md'),
    templateData
  );
  
  // Create GitHub Actions workflows
  await fs.ensureDir(path.join(projectPath, '.github/workflows'));
  await renderTemplate(
    path.join(templatesDir, '.github/workflows/ci.yml.ejs'),
    path.join(projectPath, '.github/workflows/ci.yml'),
    templateData
  );
  await renderTemplate(
    path.join(templatesDir, '.github/workflows/deploy.yml.ejs'),
    path.join(projectPath, '.github/workflows/deploy.yml'),
    templateData
  );
  
  // Create placeholder README files for directory structure
  await createPlaceholderReadme(path.join(projectPath, 'apps'), 'Applications');
  await createPlaceholderReadme(path.join(projectPath, 'libs'), 'Shared Libraries');
  await createPlaceholderReadme(path.join(projectPath, 'tools'), 'Custom Tools and Generators');
}

/**
 * Generate E2E tests with Playwright
 */
async function generateE2ETests(projectPath: string, config: WorkspaceConfig) {
  const e2ePath = path.join(projectPath, 'e2e');
  const templatesDir = path.join(__dirname, '../../templates/e2e');
  
  // Template data
  const templateData = {
    projectName: config.projectName,
    description: config.description,
  };
  
  // Copy E2E test files
  await renderTemplate(
    path.join(templatesDir, 'package.json.ejs'),
    path.join(e2ePath, 'package.json'),
    templateData
  );
  
  await renderTemplate(
    path.join(templatesDir, 'project.json.ejs'),
    path.join(e2ePath, 'project.json'),
    templateData
  );
  
  await renderTemplate(
    path.join(templatesDir, 'playwright.config.ts.ejs'),
    path.join(e2ePath, 'playwright.config.ts'),
    templateData
  );
  
  await renderTemplate(
    path.join(templatesDir, 'README.md.ejs'),
    path.join(e2ePath, 'README.md'),
    templateData
  );
  
  await fs.copy(
    path.join(templatesDir, '.gitignore'),
    path.join(e2ePath, '.gitignore')
  );
  
  // Copy test files
  const testsDir = path.join(templatesDir, 'tests');
  const destTestsDir = path.join(e2ePath, 'tests');
  await fs.ensureDir(destTestsDir);
  
  const testFiles = await fs.readdir(testsDir);
  for (const file of testFiles) {
    const sourcePath = path.join(testsDir, file);
    const destPath = path.join(destTestsDir, file);
    const content = await fs.readFile(sourcePath, 'utf-8');
    const rendered = ejs.render(content, templateData);
    await fs.writeFile(destPath, rendered);
  }
}

/**
 * Render an EJS template and write to file
 */
async function renderTemplate(
  templatePath: string,
  outputPath: string,
  data: object
) {
  const template = await fs.readFile(templatePath, 'utf-8');
  const rendered = ejs.render(template, data);
  await fs.writeFile(outputPath, rendered);
}

/**
 * Create a placeholder README in empty directories
 */
async function createPlaceholderReadme(dirPath: string, title: string) {
  const readme = `# ${title}

This directory will contain ${title.toLowerCase()}.

> Generated by Hatch
`;
  await fs.writeFile(path.join(dirPath, 'README.md'), readme);
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
