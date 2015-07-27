import Node from '../lib/ast/Node'
import Immutable from 'immutable'

export default {

  empty:
    Node.unit(Immutable.List([])),

  maths:
    Node.unit(
      Immutable.List([
        Node.binaryOp(
          'multiply',
          Node.literal(42),
          Node.binaryOp(
            'add',
            Node.literal(10),
            Node.literal(32)
          )
        ),
        Node.binaryOp(
          'subtract',
          Node.literal(100),
          Node.literal(81)
        ),
      ])
    ),

}
