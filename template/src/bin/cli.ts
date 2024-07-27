#!/usr/bin/env node
import { debuglog } from 'node:util'
import { add } from '../main.js'

const debug = debuglog('<%= projectName %>')

async function init () {
    const sum = await add(1,2)
    debug(sum.toString())
}

init()