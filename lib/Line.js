import Fragment from './Fragment'
import Immutable from 'immutable'
import invariant from './utils/invariant'

/**
 * A line is a single line of code that could have been generated from
 * several nodes, or only be part of a single node expansion.
 */
export default class Line extends Immutable.Record({
  /**
   * `Immutable.List<Fragment>`. Each part of the line.
   */
  fragments: null,
}) {
  constructor(fragments) {
    invariant(fragments instanceof Immutable.List, 'not an Immutable.List')
    fragments.forEach((fragment) => {
      invariant(fragment instanceof Fragment, 'not a list of Fragment')
    })
    super({fragments})
  }

  /**
   * Takes an Array<Array<Line>>, and merge the groups of lines in a such way
   * that the last line of each group is merged with the first line of the next.
   * Returns an Array<Line>>.
   */
  static flatten(groups) {
    debugger;
    if (groups.length === 0) {
      return []
    }
    if (groups.length === 1) {
      return groups[0]
    }
    let lines = []
    let workingFragments = groups[0][0].fragments
    let i = 0
    for (; i < groups.length - 1; ++i) {
      let groupLines = groups[i]
      if (groupLines.length === 1) {
        workingFragments = workingFragments.concat(groupLines[0].fragments)
        continue
      }
      lines.push(new Line(workingFragments.concat(
        groupsLines[0].fragments
      )))
      workingFragments = []
      let j = 1
      for (; j < groupLines.length - 1; ++j) {
        lines.push(groupLines[j])
      }
      workingFragments = groupLines[j].fragments
    }
    let groupLines = groups[i]
    lines.push(new Line(workingFragments.concat(
      groupLines[0].fragments
    )))
    for (let j = 1; j < groupLines.length; ++j) {
      lines.push(groupLines[j])
    }
    return lines
  }
}
