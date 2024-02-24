#!/usr/bin/env node
import { checkbox, input, select } from '@inquirer/prompts';

import { create } from './create';

const main = async () => {
  const projectName = await input({
    message: 'Enter Your Project Name',
    default: 'example-refast-project',
  });
  const appType = await select({
    message: 'Choose App Type',
    choices: [{ name: 'web (default)', value: 'web' }, { value: 'tauri' }, { value: 'electron' }],
  });
  const script = await select({
    message: 'Choose Language',
    choices: [{ name: 'typescript (default)', value: 'typescript' }, { value: 'javascript' }],
  });
  const framework = await select({
    message: 'Choose Framework',
    choices: [{ name: 'react (default)', value: 'react' }, { value: 'preact' }],
  });
  const choices = [
    { name: 'prettier', value: 'prettier', checked: true },
    { name: 'husky', value: 'husky', checked: true },
  ];
  if (appType === 'web') {
    choices.push({ name: 'eslint', value: 'eslint', checked: true });
    choices.push({ name: 'vitest', value: 'vitest', checked: true });
  }
  const components = await checkbox({
    message: 'Select Components',
    choices,
  });

  try {
    console.log('please wait...');
    await create({ projectName, appType, script, framework, components });
    console.log(`✅ create done! ${projectName}`);
  } catch (e) {
    console.error(`${e}`);
  }
};

main();
