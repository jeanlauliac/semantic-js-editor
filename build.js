#!/usr/bin/env node_modules/.bin/babel-node

import CopyBot from './build/CopyBot'
import Emitter from './build/Emitter'
import EslintPluginReact from 'eslint-plugin-react'
import JavascriptBot from './build/JavascriptBot'
import StyleExtractor from './build/StyleExtractor'
import babelify from 'babelify'
import browserify from 'browserify'
import clc from 'cli-color'
import http from 'http'
import fs from 'fs'
import invariant from './lib/utils/invariant'
import {linter as ESLint} from 'eslint'
import linterRules from 'eslint/lib/rules'
import mkdirp from 'mkdirp'
import moment from 'moment'
import nodeStatic from 'node-static'
import nopt from 'nopt'
import path from 'path'
import through from 'through2'
import watchify from 'watchify'

var Folders = {
  OUTPUT: 'output',
  WWW: 'www',
}

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
  log(clc.red('*** Uncaught exception!'))
  console.error(err.stack)
  process.exit(1)
})

function lintify(filePath) {
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
        pad(`${issue.line}:${issue.column}`, maxLength) + '  ' +
        (issue.severity === 2 ? clc.red('error') : clc.yellow('warn ')) +
        '  ' + issue.message + '  ' + clc.blackBright(issue.ruleId)
      )
    })
    this.push(null)
    callback()
  })
}

function pad(text, length) {
  if (text.length >= length) {
    return text
  }
  return text + new Array(length - text.length + 1).join(' ')
}

function main() {
  let opts = nopt({once: Boolean})
  mkdirp.sync(Folders.OUTPUT)
  let updateStatus = (() => {
    let counter = 0
    let sTime = 0
    return event => {
      if (event === 'start') {
        if (counter === 0) {
          sTime = moment()
        }
        ++counter
      } else if (event === 'finish') {
        --counter
        if (counter === 0) {
          let duration = moment().diff(sTime, 'seconds', true)
          log(`Project is up-to-date ${
            clc.blackBright(`(after ${duration}s)`)
          }`)
        }
      }
    }
  })()
  buildJS(opts, updateStatus)
  copyHtml(opts, updateStatus)
  if (!opts.once) {
    serve(Folders.OUTPUT)
  }
}

function buildJS(opts, updateStatus) {
  let jsBundlePath = path.join(Folders.OUTPUT, 'bundle.js')
  let cssBundlePath = path.join(Folders.OUTPUT, 'bundle.css')
  let bot = new JavascriptBot(
    './' + path.join(Folders.WWW, 'index.js'),
    jsBundlePath,
    cssBundlePath,
    [lintify, babelify.configure({optional: ['es7.objectRestSpread']})]
  )
    .on('start', () => updateStatus('start'))
    .on('change', paths => {
      log('Changed: ' + paths.map(
        filePath => clc.green(path.relative('.', filePath))
      ).join(', '))
    })
    .on('error', logError)
    .on('finish', () => {
      log(`Wrote ${clc.blue(jsBundlePath)}`)
      log(`Wrote ${clc.blue(cssBundlePath)}`)
      updateStatus('finish')
      if (opts.once) {
        bot.close()
      }
    })
  return bot
}

function copyHtml(opts, updateStatus) {
  let sourcePath = path.join(Folders.WWW, 'index.html')
  let destPath = path.join(Folders.OUTPUT, 'index.html')
  let bot = new CopyBot(sourcePath, destPath)
    .on('start', () => updateStatus('start'))
    .on('change', logChange.bind(undefined, sourcePath))
    .on('error', logError)
    .on('finish', () => {
      log(`Wrote ${clc.blue(destPath)}`)
      updateStatus('finish')
      if (opts.once) {
        bot.close()
      }
    })
  return bot
}

function logChange(filePath) {
  log('Changed: ' + clc.green(filePath))
}

function logError(error) {
  log(clc.red(`*** Error: ${error.message}`))
  console.error(error.stack)
}

function serve(rootPath) {
  let server = new nodeStatic.Server(rootPath)
  http.createServer((request, response) => {
    request.on('end', () => {
      server.serve(request, response)
    }).resume()
  }).listen(8080).on('listening', () => {
    log(`Listening on port ${clc.magenta(8080)}`)
  })
}

function log(message) {
  let date = clc.blackBright(moment().format('HH:mm:ss'))
  console.error(`${date}  ${message}`)
}

main()
