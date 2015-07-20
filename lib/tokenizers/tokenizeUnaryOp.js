import UnaryOp from '../ast/UnaryOp'
import UnaryOpString from './UnaryOpString'
import Token from '../Token'
import createNodeFromChar from '../createNodeFromChar'

export default function tokenizeUnaryOp(node, context, tokenize) {
  let opString = UnaryOpString.fromOpType(node.type)
  let isKeyword = opString[0] >= 'a' && opString[0] <= 'z'
  let opTokenType = isKeyword ? 'keyword' : 'operator'
  return [
    new Token(opString, node, opTokenType),
    isKeyword && new Token(' ', node, 'whiteSpace'),
    tokenize(node.right, context),
  ];
}
