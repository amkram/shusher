import { convertPcrPrimers } from '../../algorithms/primers/convertPcrPrimers'
import { validatePcrPrimerEntries, validatePcrPrimers } from '../../algorithms/primers/validatePcrPrimers'
import { parseCsv } from '../../io/parseCsv'
import { call, select, takeEvery } from 'typed-redux-saga'

import type { AlgorithmInput } from '../../state/algorithm/algorithm.state'
import fsaSaga from '../../state/util/fsaSaga'

import { parseSequences } from '../../algorithms/parseSequences'
import { qcRulesConfigValidate, qcRulesConfigDeserialize } from '../../algorithms/QC/qcRulesConfigValidate'
import { treeDeserialize, treeValidate } from '../../algorithms/tree/treeValidate'
import { sanitizeRootSeq } from '../../helpers/sanitizeRootSeq'
import { geneMapDeserialize, geneMapValidate, convertGeneMap } from '../../io/convertGeneMap'
import {
  setFasta,
  setGeneMap,
  setPcrPrimers,
  setQcSettings,
  setRootSeq,
  setTree,
} from '../../state/algorithm/algorithm.actions'
import { State } from '../reducer'

export function* loadFasta(input: AlgorithmInput) {
  const seqData = yield* call([input, input.getContent])
  return { seqData }
}

export function* loadTree(input: AlgorithmInput) {
  const content = yield* call([input, input.getContent])
  const auspiceData = treeValidate(treeDeserialize(content))

  const geneMapJson = geneMapValidate(auspiceData.meta?.genome_annotations)
  const geneMap = convertGeneMap(geneMapJson)

  return { auspiceData, geneMap }
}

export function* loadRootSeq(input: AlgorithmInput) {
  const content = yield* call([input, input.getContent])

  const sequences = parseSequences(content)
  const entries = Object.entries(sequences)
  const n = entries.length

  if (n !== 1) {
    throw new Error(`Expected exactly 1 root sequence, but received ${n}`)
  }

  const rootSeq = sanitizeRootSeq(entries[0][1])

  return { rootSeq }
}

export function* loadQcSettings(input: AlgorithmInput) {
  const content = yield* call([input, input.getContent])
  const qcRulesConfig = qcRulesConfigValidate(qcRulesConfigDeserialize(content))
  return { qcRulesConfig }
}

export function* loadGeneMap(input: AlgorithmInput) {
  const content = yield* call([input, input.getContent])
  const geneMapJsonDangerous = geneMapDeserialize(content)
  const geneMapJson = geneMapValidate(geneMapJsonDangerous)
  const geneMap = convertGeneMap(geneMapJson)
  return { geneMap }
}

export function* loadPcrPrimers(input: AlgorithmInput) {
  const content = yield* call([input, input.getContent])

  // TODO: this assumes that the correct root sequence is loaded before PCR primers
  //  Instead, we need to recalculate primers on every root sequence update
  const rootSeq = yield* select((state: State) => state.algorithm.params.virus.rootSeq)

  const primerEntries = validatePcrPrimerEntries(parseCsv(content))
  const pcrPrimers = validatePcrPrimers(convertPcrPrimers(primerEntries, rootSeq))

  return { pcrPrimers }
}

export default [
  takeEvery(setFasta.trigger, fsaSaga(setFasta, loadFasta)),
  takeEvery(setTree.trigger, fsaSaga(setTree, loadTree)),
  takeEvery(setRootSeq.trigger, fsaSaga(setRootSeq, loadRootSeq)),
  takeEvery(setQcSettings.trigger, fsaSaga(setQcSettings, loadQcSettings)),
  takeEvery(setGeneMap.trigger, fsaSaga(setGeneMap, loadGeneMap)),
  takeEvery(setPcrPrimers.trigger, fsaSaga(setPcrPrimers, loadPcrPrimers)),
]
