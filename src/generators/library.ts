import path from 'path';
import fs from 'fs-extra';
import ejs from 'ejs';

export interface LibraryConfig {
  projectName: string;
  projectPath: string;
  libraryName: string;
  libraryType: 'ui' | 'auth' | 'billing' | 'shared';
}

/**
 * Generate a shared library in the Nx workspace
 */
export async function generateLibrary(config: LibraryConfig) {
  const libPath = path.join(config.projectPath, 'libs', config.libraryName);
  const templatesDir = path.join(__dirname, '../../templates/libs', config.libraryType);
  
  // Create library directory structure
  await fs.ensureDir(path.join(libPath, 'src'));
  await fs.ensureDir(path.join(libPath, 'src/lib'));
  
  // Template data
  const templateData = {
    projectName: config.projectName,
    libraryName: config.libraryName,
    libraryType: config.libraryType,
  };
  
  // Generate project.json
  await renderTemplate(
    path.join(templatesDir, 'project.json.ejs'),
    path.join(libPath, 'project.json'),
    templateData
  );
  
  // Generate tsconfig.json
  await renderTemplate(
    path.join(templatesDir, 'tsconfig.json.ejs'),
    path.join(libPath, 'tsconfig.json'),
    templateData
  );
  
  // Generate tsconfig.lib.json
  await renderTemplate(
    path.join(templatesDir, 'tsconfig.lib.json.ejs'),
    path.join(libPath, 'tsconfig.lib.json'),
    templateData
  );
  
  // Generate package.json
  await renderTemplate(
    path.join(templatesDir, 'package.json.ejs'),
    path.join(libPath, 'package.json'),
    templateData
  );
  
  // Generate README.md
  await renderTemplate(
    path.join(templatesDir, 'README.md.ejs'),
    path.join(libPath, 'README.md'),
    templateData
  );
  
  // Generate src/index.ts
  await renderTemplate(
    path.join(templatesDir, 'src/index.ts.ejs'),
    path.join(libPath, 'src/index.ts'),
    templateData
  );
  
  // Copy library-specific source files
  await copyLibrarySource(templatesDir, libPath, config.libraryType);
}

/**
 * Copy library-specific source files
 */
async function copyLibrarySource(templatesDir: string, libPath: string, libraryType: string) {
  const srcLibDir = path.join(templatesDir, 'src/lib');
  const destLibDir = path.join(libPath, 'src/lib');
  
  if (await fs.pathExists(srcLibDir)) {
    await fs.copy(srcLibDir, destLibDir, { overwrite: true });
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
