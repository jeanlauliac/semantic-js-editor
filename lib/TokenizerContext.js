import Immutable from 'immutable'

export default class TokenizerContext extends Immutable.Record({
  maxLineLength: 80,
  precedenceLevel: 0,
}) {
}

TokenizerContext.areSimilar = (a, b) =>
  a.maxLineLength === b.maxLineLength &&
  a.precedenceLevel === b.precedenceLevel
