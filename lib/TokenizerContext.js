import Immutable from 'immutable'

export default class TokenizerContext extends Immutable.Record({
  maxLineLength: 80,
  precedenceLevel: 0,
}) {
}
