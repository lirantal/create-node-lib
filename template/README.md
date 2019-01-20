<p align="center"><h1 align="center">
  <%= projectName %>
</h1>

<p align="center">
  <%= description %>
</p>

<p align="center">
  <a href="https://www.npmjs.org/package/<%= projectName %>"><img src="https://badgen.net/npm/v/<%= projectName %>"alt="npm version"/></a>
  <a href="https://www.npmjs.org/package/<%= projectName %>"><img src="https://badgen.net/npm/license/<%= projectName %>"alt="license"/></a>
  <a href="https://www.npmjs.org/package/<%= projectName %>"><img src="https://badgen.net/npm/dt/<%= projectName %>"alt="downloads"/></a>
  <a href="https://travis-ci.org/<%= username %>/<%= projectName %>"><img src="https://badgen.net/travis/<%= username %>/<%= projectName %>" alt="build"/></a>
  <a href="https://codecov.io/gh/<%= username %>/<%= projectName %>"><img src="https://badgen.net/codecov/c/github/<%= username %>/<%= projectName %>" alt="codecov"/></a>
  <a href="https://snyk.io/test/github/<%= username %>/<%= projectName %>"><img src="https://snyk.io/test/github/<%= username %>/<%= projectName %>/badge.svg" alt="Known Vulnerabilities"/></a>
</p>

# About

<%= projectName %>

<%= description %>

# Install

```bash
npm install --save <%= projectName %>
```

# Usage

```js
// @TODO
const {} = require('<%= projectName %>')
```

# Example

<!-- TODO -->

# Contributing

Please consult [CONTIRBUTING](./CONTRIBUTING.md) for guidelines on contributing to this project.

# Author

**<%= projectName %>** © [<%= author %>](https://github.com/<%= username %>), Released under the [Apache-2.0](./LICENSE) License.
