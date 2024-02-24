import fs from 'fs';
import path from 'path';
import { merge } from 'ts-deepmerge';

import { dirCopy, isBinaryFile } from './utils';

interface ProjectOptions {
  projectName: string;
  appType: string;
  script: string;
  framework: string;
  components: string[];
}

type AnyObj = { key: string; value: any };
const mergeJson = (srcPath: string, toPath: string) => {
  const stringify = require('json-stable-stringify');
  const newJson = JSON.parse(fs.readFileSync(srcPath, { encoding: 'utf8' }));
  const baseJson = JSON.parse(fs.readFileSync(toPath, { encoding: 'utf8' }));
  const newObject = merge(baseJson, newJson);
  const newObjectJson = `${stringify(newObject, {
    cmp: (a: AnyObj, b: AnyObj) => {
      const aType = typeof a.value;
      const bType = typeof b.value;
      if (aType !== 'object' && bType === 'object') {
        return -1;
      }
      if (aType === 'object' && bType !== 'object') {
        return 1;
      }
      return a.key.localeCompare(b.key);
    },
    space: 2,
  })}\n`;
  // const newObjectJson = JSON.stringify(newObject, undefined, 2);
  fs.writeFileSync(toPath, newObjectJson, { encoding: 'utf8' });
};

const mergeCopy = async (templatePath: string, projectPath: string) => {
  dirCopy(templatePath, projectPath, (srcPath, toPath) => {
    if (srcPath.endsWith('package.json')) {
      mergeJson(srcPath, toPath);
      return true;
    } else if (srcPath.endsWith('tsconfig.json')) {
      mergeJson(srcPath, toPath);
      return true;
    }
    return false;
  });
};

const generateProject = async (
  templatePath: string,
  templateSourcePath: string,
  projectPath: string,
  options: ProjectOptions,
) => {
  if (!fs.existsSync(templateSourcePath)) {
    throw new Error(`template missing: ${templateSourcePath}`);
  }
  const REPLACE_REG = /{{PROJECT_NAME}}/g;
  dirCopy(templateSourcePath, projectPath, (srcPath, toPath) => {
    if (!isBinaryFile(srcPath)) {
      const data = fs.readFileSync(srcPath, { encoding: 'utf8' });
      const newData = data.replace(REPLACE_REG, options.projectName);
      fs.writeFileSync(toPath, newData, { encoding: 'utf8' });
      return true;
    }
    return false;
  });
  const frameworkPath = path.resolve(
    templatePath,
    `diff-merge/${options.framework}-${options.script}`,
  );
  await mergeCopy(frameworkPath, projectPath);
  for (let i = 0; i < options.components.length; i++) {
    const component = options.components[i];
    const componentPath = path.resolve(templatePath, `diff-merge/${component}`);
    const componentScriptPath = path.resolve(
      templatePath,
      `diff-merge/${component}-${options.script}`,
    );
    if (fs.existsSync(componentPath)) {
      await mergeCopy(componentPath, projectPath);
    }
    if (fs.existsSync(componentScriptPath)) {
      await mergeCopy(componentScriptPath, projectPath);
    }
  }
};

const create = async (options: ProjectOptions) => {
  const currentPath = process.cwd();
  const targetProjectPath = path.resolve(currentPath, options.projectName);
  if (fs.existsSync(targetProjectPath)) {
    throw new Error(`folder: '${options.projectName}' already exists`);
  }
  const templatePath = path.resolve(__dirname, '../template');
  const templateName = `${options.appType}-${options.script}`;
  const templateSourcePath = path.join(templatePath, templateName);
  await generateProject(templatePath, templateSourcePath, targetProjectPath, options);
};

export { create };
