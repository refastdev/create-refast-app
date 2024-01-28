import { input } from '@inquirer/prompts'

const main = async () => {
  const answer = await input({ message: 'Enter your name' })
  console.log(answer)
}

main()
