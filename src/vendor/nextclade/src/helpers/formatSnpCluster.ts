import type { ClusteredSNPs } from '../algorithms/types'
import { formatRange } from '../helpers/formatRange'

export function formatSnpCluster(cluster: ClusteredSNPs) {
  const { start, end, numberOfSNPs } = cluster
  const range = formatRange(start, end)
  return `${range}:${numberOfSNPs}`
}
