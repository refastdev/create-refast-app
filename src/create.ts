import fs from 'fs'
import path from 'path'

import { dirCopy, isBinaryFile } from './utils'

const generateProject = async (projectName: string, templatePath: string, projectPath: string) => {
  if (!fs.existsSync(templatePath)) {
    throw new Error(`template missing: ${templatePath}`)
  }
  const REPLACE_REG = /{{PROJECT_NAME}}/g
  dirCopy(templatePath, projectPath, (srcPath, toPath) => {
    if (!isBinaryFile(srcPath)) {
      const data = fs.readFileSync(srcPath, { encoding: 'utf8' })
      const newData = data.replace(REPLACE_REG, projectName)
      fs.writeFileSync(toPath, newData, { encoding: 'utf8' })
      return true
    }
    return false
  })
}

const create = async (projectName: string, script: string, pkg: string) => {
  const currentPath = process.cwd()
  const targetProjectPath = path.resolve(currentPath, projectName)
  if (fs.existsSync(targetProjectPath)) {
    throw new Error(`folder: '${projectName}' already exists`)
  }
  const templatePath = path.resolve(__dirname, '../template')
  const templateName = `${script}-${pkg}`
  const templateSourcePath = path.join(templatePath, templateName)
  await generateProject(projectName, templateSourcePath, targetProjectPath)
}

export { create }
