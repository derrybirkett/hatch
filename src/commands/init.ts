import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { generateWorkspace } from '../generators/workspace';
import { parseUserStory } from '../parsers/story-parser';
import { generateTheme } from '../parsers/theme-generator';

interface InitOptions {
  story?: string;
  description?: string;
  author?: string;
  install: boolean;
  git: boolean;
}

export async function initCommand(
  projectName?: string,
  options: InitOptions = { install: true, git: true }
) {
  try {
    console.log(chalk.blue.bold('\n🐣 Welcome to Hatch!\n'));
    console.log(chalk.gray('Bootstrap production-ready SaaS applications in minutes.\n'));

    // Validate project name if provided
    if (projectName && !/^[a-z0-9-]+$/.test(projectName)) {
      console.error(chalk.red('Error: Project name must contain only lowercase letters, numbers, and hyphens'));
      console.error(chalk.gray('Example: my-saas-app, fitness-tracker, analytics-dashboard'));
      process.exit(1);
    }

    // Gather project info
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: projectName || 'my-saas-app',
        when: !projectName,
        validate: (input: string) => {
          if (!input || input.trim() === '') {
            return 'Project name is required';
          }
          if (!/^[a-z0-9-]+$/.test(input)) {
            return 'Project name must contain only lowercase letters, numbers, and hyphens (e.g., my-saas-app)';
          }
          if (input.length < 3) {
            return 'Project name must be at least 3 characters long';
          }
          if (input.length > 50) {
            return 'Project name must be less than 50 characters';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description:',
        default: 'A SaaS application',
        when: !options.description,
        validate: (input: string) => {
          if (!input || input.trim() === '') {
            return 'Project description is required';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'story',
        message: 'User story (describe your app):',
        default:
          'A simple SaaS application with authentication and billing',
        when: !options.story,
        validate: (input: string) => {
          if (!input || input.trim() === '') {
            return 'User story is required (describe what your app does)';
          }
          if (input.split(' ').length < 5) {
            return 'Please provide a more detailed user story (at least 5 words)';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author name:',
        default: 'Your Name',
        when: !options.author,
        validate: (input: string) => {
          if (!input || input.trim() === '') {
            return 'Author name is required';
          }
          return true;
        },
      },
    ]);

    const config = {
      projectName: projectName || answers.projectName,
      description: options.description || answers.description,
      story: options.story || answers.story,
      author: options.author || answers.author,
    };

    // Parse user story
    const spinner = ora('Analyzing user story...').start();
    try {
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
        git: options.git,
      });
      spinner.succeed('Workspace generated successfully!');
    } catch (error) {
      spinner.fail('Failed to generate workspace');
      
      if (error instanceof Error) {
        // Check for specific error types
        if (error.message.includes('already exists')) {
          console.error(chalk.red(`\nError: Directory '${config.projectName}' already exists.`));
          console.error(chalk.gray('Please choose a different project name or remove the existing directory.'));
        } else if (error.message.includes('EACCES') || error.message.includes('permission denied')) {
          console.error(chalk.red('\nError: Permission denied.'));
          console.error(chalk.gray('You do not have permission to create files in this directory.'));
          console.error(chalk.gray('Try running with appropriate permissions or choose a different location.'));
        } else if (error.message.includes('ENOSPC')) {
          console.error(chalk.red('\nError: Not enough disk space.'));
          console.error(chalk.gray('Free up some disk space and try again.'));
        } else if (error.message.includes('npm') || error.message.includes('install')) {
          console.error(chalk.red('\nError: Failed to install dependencies.'));
          console.error(chalk.gray('You can try installing them manually:'));
          console.error(chalk.gray(`  cd ${config.projectName}`));
          console.error(chalk.gray('  npm install'));
        } else {
          console.error(chalk.red(`\nError: ${error.message}`));
          console.error(chalk.gray('\nIf this problem persists, please report it at:'));
          console.error(chalk.gray('https://github.com/yourusername/hatch/issues'));
        }
      } else {
        console.error(chalk.red('\nAn unexpected error occurred.'));
        console.error(chalk.gray(String(error)));
      }
      
      process.exit(1);
    }

    // Success message
    console.log(chalk.green.bold('\n✨ Project created successfully!\n'));
    console.log(chalk.cyan('📁 Project structure:'));
    console.log(chalk.gray(`  ${config.projectName}/`));
    console.log(chalk.gray('    ├── apps/           (website, dashboard, api)'));
    console.log(chalk.gray('    ├── libs/           (ui, auth, shared)'));
    console.log(chalk.gray('    ├── e2e/            (E2E tests)'));
    console.log(chalk.gray('    └── docker-compose.yml\n'));
    
    console.log(chalk.cyan('🚀 Next steps:'));
    console.log(chalk.gray(`  1. cd ${config.projectName}`));
    if (!options.install) {
      console.log(chalk.gray('  2. npm install'));
      console.log(chalk.gray('  3. npm run dev'));
    } else {
      console.log(chalk.gray('  2. npm run dev'));
    }
    console.log(chalk.gray('\n📖 Your apps will be available at:'));
    console.log(chalk.gray('   • Website:   http://localhost:3001'));
    console.log(chalk.gray('   • Dashboard: http://localhost:3000'));
    console.log(chalk.gray('   • API:       http://localhost:3333\n'));
    
    console.log(chalk.dim('Generated with ❤️  by Hatch'));
    console.log(chalk.dim(`Version ${require('../../package.json').version}\n`));
  } catch (error) {
    // Handle unexpected errors at the top level
    if (error instanceof Error && error.name === 'ExitPromptError') {
      // User cancelled the prompts (Ctrl+C)
      console.log(chalk.yellow('\n\nOperation cancelled by user.'));
      process.exit(0);
    }
    
    console.error(chalk.red('\n❌ An unexpected error occurred:\n'));
    console.error(error instanceof Error ? error.message : String(error));
    console.error(chalk.gray('\nPlease report this issue at: https://github.com/yourusername/hatch/issues'));
    process.exit(1);
  }
}
