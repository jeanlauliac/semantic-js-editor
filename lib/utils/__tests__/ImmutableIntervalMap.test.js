jest
  .dontMock('../ImmutableIntervalMap')
  .dontMock('immutable')
  .dontMock('../invariant')

import ImmutableIntervalMap from '../ImmutableIntervalMap'

var compareNumbers = (a, b) => a - b

describe('ImmutableIntervalMap', () => {
  it('works', () => {
    var map = new ImmutableIntervalMap([
      [0, 'foo'],
      [3, 'bar'],
      [9, 'baz'],
      [13, 'glo'],
      [21, 'tyu'],
      [27, 'ash'],
    ], compareNumbers)
    expect(map.get(-Infinity)).toBe(undefined)
    expect(map.get(-3)).toBe(undefined)
    expect(map.get(0)).toBe('foo')
    expect(map.get(1)).toBe('foo')
    expect(map.get(3)).toBe('bar')
    expect(map.get(8)).toBe('bar')
    expect(map.get(9)).toBe('baz')
    expect(map.get(12)).toBe('baz')
    expect(map.get(13)).toBe('glo')
    expect(map.get(21)).toBe('tyu')
    expect(map.get(27)).toBe('ash')
    expect(map.get(30)).toBe('ash')
    expect(map.get(Infinity)).toBe('ash')
  })

  it('works with empty map', () => {
    var map = new ImmutableIntervalMap([], compareNumbers)
    expect(map.get(0)).toBe(undefined)
    expect(map.get(10)).toBe(undefined)
  })
})
