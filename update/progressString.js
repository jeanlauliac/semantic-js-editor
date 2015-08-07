export default function progressString(length, phase) {
  let space = length - 5
  let pos = phase % (space * 2)
  pos = pos >= space ? space * 2 - pos : pos
  return '[' + repeatString(' ', pos)
    + '<=>' + repeatString(' ', space - pos) + ']'
}

function repeatString(str, count) {
  return new Array(count + 1).join(str)
}
