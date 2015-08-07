import readline from 'readline'

export default class StatusLogger {

  constructor(stream) {
    this._stream = stream
    this._hasStatus = false
  }

  /**
   * Set the status.
   */
  status(message) {
    if (this._status != null) {
      readline.clearLine(this._stream, 0)
      readline.cursorTo(this._stream, 0)
    }
    this._status = message
    if (this._status != null) {
      this._stream.write(this._status)
    }
  }

  /**
   * Writes a message.
   */
  log(message) {
    if (this._status == null) {
      this._stream.write(message + '\n')
      return
    }
    readline.clearLine(this._stream, 0)
    readline.cursorTo(this._stream, 0)
    this._stream.write(message + '\n')
    this._stream.write(this._status)
  }

}
