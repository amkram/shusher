import type { NucleotideInsertion } from '../algorithms/types'

export function formatInsertion({ pos, ins }: NucleotideInsertion) {
  return `${pos}:${ins}`
}
