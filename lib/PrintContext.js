import Immutable from 'immutable'

export default class PrintContext extends Immutable.Record({
  maxLineLength: 80,
  precedenceLevel: 0,
}) {
}
