import SyntaxTree from '../ast/SyntaxTree'
import TokenTree from '../TokenTree'
import createSyntaxTreeFromChar from '../createSyntaxTreeFromChar'

export default function (tree, context, tokenize) {
  let elements = []
  tree.statements.forEach((statement, i) => {
    elements.push(tokenize(statement, context, i.toString()))
    elements.push(TokenTree.token('\n', 'whiteSpace'))
  })
  elements.push(TokenTree.token('\n', 'whiteSpace', insertCharAtEnd))
  return elements
}

function insertCharAtEnd(tree, character, index) {
  if (index !== 0) {
    return tree
  }
  let child = createSyntaxTreeFromChar(character)
  if (child) {
    return SyntaxTree.unit(tree.statements.push(child))
  }
  return tree
}
