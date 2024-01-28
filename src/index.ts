import { input, select } from '@inquirer/prompts'

import { create } from './create'

const main = async () => {
  const projectName = await input({
    message: 'Enter Your Project Name',
    default: 'example-refast-project'
  })
  const script = await select({
    message: 'Choose Language',
    choices: [{ name: 'typescript (default)', value: 'javascript' }, { value: 'javascript' }]
  })
  const pkg = await select({
    message: 'Select Package Manager',
    choices: [{ name: 'pnpm (default)', value: 'pnpm' }, { value: 'npm' }]
  })

  try {
    console.log('please wait...')
    await create(projectName, script, pkg)
    console.log(`✅ create done! ${projectName}`)
  } catch (e) {
    console.error(`${e}`)
  }
}

main()
