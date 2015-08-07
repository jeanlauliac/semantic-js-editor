import {exec} from 'child_process'

var promiseExec = (command, id) => new Promise((accept, reject) => {
  var header = `exec(${id}):`
  console.log(header, command);
  exec(command, (error, stdout, stderr) => {
    process.stdout.write(stdout)
    process.stderr.write(stderr)
    if (error != null) {
      console.log(header, 'failed')
      reject()
    } else {
      console.log(header, 'done')
      accept()
    }
  })
})

class ExecPool {
  constructor() {
    this._nextID = 1
  }

  promise(command) {
    return promiseExec(command, this._nextID++)
  }
}

export default ExecPool
