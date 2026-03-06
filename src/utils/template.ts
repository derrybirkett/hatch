import path from 'path';
import fs from 'fs-extra';
import ejs from 'ejs';

/**
 * Render an EJS template and write to file
 */
export async function renderTemplate(
  templatePath: string,
  outputPath: string,
  data: object
): Promise<void> {
  if (await fs.pathExists(templatePath)) {
    const template = await fs.readFile(templatePath, 'utf-8');
    const rendered = ejs.render(template, data);
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, rendered);
  }
}

/**
 * Recursively copy directory and render all files as EJS templates
 */
export async function copyDirWithTemplates(
  srcDir: string,
  destDir: string,
  templateData: object
): Promise<void> {
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
