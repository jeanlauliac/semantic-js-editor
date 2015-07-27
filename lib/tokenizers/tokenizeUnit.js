import Node from '../ast/Node'
import Token from '../Token'
import createNodeFromChar from '../createNodeFromChar'

export default function (node, context, tokenize) {
  let elements = []
  node.statements.forEach(statement => {
    elements.push(tokenize(statement, context))
    elements.push(new Token('\n', node, 'whiteSpace'))
  })
  elements.push(new Token('\n', node, 'whiteSpace', insertCharAtEnd))
  return elements
}

function insertCharAtEnd(node, character, index) {
  let child = createNodeFromChar(character)
  if (child) {
    return Node.unit(node.statements.push(child))
  }
  return node
}
