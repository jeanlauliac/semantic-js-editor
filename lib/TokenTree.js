import ImmutableIntervalMap from './utils/ImmutableIntervalMap'
import ImmutableType from './types/ImmutableType'
import TokenTypes from './TokenTypes'
import TokenizerContext from './TokenizerContext'
import SyntaxTree from './ast/SyntaxTree'
import Type from './types/Type'
import makeTaggedUnion from './types/makeTaggedUnion'

export default makeTaggedUnion('TokenTree', thisType => ({

  group: [
    ['syntaxTree', SyntaxTree.TYPE],
    ['context', Type.instanceOf(TokenizerContext)],
    // TODO: type the elements of the interval map.
    ['intervals', Type.instanceOf(ImmutableIntervalMap)],
    ['length', Type.NUMBER],
    ['namedChildren', ImmutableType.mapOf(Type.STRING, thisType)]
  ],

  token: [
    ['content', Type.STRING],
    ['type', Type.oneOf(TokenTypes)],
    ['insertChar', Type.nullable(Type.FUNCTION)],
    ['removeChar', Type.nullable(Type.FUNCTION)],
  ],

}))
