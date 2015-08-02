import TokenTree from './TokenTree'
import Type from './types/Type'
import typedFunction from './types/typedFunction'

let getIndexChange = typedFunction([
  ['tokenTree', TokenTree.TYPE],
  ['targetTokenTree', TokenTree.TYPE],
  ['index', Type.NUMBER],
], Type.NUMBER, _getIndexChange)

export default getIndexChange

/**
 * Given a base token tree and a target token tree, transforms the specified
 * index from the base to the target tree.
 */
function _getIndexChange(tokenTree, targetTokenTree, index) {
  if (tokenTree.tag === 'token') {
    if (targetTokenTree.tag === 'token') {
      let content = tokenTree.content
      let targetContent = targetTokenTree.content
      return getTokenIndexChange(content, targetContent, index)
    }
    return targetTokenTree.length
  }
  if (targetTokenTree.tag === 'token') {
    return 0
  }
  let pair = tokenTree.intervals.getPair(index)
  let targetBaseIndex = 0
  for (
    var i = 0;
    i < tokenTree.children.size && i < targetTokenTree.children.size;
    ++i
  ) {
    let targetChild = targetTokenTree.children.get(i)
    if (tokenTree.children.get(i) === pair[1]) {
      if (targetChild == null) {
        return targetBaseIndex
      }
      let targetIndex = getIndexChange(pair[1], targetChild, index - pair[0])
      return targetIndex + targetBaseIndex
    }
    if (targetChild == null) {
      continue
    }
    if (targetChild.tag === 'group') {
      targetBaseIndex += targetChild.length
    } else {
      targetBaseIndex += targetChild.content.length
    }
  }
  return targetBaseIndex
}

function getTokenIndexChange(content, targetContent, index) {
  let i = 0
  let j = content.length
  let k = targetContent.length
  while (i < j && i < k && content[i] === targetContent[i] && i < index) {
    ++i
  }
  if (content[i] === targetContent[i] && i === index) {
    return index
  }
  while (j > i && k > i && content[j] === targetContent[k] && k > i) {
    --j
    --k
  }
  return k
}
