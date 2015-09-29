#!/usr/bin/env node_modules/.bin/babel-node --stage 1

import Emitter from './update/Emitter'
import EslintPluginReact from 'eslint-plugin-react'
import StyleExtractor from './update/StyleExtractor'
import babelify from 'babelify'
import browserify from 'browserify'
import clc from 'cli-color'
import fs from 'fs'
import invariant from './lib/utils/invariant'
import {linter as ESLint} from 'eslint'
import linterRules from 'eslint/lib/rules'
import mergePromiseStreams from './update/mergePromiseStreams'
import padText from './update/padText'
import path from 'path'
import progressString from './update/progressString'
import startCLI from './update/startCLI'
import streamIntoCallback from './update/streamIntoCallback'
import streamIntoStatusLogger from './update/streamIntoStatusLogger'
import through from 'through2'
import updateJavascriptAndStyle from './update/updateJavascriptAndStyle'

var Folders = {
  OUTPUT: 'output',
  WWW: 'www',
}

const www = filePath => path.join(Folders.WWW, filePath)
const output = filePath => path.join(Folders.OUTPUT, filePath)

var LintRules = {
  ecmaFeatures: {
    // Feel free to add more stuff here.
    arrowFunctions: true,
    blockBindings: true,
    classes: true,
    destructuring: true,
    experimentalObjectRestSpread: true,
    jsx: true,
    modules: true,
    objectLiteralShorthandMethods: true,
    restParams: true,
    templateStrings: true,
  },
  env: {
    browser: true,
  },
  globals: {
    stylify: false,
  },
  plugins: [
    'react',
  ],
  rules: {
    'camelcase': [1, {'properties': 'always'}],
    'comma-dangle': [1, 'always-multiline'],
    'comma-spacing': 1,
    'curly': 2,
    'dot-location': [1, 'property'],
    'eqeqeq': [2, 'smart'],
    'indent': [1, 2],
    'no-alert': 1,
    'no-debugger': 1,
    'no-undef': 2,
    'no-unused-vars': 1,
    'no-warning-comments': 1,
    'quotes': [1, 'single'],
    'react/jsx-uses-vars': 1,
    'semi': [1, 'never'],
  },
}

/** Ugly hack to use a plugin with ESLint. */
linterRules.import(EslintPluginReact.rules, 'react')

process.on('uncaughtException', (err) => {
  console.error(clc.red('*** Uncaught exception!'))
  console.error(err.stack)
  process.exit(1)
})

function lintify(log, filePath) {
  let source = ''
  return through(function (chunk, enc, callback) {
    source += chunk
    this.push(chunk)
    callback()
  }, function (callback) {
    let issues = ESLint.verify(source, LintRules, filePath)
    let localPath = path.relative('.', filePath)
    let maxLength = issues.reduce((acc, issue) =>
      Math.max(acc, `${issue.line}:${issue.column}`.length), 0)
    issues.forEach(issue => {
      log(
        `${clc.blue(localPath)}:` +
        padText(`${issue.line}:${issue.column}`, maxLength) + '  ' +
        (issue.severity === 2 ? clc.red('error') : clc.yellow('warn ')) +
        '  ' + issue.message + '  ' + clc.blackBright(issue.ruleId)
      )
    })
    this.push(null)
    callback()
  })
}

function updateJS(utils) {
  let [jsStream, cssStream] = updateJavascriptAndStyle(
    utils,
    './' + path.join(Folders.WWW, 'index.js'),
    path.join(Folders.OUTPUT, 'bundle.js'),
    path.join(Folders.OUTPUT, 'bundle.css'),
    [
      lintify.bind(undefined, utils.log),
      babelify.configure({optional: ['es7.objectRestSpread']})
    ],
  )
  return mergePromiseStreams([jsStream, cssStream])
}

startCLI({port: Number}, (update, {port}) => {
  port = port || 8080
  update.serveFiles(Folders.OUTPUT, port)
  return update.all([
    updateJS(update),
    update.fromFile(www('index.html'))
      .pipe(update.intoFile(output('index.html')))
  ])
})
