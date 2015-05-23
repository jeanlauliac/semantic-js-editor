import {EventEmitter} from 'events'
import Immutable from 'immutable'
import PrintContext from '../lib/PrintContext'
import nodeToLines from '../lib/nodeToLines'

function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

class CodePosition extends Immutable.Record({line: 1, column: 1}) {
  constructor(line, column) {
    super({line, column})
  }
}

class CaretState extends Immutable.Record({
  position: new CodePosition(1, 1),
  visible: true,
}) {}

class JSEditorStore extends EventEmitter {
  constructor() {
    super()
    this._caretState = new CaretState()
    this._lines = []
    this._unit = undefined;
    this._caretTick(true);
  }

  _caretTick(visible) {
    this._caretState = this._caretState.set('visible', visible)
    clearTimeout(this._caretTimeout)
    this._caretTimeout = setTimeout(this._caretTick.bind(this, !visible), 700)
    this.emit('change')
  }

  getCaretState() {
    return this._caretState
  }

  getLines() {
    return this._lines
  }

  getUnit() {
    return this._unit
  }

  moveCaret(lines, columns) {
    let position = this._caretState.position
    this._caretState = new CaretState({
      position: new CodePosition(
        clamp(position.line + lines, 1, this._lines.length),
        clamp(position.column + columns, 1, 80)
      ),
      visible: true
    })
    this._caretTick(true)
    this.emit('change')
  }

  setUnit(unit) {
    this._unit = unit
    this._lines = nodeToLines(unit, new PrintContext())
  }
}

export default new JSEditorStore()
