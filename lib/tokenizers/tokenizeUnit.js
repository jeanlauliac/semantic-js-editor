import SyntaxTree from '../ast/SyntaxTree'
import TokenTree from '../TokenTree'
import createSyntaxTreeFromChar from '../createSyntaxTreeFromChar'

export default function (tree, context, tokenize) {
  let elements = []
  tree.statements.forEach(statement => {
    elements.push(tokenize(statement, context))
    elements.push(TokenTree.token('\n', 'whiteSpace'))
  })
  elements.push(TokenTree.token('\n', 'whiteSpace', insertCharAtEnd))
  return elements
}

function insertCharAtEnd(tree, character, index) {
  let child = createSyntaxTreeFromChar(character)
  if (child) {
    return SyntaxTree.unit(tree.statements.push(child))
  }
  return tree
}
