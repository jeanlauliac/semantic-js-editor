import {EventEmitter} from 'events'
import PrintContext from '../lib/PrintContext'
import nodeToLines from '../lib/nodeToLines'

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

  setUnit(unit) {
    this._unit = unit
    this._lines = nodeToLines(unit, new PrintContext())
  }
}

export default new JSEditorStore()
