import SyntaxTree from '../ast/SyntaxTree'
import Token from '../Token'
import createSyntaxTreeFromChar from '../createSyntaxTreeFromChar'

export default function (tree, context, tokenize) {
  let elements = []
  tree.statements.forEach(statement => {
    elements.push(tokenize(statement, context))
    elements.push(new Token('\n', tree, 'whiteSpace'))
  })
  elements.push(new Token('\n', tree, 'whiteSpace', insertCharAtEnd))
  return elements
}

function insertCharAtEnd(tree, character, index) {
  let child = createSyntaxTreeFromChar(character)
  if (child) {
    return SyntaxTree.unit(tree.statements.push(child))
  }
  return tree
}
