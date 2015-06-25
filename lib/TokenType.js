import enumerate from './utils/enumerate'

var TokenType = enumerate('TokenType', {
  IDENTIFIER: null,
  NUMBER: null,
  OPERATOR: null,
  WHITE_SPACE: null,
})

export default TokenType
