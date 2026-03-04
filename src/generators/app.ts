import path from 'path';
import fs from 'fs-extra';
import ejs from 'ejs';

export interface AppConfig {
  projectName: string;
  projectPath: string;
  appName: string;
  appType: 'dashboard' | 'website' | 'api';
}

/**
 * Generate an application in the Nx workspace
 */
export async function generateApp(config: AppConfig) {
  const appPath = path.join(config.projectPath, 'apps', config.appName);
  const templatesDir = path.join(__dirname, '../../templates/apps', config.appType);
  
  // Create app directory structure
  await fs.ensureDir(path.join(appPath, 'src'));
  
  // Template data
  const templateData = {
    projectName: config.projectName,
    appName: config.appName,
    appType: config.appType,
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
async function copyAppSource(templatesDir: string, appPath: string, appType: string, templateData: object) {
  const srcDir = path.join(templatesDir, 'src');
  const destDir = path.join(appPath, 'src');
  
  if (await fs.pathExists(srcDir)) {
    await copyDirWithTemplates(srcDir, destDir, templateData);
  }
}

/**
 * Copy app config files
 */
async function copyAppConfig(templatesDir: string, appPath: string, templateData: object) {
  const configFiles = ['vite.config.ts.ejs', 'index.html.ejs', '.env.example.ejs', 'tailwind.config.js.ejs', 'postcss.config.js.ejs'];
  
  for (const file of configFiles) {
    const sourcePath = path.join(templatesDir, file);
    const destPath = path.join(appPath, file.replace('.ejs', ''));
    
    if (await fs.pathExists(sourcePath)) {
      await renderTemplate(sourcePath, destPath, templateData);
    }
  }
}

/**
 * Recursively copy directory and render all files as EJS templates
 */
async function copyDirWithTemplates(srcDir: string, destDir: string, templateData: object) {
  await fs.ensureDir(destDir);
  
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  
  for (const entry of entries) {
    const sourcePath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    
    if (entry.isDirectory()) {
      await copyDirWithTemplates(sourcePath, destPath, templateData);
    } else if (entry.isFile()) {
      const content = await fs.readFile(sourcePath, 'utf-8');
      const rendered = ejs.render(content, templateData);
      await fs.writeFile(destPath, rendered);
    }
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
  if (await fs.pathExists(templatePath)) {
    const template = await fs.readFile(templatePath, 'utf-8');
    const rendered = ejs.render(template, data);
    await fs.writeFile(outputPath, rendered);
  }
}
