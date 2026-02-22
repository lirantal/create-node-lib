<!-- markdownlint-disable -->

<p align="center"><h1 align="center">
  <%= projectName %>
</h1>

<p align="center">
  <%= description %>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/<%= projectName %>"><img src="https://badgen.net/npm/v/<%= projectName %>" alt="npm version"/></a>
  <a href="https://www.npmjs.com/package/<%= projectName %>"><img src="https://badgen.net/npm/license/<%= projectName %>" alt="license"/></a>
  <a href="https://www.npmjs.com/package/<%= projectName %>"><img src="https://badgen.net/npm/dt/<%= projectName %>" alt="downloads"/></a>
  <a href="https://github.com/<%= username %>/<%= projectName %>/actions?workflow=CI"><img src="https://github.com/<%= username %>/<%= projectName %>/workflows/CI/badge.svg" alt="build"/></a>
  <a href="https://codecov.io/gh/<%= username %>/<%= projectName %>"><img src="https://badgen.net/codecov/c/github/<%= username %>/<%= projectName %>" alt="codecov"/></a>
  <a href="https://snyk.io/test/github/<%= username %>/<%= projectName %>"><img src="https://snyk.io/test/github/<%= username %>/<%= projectName %>/badge.svg" alt="Known Vulnerabilities"/></a>
  <a href="./SECURITY.md"><img src="https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg" alt="Responsible Disclosure Policy" /></a>
</p>

## Install

```sh
<%= npmClient %> <%= npmClientInstall(npmClient) %> <%= projectName %>
```
## Usage: CLI

```bash
// @TODO
const {} = require('<%= projectName %>')
```

## Contributing

Please consult [CONTRIBUTING](./.github/CONTRIBUTING.md) for guidelines on contributing to this project.

## Author

**<%= projectName %>** © [<%= author %>](https://github.com/<%= username %>), Released under the [Apache-2.0](./LICENSE) License.
