import BinaryOpString from './BinaryOpString'
import SyntaxTree from '../ast/SyntaxTree'
import TokenTree from '../TokenTree'
import invariant from '../utils/invariant'

export default function tokenizeLiteral(tree) {
  if (typeof tree.value === 'number') {
    return [
      TokenTree.token(tree.value.toString(), 'number', insertChar, removeChar),
    ]
  }
  invariant(false, 'unsupported literal')
}

function insertChar(tree, character, index) {
  let left = this.content.substr(0, index)
  let right = this.content.substr(index)
  if (
    typeof tree.value === 'number' &&
    character >= '0' &&
    character <= '9'
  ) {
    return SyntaxTree.literal(
      parseFloat(left + character + right)
    )
  }
  let opType = BinaryOpString.toOpType(character)
  if (opType != null) {
    return SyntaxTree.binaryOp(
      opType,
      left.length === 0 ? null : SyntaxTree.literal(parseFloat(left)),
      right.length === 0 ? null : SyntaxTree.literal(parseFloat(right))
    )
  }
  return tree
}

function removeChar(tree, index) {
  let left = this.content.substr(0, index)
  let right = this.content.substr(index + 1)
  if (left === '' && right === '') {
    return null
  }
  return SyntaxTree.literal(parseFloat(left + right))
}
