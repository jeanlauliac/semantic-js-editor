import SyntaxTree from '../lib/ast/SyntaxTree'
import Immutable from 'immutable'

export default {

  empty:
    SyntaxTree.unit(Immutable.List([])),

  maths:
    SyntaxTree.unit(
      Immutable.List([
        SyntaxTree.binaryOp(
          'multiply',
          SyntaxTree.literal(42),
          SyntaxTree.binaryOp(
            'add',
            SyntaxTree.literal(10),
            SyntaxTree.literal(32)
          )
        ),
        SyntaxTree.binaryOp(
          'subtract',
          SyntaxTree.literal(100),
          SyntaxTree.literal(81)
        ),
      ])
    ),

}
