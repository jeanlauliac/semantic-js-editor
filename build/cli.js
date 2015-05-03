import ExecPool from './ExecPool'
import fs from 'fs'
import mkdirp from 'mkdirp'
import nopt from 'nopt'
import path from 'path'

var Directory = {
  WWW: 'www',
  Bundle: 'bundle',
}

var genMkdirp = (dir, opts) => new Promise((accept, reject) => {
  console.log(`mkdirp:`, dir)
  mkdirp(dir, opts, (error) => error == null ? accept() : reject(error))
})

var shellEscape = (str) => str.replace(/([^a-zA-Z/._-])/g, '\\$1')

/**
 * Builds a bundle of the library, comprising both a bundled JS file and a
 * bundled CSS file.
 */
function buildBundle(dirPath) {
  await genMkdirp(dirPath)
  console.log('bundle')
}

/**
 * Builds the examples www project that demonstrate the capabilities of the
 * library.
 */
function buildWWW(dirPath) {
  await genMkdirp(dirPath)

}

/**
 * Builds everything.
 */
function buildAll(execPool) {
  return Builder.compound(() => {
    let bundle = new BundleBuilder(Directory.Bundle)
    let www = new WWWBuilder(Directory.WWW, bundle)
    return [bundle, www]
  })
}

;(function () {
  let options = nopt({'once': Boolean})
  let meta = JSON.parse(fs.readFileSync('package.json', {encoding: 'utf8'}))
  let execPool = new ExecPool()
  try {
    let builder = buildAll(execPool)
    if (option.once) {
      builder.on('done', () => {
        builder.dispose()
        process.exit(0)
      })
    }
    builder.on('error', (error) => {
      console.error(error)
    })
  } catch (error) {
    console.log('error: ' + error.message)
    process.exit(1)
  }
})()
