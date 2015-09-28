#!/usr/bin/env node_modules/.bin/babel-node --stage 1

import Emitter from './update/Emitter'
import EslintPluginReact from 'eslint-plugin-react'
import StatusLogger from './update/StatusLogger'
import StyleExtractor from './update/StyleExtractor'
import babelify from 'babelify'
import browserify from 'browserify'
import chokidar from 'chokidar'
import clc from 'cli-color'
import http from 'http'
import fs from 'fs'
import invariant from './lib/utils/invariant'
import {linter as ESLint} from 'eslint'
import linterRules from 'eslint/lib/rules'
import mergePromiseStreams from './update/mergePromiseStreams'
import mkdirp from 'mkdirp'
import moment from 'moment'
import nodeStatic from 'node-static'
import nopt from 'nopt'
import padText from './update/padText'
import path from 'path'
import progressString from './update/progressString'
import streamIntoCallback from './update/streamIntoCallback'
import streamIntoStatusLogger from './update/streamIntoStatusLogger'
import through from 'through2'
import updateCopy from './update/updateCopy'
import updateJavascriptAndStyle from './update/updateJavascriptAndStyle'
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

function main() {
  let opts = nopt({once: Boolean, port: Number})
  opts.port = opts.port || 8080
  mkdirp.sync(Folders.OUTPUT)
  const statusLogger = new StatusLogger(process.stderr)
  const log = message => {
    let date = clc.blackBright(moment().format('HH:mm:ss'))
    statusLogger.log(`${date}  ${message}`)
  }
  const jsStream = buildJS(opts, log, opts.once)
  const htmlStream = copyHtml(opts, log, opts.once)
  mergePromiseStreams([jsStream, htmlStream])
    .pipe(streamIntoStatusLogger(statusLogger, log));
  if (!opts.once) {
    serve(Folders.OUTPUT, opts, log)
  }
}

function buildJS(opts, log, once) {
  let jsBundlePath = path.join(Folders.OUTPUT, 'bundle.js')
  let cssBundlePath = path.join(Folders.OUTPUT, 'bundle.css')
  let [jsStream, cssStream] = updateJavascriptAndStyle(
    './' + path.join(Folders.WWW, 'index.js'),
    jsBundlePath,
    cssBundlePath,
    [
      lintify.bind(undefined, log),
      babelify.configure({optional: ['es7.objectRestSpread']})
    ],
    watchFile.bind(null, log),
    createWriteStream.bind(null, log),
    once
  )
  return mergePromiseStreams([jsStream, cssStream])
}

function copyHtml(opts, log, once) {
  const sourcePath = path.join(Folders.WWW, 'index.html')
  const destPath = path.join(Folders.OUTPUT, 'index.html')
  return updateCopy(sourcePath, destPath,
    watchFile.bind(null, log), createWriteStream.bind(null, log), once)
}

function logError(log, error) {
  log('*** ' + error.stack)
}

function serve(rootPath, opts, log) {
  let server = new nodeStatic.Server(rootPath)
  http.createServer((request, response) => {
    request.on('end', () => {
      server.serve(request, response)
    }).resume()
  }).listen(opts.port).on('listening', () => {
    log(`Listening on port ${clc.magenta(opts.port)}`)
  })
}

function watchFile(log, filePath, opts) {
  let fileWatcher = chokidar.watch(filePath, opts)
  let localPath = path.relative('.', filePath)
  fileWatcher.on('change', () => {
    log('Changed: ' + clc.green(localPath))
  })
  return fileWatcher;
}

function createWriteStream(log, filePath) {
  let stream = fs.createWriteStream(filePath)
  stream.on('finish', () => {
    log(`Wrote ${clc.blue(filePath)}`)
  })
  return stream
}

main()
