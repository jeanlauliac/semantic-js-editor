import {EventEmitter} from 'events'
import Immutable from 'immutable'
import TokenizerContext from '../lib/TokenizerContext'
import insertChar from '../lib/insertChar'
import lineify from '../lib/lineify'
import removeChar from '../lib/removeChar'
import tokenize from '../lib/tokenize'

function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max)
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
    this._lines = new Immutable.List()
    this._unit = undefined
    this._caretTick(true)
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

  getPath() {
    let line = this._lines.get(this._caretState.position.line - 1)
    if (!line || line.tokens.size === 0) {
      return
    }
    let i = 0
    let column = 1
    while (
      column + line.tokens.get(i).content.length
        <= this._caretState.position.column
    ) {
      column += line.tokens.get(i++).content.length
      if (i >= line.tokens.size) {
        return
      }
    }
    return line.tokens.get(i).path
  }

  getUnit() {
    return this._unit
  }

  /**
   * Inserts the specified character at the current caret location.
   */
  insert(chr) {
    let line = this._lines.get(this._caretState.position.line - 1)
    if (!line || this._caretState.position.column > line.length) {
      return
    }
    let index = line.index + this._caretState.position.column - 1
    this.setUnit(insertChar(this._tokenGroup.intervals,
      this._tokenGroup.syntaxTree, chr, index))
    this.moveCaret(0, 1)
  }

  /**
   * Delete the character just before the current caret location.
   */
  delete() {
    if (this._caretState.position.column <= 1) {
      return
    }
    let line = this._lines.get(this._caretState.position.line - 1)
    if (!line || this._caretState.position.column > line.length) {
      return
    }
    let index = line.index + this._caretState.position.column - 2
    this.setUnit(removeChar(this._tokenGroup.intervals,
      this._tokenGroup.syntaxTree, index))
    this.moveCaret(0, -1)
  }

  moveCaret(lines, columns) {
    let position = this._caretState.position
    this._caretState = new CaretState({
      position: new CodePosition(
        clamp(position.line + lines, 1, this._lines.size),
        clamp(position.column + columns, 1, 80)
      ),
      visible: true,
    })
    this._caretTick(true)
    this.emit('change')
  }

  setUnit(unit) {
    this._unit = unit
    this._tokenGroup = tokenize(unit, new TokenizerContext())
    this._lines = lineify(this._tokenGroup.intervals)
    let lineIndex = this._caretState.position.line
    if (lineIndex > this._lines.size) {
      lineIndex = this._lines.size
    }
    let line = this._lines.get(lineIndex - 1)
    let columnIndex = this._caretState.position.column
    if (columnIndex > line.length) {
      columnIndex = line.length
    }
    this._caretState = new CaretState({
      position: new CodePosition(lineIndex, columnIndex),
      visible: true,
    })
  }
}

export default new JSEditorStore()
