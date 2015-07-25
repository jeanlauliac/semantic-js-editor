import BinaryOpTypes from './BinaryOpTypes'
import ImmutableTypes from '../types/ImmutableTypes'
import Types from '../types/Types'
import UnaryOpTypes from './UnaryOpTypes'
import makeTaggedUnion from '../types/makeTaggedUnion'

export default makeTaggedUnion(nodeType => ({

  binaryOp: [
    ['type', Types.oneOf(BinaryOpTypes)],
    ['left', Types.nullable(nodeType)],
    ['right', Types.nullable(nodeType)],
  ],

  literal: [
    ['value', Types.nullable(Types.union(Types.STRING, Types.NUMBER))],
  ],

  unaryOp: [
    ['type', Types.oneOf(UnaryOpTypes)],
    ['right', Types.nullable(nodeType)],
  ],

  unit: [
    ['statements', ImmutableTypes.listOf(nodeType)],
  ],

}))
