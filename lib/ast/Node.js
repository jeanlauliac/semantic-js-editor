import BinaryOpTypes from './BinaryOpTypes'
import ImmutableType from '../types/ImmutableType'
import Type from '../types/Type'
import UnaryOpTypes from './UnaryOpTypes'
import makeTaggedUnion from '../types/makeTaggedUnion'

export default makeTaggedUnion('Node', nodeType => ({

  binaryOp: [
    ['type', Type.oneOf(BinaryOpTypes)],
    ['left', Type.nullable(nodeType)],
    ['right', Type.nullable(nodeType)],
  ],

  literal: [
    ['value', Type.nullable(Type.union(Type.STRING, Type.NUMBER))],
  ],

  unaryOp: [
    ['type', Type.oneOf(UnaryOpTypes)],
    ['right', Type.nullable(nodeType)],
  ],

  unit: [
    ['statements', ImmutableType.listOf(nodeType)],
  ],

}))
