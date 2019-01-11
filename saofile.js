'use strict'
const validateNpmPackageName = require('validate-npm-package-name')

module.exports = {
  description: 'Scaffolding out a node library.',
  templateData: {
    year: new Date().getFullYear()
  },
  prompts() {
    return [
      {
        name: 'projectName',
        message: 'What is the name of the new project',
        default: this.outFolder,
        filter: val => val.toLowerCase(),
        validate: projectName => {
          const validation = validateNpmPackageName(projectName)
          return !validation.errors && !validation.warnings
        }
      },
      {
        name: 'description',
        message: 'How would you describe the new project',
        default: ``
      },
      {
        name: 'keywords',
        message: 'Comma-separated list of package keywords for npm',
        default: ``
      },
      {
        name: 'author',
        message: 'What is your name',
        default: this.gitUser.name,
        store: true,
        required: true
      },
      {
        name: 'username',
        message: 'What is your GitHub username',
        default:
          this.gitUser.username ||
          this.gitUser.name
            .toLowerCase()
            .split(' ')
            .join(''),
        filter: val => val.toLowerCase(),
        store: true
      },
      {
        name: 'email',
        message: 'What is your email?',
        default: this.gitUser.email,
        store: true,
        validate: v => /.+@.+/.test(v)
      },
      {
        name: 'projectRepository',
        message: 'The URL of the repository',
        default({username, projectName}) {
          return `https://www.github.com/${username}/${projectName}`
        },
        store: true
      }
    ]
  },
  actions() {
    return [
      {
        type: 'add',
        templateDir: 'template',
        files: '**'
      },
      {
        type: 'move',
        patterns: {
          gitignore: '.gitignore',
          '_package.json': 'package.json'
        }
      }
    ]
  },
  async completed() {
    this.gitInit()
    await this.npmInstall()
    this.showProjectTips()

    this.logger.tip(`You're all setup. hack away!`)
  }
}
