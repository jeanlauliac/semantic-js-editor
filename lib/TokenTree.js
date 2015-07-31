import ImmutableIntervalMap from './utils/ImmutableIntervalMap'
import TokenTypes from './TokenTypes'
import SyntaxTree from './ast/SyntaxTree'
import Type from './types/Type'
import makeTaggedUnion from './types/makeTaggedUnion'

export default makeTaggedUnion('TokenTree', () => ({

  group: [
    ['syntaxTree', SyntaxTree.TYPE],
    // TODO: type the elements of the interval map.
    ['intervals', Type.instanceOf(ImmutableIntervalMap)],
    ['length', Type.NUMBER],
  ],

  token: [
    ['content', Type.STRING],
    ['type', Type.oneOf(TokenTypes)],
    ['insertChar', Type.nullable(Type.FUNCTION)],
    ['removeChar', Type.nullable(Type.FUNCTION)],
  ],

}))
