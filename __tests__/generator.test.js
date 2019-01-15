const path = require('path')
const sao = require('sao')

const template = path.join(__dirname, '..')

describe('all the template files are accountable for', () => {
  test('generator contains github templates', async () => {
    jest.setTimeout(15000)
    const stream = await sao.mock({generator: template})
    expect(stream.fileList).toContain('.github/ISSUE_TEMPLATE.md')
    expect(stream.fileList).toContain('.github/ISSUE_TEMPLATE/1-bug-report.md')
    expect(stream.fileList).toContain('.github/ISSUE_TEMPLATE/2-feature-request.md')
    expect(stream.fileList).toContain('.github/ISSUE_TEMPLATE/3-help.md')
    expect(stream.fileList).toContain('.github/PULL_REQUEST_TEMPLATE.md')
  })

  test('generator contains project files', async () => {
    const stream = await sao.mock(
      {generator: template},
      {
        features: ['linter'],
        linterConfig: 'xo'
      }
    )

    expect(stream.fileList).toContain('.gitignore')
    expect(stream.fileList).toContain('.prettierrc.js')
    expect(stream.fileList).toContain('.travis.yml')
    expect(stream.fileList).toContain('CODE_OF_CONDUCT.md')
    expect(stream.fileList).toContain('CONTRIBUTING.md')
    expect(stream.fileList).toContain('LICENSE')
    expect(stream.fileList).toContain('README.md')
    expect(stream.fileList).toContain('__tests__/app.test.js')
    expect(stream.fileList).toContain('index.js')
    expect(stream.fileList).toContain('jsdoc.json')
    expect(stream.fileList).toContain('package.json')
  })

  test('Generator input creates a valid package.json file', async () => {
    const mockProjectName = 'acme'
    const mockProjectAuthor = 'Alice in Chains'
    const mockProjectDescription = 'hello'
    const mockProjectKeywords = ['kw1, kw2']
    const mockUsername = 'alice'
    const mockUserEmail = 'alice@inchains.com'
    const mockProjectRepository = 'https://www.github.com/alice/inchains.git'

    const stream = await sao.mock(
      {generator: template},
      {
        keywords: [mockProjectKeywords],
        projectName: mockProjectName,
        description: mockProjectDescription,
        author: mockProjectAuthor,
        username: mockUsername,
        email: mockUserEmail,
        projectRepository: mockProjectRepository
      }
    )

    const pkg = JSON.parse(await stream.readFile('package.json'))
    expect(pkg.name).toBe(mockProjectName)
    expect(pkg.description).toBe(mockProjectDescription)
    expect(pkg.author.name).toBe(mockProjectAuthor)
    expect(pkg.author.email).toBe(mockUserEmail)
    expect(pkg.homepage).toBe(mockProjectRepository)
    expect(pkg.keywords).toEqual(mockProjectKeywords)
  })
})
