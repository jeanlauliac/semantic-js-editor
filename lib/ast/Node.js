import BinaryOpTypes from './BinaryOpTypes'
import Immutable from 'immutable'
import Types from '../types/Types'
import UnaryOpTypes from './UnaryOpTypes'

export default {

  /**
   * Validates the argument as being a valid node object and return an frozen
   * copy of it.
   */
  any: (() => {

    const SECRET = Object.freeze({})
    const TYPE_OF_NODE = Types.where(value => value.__secret === SECRET)

    let NodeType = Types.taggedUnion({

      binaryOp: Types.object({
        left: Types.nullable(TYPE_OF_NODE),
        right: Types.nullable(TYPE_OF_NODE),
        type: Types.oneOf(UnaryOpTypes),
      }),

      literal: Types.object({
        value: Types.nullable(Types.union(Types.STRING, Types.NUMBER)),
      }),

      unaryOp: Types.object({
        right: Types.nullable(TYPE_OF_NODE),
        type: Types.oneOf(UnaryOpTypes),
      }),

      unit: Types.object({
        statements: Types.intersection(
          Types.instanceOf(Immutable.List),
          Types.where(value => value.every(node => TYPE_OF_NODE.validate(node)))
        ),
      }),

    })

    return (node) => {
      invariant(NodeType.validate(node), 'invalid node object')
      return Object.freeze({
        ...node,
        __secret: SECRET,
      });
    }

  })(),

  binaryOp(type, left, right) {
    return this.ofType('binaryOp', {left, right, type})
  }

  literal(value) {
    return this.ofType('literal', {value})
  },

  ofType(type, fields) {
    return this.any({...fields, type})
  }

  unaryOp(type, right) {
    return this.ofType('unaryOp', {right, type})
  }

  unit(type, statement) {
    return this.ofType('unit', {})
  }

}
