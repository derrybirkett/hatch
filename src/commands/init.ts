import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { generateWorkspace } from '../generators/workspace';
import { parseUserStory } from '../parsers/story-parser';
import { generateTheme } from '../parsers/theme-generator';

interface InitOptions {
  story?: string;
  install: boolean;
  git: boolean;
}

export async function initCommand(
  projectName?: string,
  options: InitOptions = { install: true, git: true }
) {
  console.log(chalk.blue.bold('\n🐣 Welcome to Hatch!\n'));
  console.log(chalk.gray('Bootstrap production-ready SaaS applications in minutes.\n'));

  // Gather project info
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: projectName || 'my-saas-app',
      when: !projectName,
      validate: (input: string) => {
        if (/^[a-z0-9-]+$/.test(input)) {
          return true;
        }
        return 'Project name must contain only lowercase letters, numbers, and hyphens';
      },
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
      default:
        'A simple SaaS application with authentication and billing',
      when: !options.story,
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author name:',
      default: 'Your Name',
    },
  ]);

  const config = {
    projectName: projectName || answers.projectName,
    description: answers.description,
    story: options.story || answers.story,
    author: answers.author,
  };

  // Parse user story
  const spinner = ora('Analyzing user story...').start();
  const parsedStory = parseUserStory(config.story);
  const theme = generateTheme(parsedStory);
  spinner.succeed('User story analyzed');

  // Generate workspace
  spinner.start('Generating workspace...');
  try {
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
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }

  // Success message
  console.log(chalk.green.bold('\n✨ Project created successfully!\n'));
  console.log(chalk.cyan('Next steps:'));
  console.log(chalk.gray(`  cd ${config.projectName}`));
  if (!options.install) {
    console.log(chalk.gray('  npm install'));
  }
  console.log(chalk.gray('  npm run dev\n'));
  
  console.log(chalk.dim('Generated with ❤️  by Hatch'));
}
