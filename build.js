#!/usr/bin/env node_modules/.bin/babel-node

import Emitter from './build/Emitter'
import EslintPluginReact from 'eslint-plugin-react'
import StyleExtractor from './build/StyleExtractor'
import babelify from 'babelify'
import browserify from 'browserify'
import clc from 'cli-color'
import http from 'http'
import invariant from './lib/utils/invariant'
import {linter as ESLint} from 'eslint'
import linterRules from 'eslint/lib/rules'
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

var BrowserifyOpts = {
  cache: {},
  debug: false,
  fullPaths: true,
  packageCache: {},
}

var LintRules = {
  ecmaFeatures: {
    // Feel free to add more stuff here.
    arrowFunctions: true,
    blockBindings: true,
    classes: true,
    destructuring: true,
    experimentalObjectRestSpread: true,
    modules: true,
    objectLiteralShorthandMethods: true,
    restParams: true,
    jsx: true,
  },
  env: {
      browser: true,
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
    'no-unused-vars': 1,
    'no-warning-comments': 1,
    'quotes': [1, 'single'],
    'react/jsx-uses-vars': 1,
    'semi': [1, 'never'],
  },
}

/** Ugly hack to use a plugin with ESLint. */
linterRules.import(EslintPluginReact.rules, 'react')

var log = (() => {
  return (message) => {
    let date = clc.blackBright(moment().format('HH:mm:ss'))
    console.error(`${date}  ${message}`)
  }
})()

process.on('uncaughtException', (err) => {
  log(clc.red('*** Uncaught exception!'))
  console.error(err.stack)
  process.exit(1)
})

function browseristyle(filePath) {
  return new Emitter(inform => {
    var styleExtractor = new StyleExtractor()
    var jsBundler = watchify(
      browserify(BrowserifyOpts)
        .transform(lintify)
        .transform(babelify.configure({optional: ['es7.objectRestSpread']}))
        .transform(styleExtractor.getTransform())
        .require(filePath, {entry: true})
      )
    var buildBundles = () => {
      var css = through()
      var js = jsBundler.bundle().on('end', () => {
        styleExtractor.toStream().pipe(css)
      })
      inform({js, css})
    }
    jsBundler.on('update', paths => {
      log('Changed: ' + paths.map(filePath =>
        clc.green(path.relative('.', filePath))).join(', '))
      buildBundles()
    })
    buildBundles()
    return () => {
      jsBundler.removeListener('update', buildBundles)
      setTimeout(() => {
        // Need to do that async.
        // See https://github.com/substack/watchify/issues/22#issuecomment-67673776
        jsBundler.close()
      }, 1000)
    }
  })
}

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

function streamToFile(stream, filePath) {
  return stream.on('error', error => {
    log(clc.red(`*** Failed to generate ${filePath}`))
    console.error(error.stack)
  }).pipe(fs.createWriteStream(filePath))
    .on('error', (error) => {
      log(clc.red(`*** Failed to write file ${filePath}`))
      console.error(error.stack)
    })
    .on('finish', () => {
      log(`Wrote ${clc.blue(filePath)}`)
    })
}

function copying(sourcePath, destPath) {
  return new Emitter(inform => {
    var copy = () => {
      return streamToFile(fs.createReadStream(sourcePath), destPath)
    }
    var watcher = fs.watch(sourcePath, () => {
      log('Changed: ' + clc.green(sourcePath))
      inform(copy())
    })
    inform(copy())
    return () => {
      watcher.close()
    }
  })
}

function serving(rootPath) {
  return new Emitter(inform => {
    let server = new nodeStatic.Server(rootPath)
    http.createServer((request, response) => {
      request.on('end', () => {
        server.serve(request, response)
      }).resume()
    }).listen(8080).on('listening', () => {
      log(`Listening on port ${clc.magenta(8080)}`)
    })
    return () => {invariant(false, 'unsupported')}
  })
}

(() => {
  let opts = nopt({once: Boolean})
  let jsEntryPath = './' + path.join(Folders.WWW, 'index.js')
  let jsBundlePath = path.join(Folders.OUTPUT, 'bundle.js')
  let cssBundlePath = path.join(Folders.OUTPUT, 'bundle.css')
  let sub = new Emitter((inform) => {
    let sub = browseristyle(jsEntryPath).subscribe(({js, css}) => {
      streamToFile(js, jsBundlePath)
      streamToFile(css, cssBundlePath)
      inform()
    })
    return () => {sub.remove()}
  }).subscribe(() => {
    if (opts.once) {
      sub.remove()
    }
  })
  let sub2 = copying(
    path.join(Folders.WWW, 'index.html'),
    path.join(Folders.OUTPUT, 'index.html')
  ).subscribe(() => {
    if (opts.once) {
      sub2.remove()
    }
  })
  if (!opts.once) {
    serving(Folders.OUTPUT).subscribe(() => {})
  }
})()
