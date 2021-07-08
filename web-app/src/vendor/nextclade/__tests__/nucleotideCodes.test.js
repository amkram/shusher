/* From nextclade
 * https://github.com/nextstrain/nextclade
 * Modifications: 
 *  - removed typescript types
 *  - toBeTrue() -> toBeTruthy() 
 *  - toBeFalse() -> toBeFalsy()
 */

import { isMatch } from '../nucleotideCodes'

describe('isMatch', () => {
  it('should match any canonical with N', () => {
    expect(isMatch('N', 'A')).toBeTruthy()
    expect(isMatch('A', 'N')).toBeTruthy()
  })

  it('should match any ambiguous with N', () => {
    expect(isMatch('N', 'S')).toBeTruthy()
    expect(isMatch('S', 'N')).toBeTruthy()
  })

  it('should match ambiguous R with A', () => {
    expect(isMatch('R', 'A')).toBeTruthy()
    expect(isMatch('A', 'R')).toBeTruthy()
  })

  it('should NOT match ambiguous R with C', () => {
    expect(isMatch('R', 'C')).toBeFalsy()
    expect(isMatch('C', 'R')).toBeFalsy()
  })

  it('should match ambiguous S with C', () => {
    expect(isMatch('S', 'C')).toBeTruthy()
    expect(isMatch('C', 'S')).toBeTruthy()
  })

  it('should NOT match ambiguous S with A', () => {
    expect(isMatch('A', 'S')).toBeFalsy()
    expect(isMatch('S', 'A')).toBeFalsy()
  })
})
