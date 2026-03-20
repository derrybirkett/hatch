import path from 'path';
import fs from 'fs-extra';
import { renderTemplate, copyDirWithTemplates } from '../utils/template';

export interface AppConfig {
  projectName: string;
  projectPath: string;
  appName: string;
  appType: 'dashboard' | 'website' | 'api';
  description?: string;
}

/**
 * Generate an application in the Nx workspace
 */
export async function generateApp(config: AppConfig) {
  const appPath = path.join(config.projectPath, 'apps', config.appName);
  const templatesDir = path.join(
    __dirname,
    '../../templates/apps',
    config.appType
  );

  // Create app directory structure
  await fs.ensureDir(path.join(appPath, 'src'));

  // Template data
  const templateData = {
    projectName: config.projectName,
    appName: config.appName,
    appType: config.appType,
    description: config.description || 'A SaaS application',
  };

  // Generate project.json
  await renderTemplate(
    path.join(templatesDir, 'project.json.ejs'),
    path.join(appPath, 'project.json'),
    templateData
  );

  // Generate tsconfig files
  await renderTemplate(
    path.join(templatesDir, 'tsconfig.json.ejs'),
    path.join(appPath, 'tsconfig.json'),
    templateData
  );

  await renderTemplate(
    path.join(templatesDir, 'tsconfig.app.json.ejs'),
    path.join(appPath, 'tsconfig.app.json'),
    templateData
  );

  // Generate package.json if exists
  const packageJsonPath = path.join(templatesDir, 'package.json.ejs');
  if (await fs.pathExists(packageJsonPath)) {
    await renderTemplate(
      packageJsonPath,
      path.join(appPath, 'package.json'),
      templateData
    );
  }

  // Generate README
  await renderTemplate(
    path.join(templatesDir, 'README.md.ejs'),
    path.join(appPath, 'README.md'),
    templateData
  );

  // Copy app-specific source files
  await copyAppSource(templatesDir, appPath, config.appType, templateData);

  // Copy config files (vite.config.ts, index.html, etc.)
  await copyAppConfig(templatesDir, appPath, templateData);
}

/**
 * Copy app-specific source files
 */
async function copyAppSource(
  templatesDir: string,
  appPath: string,
  appType: string,
  templateData: object
) {
  // For Next.js website, copy the 'app' directory (App Router)
  if (appType === 'website') {
    const appDir = path.join(templatesDir, 'app');
    const destDir = path.join(appPath, 'app');

    if (await fs.pathExists(appDir)) {
      await copyDirWithTemplates(appDir, destDir, templateData);
    }
  } else {
    // For other apps (dashboard, api), copy the 'src' directory
    const srcDir = path.join(templatesDir, 'src');
    const destDir = path.join(appPath, 'src');

    if (await fs.pathExists(srcDir)) {
      await copyDirWithTemplates(srcDir, destDir, templateData);
    }
  }
}

/**
 * Copy app config files
 */
async function copyAppConfig(
  templatesDir: string,
  appPath: string,
  templateData: object
) {
  const configFiles = [
    'vite.config.ts.ejs',
    'index.html.ejs',
    '.env.example.ejs',
    'tailwind.config.js.ejs',
    'postcss.config.js.ejs',
    'next.config.js.ejs',
    'webpack.config.js.ejs',
    'vercel.json.ejs',
    'Dockerfile',
    'nginx.conf',
  ];

  for (const file of configFiles) {
    const sourcePath = path.join(templatesDir, file);
    const destPath = path.join(appPath, file.replace('.ejs', ''));

    if (await fs.pathExists(sourcePath)) {
      // If it's an EJS template, render it
      if (file.endsWith('.ejs')) {
        await renderTemplate(sourcePath, destPath, templateData);
      } else {
        // If it's not an EJS template, just copy it
        await fs.copy(sourcePath, destPath);
      }
    }
  }

  // Create public directory for website app (required for Next.js)
  const templatesDirBase = path.dirname(templatesDir);
  const appType = path.basename(templatesDir);
  if (appType === 'website') {
    await fs.ensureDir(path.join(appPath, 'public'));
  }
}
