import { NucleotideRange } from '../algorithms/types'
import { formatRange } from '../helpers/formatRange'

export function formatNonAcgtn({ nuc, begin, end }: NucleotideRange) {
  const range = formatRange(begin, end)
  return `${nuc}:${range}`
}
