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

const webDirMap: { [key: string]: { webDir: string } } = {
  tauri: {
    webDir: 'web',
  },
  electron: {
    webDir: 'src/renderer',
  },
};

const REPLACE_REG = /{{PROJECT_NAME}}/g;

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

const createOtherFile = async (projectPath: string) => {
  const gitignore = `logs
*.log*

node_modules

.eslintcache

# OSX
.DS_Store

dist
out
build
app

.idea

package-lock.json
pnpm-lock.yaml
pnpm-lock.json

*.tsbuildinfo
`;
  const gitignorePath = path.join(projectPath, '.gitignore');
  fs.writeFileSync(gitignorePath, gitignore, { encoding: 'utf8' });
};

const mergeCopy = async (templatePath: string, projectPath: string) => {
  dirCopy(templatePath, projectPath, (srcPath, toPath) => {
    if (srcPath.endsWith('package.json')) {
      if (fs.existsSync(toPath)) {
        mergeJson(srcPath, toPath);
      }
      return true;
    } else if (srcPath.endsWith('tsconfig.json')) {
      if (fs.existsSync(toPath)) {
        mergeJson(srcPath, toPath);
      }
      return true;
    } else if (srcPath.endsWith('tsconfig.web.json')) {
      if (fs.existsSync(toPath)) {
        mergeJson(srcPath, toPath);
      }
      return true;
    } else if (srcPath.endsWith('tsconfig.node.json')) {
      if (fs.existsSync(toPath)) {
        mergeJson(srcPath, toPath);
      }
      return true;
    }
    return false;
  });
};

const replaceCopy = async (srcDir: string, targetDir: string, reg: RegExp, replaceName: string) => {
  dirCopy(srcDir, targetDir, (srcPath, toPath) => {
    if (!isBinaryFile(srcPath)) {
      const data = fs.readFileSync(srcPath, { encoding: 'utf8' });
      const newData = data.replace(reg, replaceName);
      fs.writeFileSync(toPath, newData, { encoding: 'utf8' });
      return true;
    }
    return false;
  });
};

const mergeWebProject = async (
  templatePath: string,
  projectPath: string,
  options: ProjectOptions,
) => {
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
  const webSourcePath = path.join(templatePath, `web-${options.script}`);

  if (!fs.existsSync(webSourcePath)) {
    throw new Error(`template missing: ${webSourcePath}`);
  }

  if (options.appType === 'web') {
    replaceCopy(webSourcePath, targetProjectPath, REPLACE_REG, options.projectName);
  } else {
    const sourcePath = path.join(templatePath, `${options.appType}-${options.script}`);
    await replaceCopy(sourcePath, targetProjectPath, REPLACE_REG, options.projectName);
    const opt = webDirMap[options.appType];
    const webTargetPath = opt?.webDir;
    if (webTargetPath !== undefined) {
      const webTargetProjectPath = path.join(targetProjectPath, webTargetPath);
      if (!fs.existsSync(webTargetProjectPath)) {
        fs.mkdirSync(webTargetProjectPath, { recursive: true });
      }
    }
  }
  await mergeWebProject(templatePath, targetProjectPath, options);
  await createOtherFile(targetProjectPath);
};

export { create };
