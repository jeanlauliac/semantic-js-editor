import Immutable from 'immutable'
import Line from './Line'
import TokenTree from './TokenTree'
import invariant from './utils/invariant'

/**
 * Takes a intervals and bucket the tokens into separate lines.
 */
export default function lineify(tokenIntervals) {
  let tokens = flattenTokenGroup(tokenIntervals)
  let lines = []
  let currentLine = []
  let index = 0
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
  return Immutable.List(lines)
}

function flattenTokenGroup(tokenIntervals) {
  let result = []
  tokenIntervals.forEach(pair => {
    invariant(TokenTree.TYPE.validate(pair[1]) == null, '`tokenIntervals` contains invalid element')
    if (pair[1].tag === 'group') {
      result = result.concat(flattenTokenGroup(pair[1].intervals))
    } else {
      result.push(pair[1])
    }
  })
  return result
}
