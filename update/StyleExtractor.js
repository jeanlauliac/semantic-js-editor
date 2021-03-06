import Absurd from 'absurd'
import {Readable} from 'stream'
import falafel from 'falafel'
import fs from 'fs'
import path from 'path'
import through from 'through2'

export default class StyleExtractor {
  constructor() {
    this.clear()
  }

  clear() {
    this._fileSpecs = {}
  }

  toStream() {
    var ab = new Absurd()
    for (var file in this._fileSpecs) {
      var specs = this._fileSpecs[file]
      for (var i = 0; i < specs.length; ++i) {
        ab.add(specs[i])
      }
    }
    var stream = new Readable({encoding: 'utf8'})
    stream._read = () => {
      ab.compile(function (err, css) {
        if (err) {
          cb(err)
        }
        stream.push(css)
        stream.push(null)
      })
    }
    return stream
  }

  getTransform() {
    return this._transform.bind(this)
  }

  _transform(filename) {
    var classPrefix = path.basename(filename).replace('.', '_') + '__'
    var source = ''
    var _this = this
    return through(function (data, enc, callback) {
      source += data
      callback()
    }, function (callback) {
      var fileSpecs = _this._fileSpecs[filename] = []
      var result = falafel(source, (node) => {
        if (!(
          node.type === 'CallExpression' &&
          node.callee.type === 'Identifier' &&
          node.callee.name === 'stylify'
        )) {
          return
        }
        var obj = eval('(' + node.arguments[0].source() + ')')
        var meta = stylifyImpl(obj, {}, (className) =>
          classPrefix + className
        )
        fileSpecs.push(meta.spec)
        node.update(JSON.stringify(meta.classMap))
      }).toString()
      this.push(result)
      this.push(null)
      callback()
    })
  }
}

function objectAssign(obj) {
  for (var i = 1; i < arguments.length; i++) {
    var sourceObj = arguments[i]
    for (var field in sourceObj) {
      obj[field] = sourceObj[field]
    }
  }
  return obj
}

/**
 * Given an absurd.js declaration object `spec` and an existing `classMap`,
 * recursively scan and transform all the classes being used by an generated
 * equivalent. Returns an object containing the transformed `spec` as well as a
 * `classMap` from the plain classes to the generated one.
 */
function stylifyImpl(spec, classMap, gen) {
  var retSpec = {}
  classMap = objectAssign({}, classMap)
  for (var field in spec) {
    var value = spec[field]
    var kind = Object.prototype.toString.call(value)
    if (kind !== '[object Object]') {
      retSpec[field] = value
      continue
    }
    var newField = field.replace(/\.([a-z_-]*)/g, function (match, className) {
      if (!classMap.hasOwnProperty(className)) {
        classMap[className] = gen(className)
      }
      return '.' + classMap[className]
    })
    var sub = stylifyImpl(value, classMap, gen)
    objectAssign(classMap, sub.classMap)
    retSpec[newField] = sub.spec
  }
  return {spec: retSpec, classMap}
}
