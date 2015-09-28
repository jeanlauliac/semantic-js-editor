export default function padText(text, length) {
  if (text.length >= length) {
    return text
  }
  return text + new Array(length - text.length + 1).join(' ')
}
