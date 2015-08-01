/**
 * Specify types for a function argument and result.
 */
export default function typedFunction(argumentTypes, retType, fn) {
  return function (...args) {
    argumentTypes.forEach((argInfo, i) => {
      let reason = argInfo[1].validate(args[i])
      if (reason != null) {
        try {
          throw argumentTypeError(reason, fn, i, argInfo[0], argInfo[1])
        } catch (error) {
          console.error(error)
        }
      }
    })
    let result = fn(...args)
    if (retType != null) {
      let reason = retType.validate(result)
      if (reason != null) {
        try {
          throw returnTypeError(reason, fn, retType)
        } catch (error) {
          console.error(error)
        }
      }
    }
    return result
  }
}

function argumentTypeError(reason, fn, argIndex, argName, argType) {
  let fnName = fn.name ? ` \`${fn.name}\`` : ''
  let error = new Error(
    `typed function${fnName}: argument #${argIndex}, \`${argName}\`, ${reason}`
  )
  error.fn = fn
  error.argIndex = argIndex
  error.argName = argName
  error.argType = argType
  return error
}

function returnTypeError(reason, fn, retType) {
  let fnName = fn.name ? ` \`${fn.name}\`` : ''
  let error = new Error(`typed function${fnName}: return value ${reason}`)
  error.fn = fn
  error.retType = retType
  return error
}
