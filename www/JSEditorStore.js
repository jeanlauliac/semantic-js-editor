import {EventEmitter} from 'events'
import PrintContext from '../lib/PrintContext'
import nodeToLines from '../lib/nodeToLines'

function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

class JSEditorStore extends EventEmitter {
  constructor() {
    super()
    this._caret = {column: 3, line: 2}
    this._lines = []
    this._unit = undefined;
  }

  getCaret() {
    return this._caret
  }

  getLines() {
    return this._lines
  }

  getUnit() {
    return this._unit
  }

  moveCaret(lines, columns) {
    this._caret = {
      column: clamp(this._caret.column + columns, 1, 80),
      line: clamp(this._caret.line + lines, 1, this._lines.length)
    }
    this.emit('change')
  }

  setUnit(unit) {
    this._unit = unit
    this._lines = nodeToLines(unit, new PrintContext())
  }
}

export default new JSEditorStore()
