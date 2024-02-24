const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const fixRun = (postinstall) => {
  let npmPath = execSync('npm config get prefix', { encoding: 'utf8' });
  if (npmPath) {
    npmPath = npmPath.trim();
    const pnpmCJsPath = path.join(npmPath, 'node_modules/pnpm/bin/pnpm.cjs');
    let content;
    if (fs.existsSync(pnpmCJsPath)) {
      content = fs.readFileSync(pnpmCJsPath, { encoding: 'utf8' });
      if (content.startsWith('#!/usr/bin/env node')) {
        const newContent = content.replace('#!/usr/bin/env node', '#!node');
        fs.writeFileSync(pnpmCJsPath, newContent, { encoding: 'utf8' });
      }
    }
    postinstall();
    if (fs.existsSync(pnpmCJsPath) && content) {
      fs.writeFileSync(pnpmCJsPath, content, { encoding: 'utf8' });
    }
  }
};

fixRun(() => {
  console.log('electron-builder install-app-deps');
  const r = execSync('electron-builder install-app-deps', { encoding: 'utf8' });
  console.log(r);
});

console.log('postinstall success');
