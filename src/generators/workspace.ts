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
    throw new Error(`Directory ${config.projectName} already exists`);
  }
  
  // Create project directory
  await fs.ensureDir(projectPath);
  
  // Generate base structure
  await generateBaseStructure(projectPath, config);
  
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
    throw error;
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
    throw error;
  }
  
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
  
  // Create placeholder README files for directory structure
  await createPlaceholderReadme(path.join(projectPath, 'apps'), 'Applications');
  await createPlaceholderReadme(path.join(projectPath, 'libs'), 'Shared Libraries');
  await createPlaceholderReadme(path.join(projectPath, 'tools'), 'Custom Tools and Generators');
  await createPlaceholderReadme(path.join(projectPath, 'e2e'), 'End-to-End Tests');
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
