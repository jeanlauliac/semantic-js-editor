import Immutable from 'immutable'
import Line from './Line'
import Token from './Token'
import TokenGroup from './TokenGroup'
import invariant from './utils/invariant'

function flattenTokenGroup(tokenGroup) {
  invariant(tokenGroup instanceof TokenGroup, '`tokenGroup` must be a `TokenGroup`')
  var result = []
  tokenGroup.elements.forEach(pair => {
    if (pair[1] instanceof TokenGroup) {
      result = result.concat(flattenTokenGroup(pair[1]))
    } else {
      invariant(pair[1] instanceof Token, '`tokenGroup` contains invalid element')
      result.push(pair[1])
    }
  })
  return result
}

/**
 * Takes a token group and bucket the tokenss them into separate lines (a list
 * of list of tokens).
 */
export default function lineify(tokenGroup) {
  invariant(tokenGroup instanceof TokenGroup, '`tokenGroup` must be a `TokenGroup`')
  var tokens = flattenTokenGroup(tokenGroup)
  var lines = []
  var currentLine = []
  var index = 0
  tokens.forEach(token => {
    currentLine.push(token)
    if (token.content === '\n') {
      let newLine = new Line(new Immutable.List(currentLine), index)
      lines.push(newLine)
      index += newLine.length
      currentLine = []
    }
  })
  invariant(currentLine.length === 0, 'missing newline at the end of tokens')
  lines.push(new Line(new Immutable.List([]), index))
  return new Immutable.List(lines)
}
