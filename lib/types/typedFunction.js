class ArgumentTypeError extends Error {
  constructor(reason, argName, argType) {
    super(
      `wrong argument type: \`${argName}\` ${reason}`
    )
    this.argName = argName
    this.argType = argType
  }
}

class ReturnTypeError extends Error {
  constructor(reason, retType) {
    super(
      `wrong return type: value ${reason}`
    )
    this.retType = retType
  }
}

/**
 * Specify types for a function argument and result.
 */
export default function typedFunction(argumentTypes, fn, retType) {
  return function (...args) {
    argumentTypes.forEach((argInfo, i) => {
      let reason = argInfo[1].validate(args[i])
      if (reason != null) {
        throw new ArgumentTypeError(reason, argInfo[0], argInfo[1])
      }
    })
    let result = fn(...args)
    if (retType != null) {
      let reason = retType.validate(result)
      if (reason != null) {
        throw new ReturnTypeError(reason, retType)
      }
    }
    return result
  }
}
