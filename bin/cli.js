#!/usr/bin/env node
'use strict'

const path = require('path')
const sao = require('sao')

const generator = path.resolve(__dirname, '../')
const outDir = path.resolve(process.argv[2] || '.')
sao({generator, outDir, npmClient: 'npm'})
  .run()
  .catch(sao.handleError)
