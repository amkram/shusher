import type { PcrPrimerChange } from '../algorithms/types'
import { formatMutation } from '../helpers/formatMutation'

export function formatPrimer(primerChange: PcrPrimerChange) {
  const { name } = primerChange.primer
  const muts = primerChange.substitutions.map(formatMutation).join(';')
  return `${name}:${muts}`
}
