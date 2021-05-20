import { Pool } from 'threads'

import type { ParseThread } from './worker.parse'
import type { AnalyzeThread } from './worker.analyze'
import type { TreeBuildThread } from './worker.treeFindNearest'
import type { RunQcThread } from './worker.runQc'
import type { TreeFinalizeThread } from './worker.treeAttachNodes'

export interface WorkerPools {
  threadParse: ParseThread
  poolAnalyze: Pool<AnalyzeThread>
  threadTreeBuild: TreeBuildThread
  poolRunQc: Pool<RunQcThread>
  threadTreeFinalize: TreeFinalizeThread
}
