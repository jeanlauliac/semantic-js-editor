import BinaryOpTypes from './BinaryOpTypes'
import ImmutableType from '../types/ImmutableType'
import Type from '../types/Type'
import UnaryOpTypes from './UnaryOpTypes'
import makeTaggedUnion from '../types/makeTaggedUnion'

export default makeTaggedUnion('SyntaxTree', treeType => ({

  binaryOp: [
    ['type', Type.oneOf(BinaryOpTypes)],
    ['left', Type.nullable(treeType)],
    ['right', Type.nullable(treeType)],
  ],

  literal: [
    ['value', Type.nullable(Type.union(Type.STRING, Type.NUMBER))],
  ],

  unaryOp: [
    ['type', Type.oneOf(UnaryOpTypes)],
    ['right', Type.nullable(treeType)],
  ],

  unit: [
    ['statements', ImmutableType.listOf(treeType)],
  ],

}))
