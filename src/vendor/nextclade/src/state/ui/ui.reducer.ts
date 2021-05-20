import { reducerWithInitialState } from '../util/fsaReducer'

import { uiDefaultState } from './ui.state'
import {
  setExportFormat,
  setFilterPanelCollapsed,
  setShowNewRunPopup,
  setShowWhatsnew,
  setTreeFilterPanelCollapsed,
} from './ui.actions'

export const uiReducer = reducerWithInitialState(uiDefaultState)
  .icase(setExportFormat, (draft, exportFormat) => {
    draft.exportFormat = exportFormat
  })

  .icase(setFilterPanelCollapsed, (draft, filterPanelCollapsed) => {
    draft.filterPanelCollapsed = filterPanelCollapsed
  })

  .icase(setTreeFilterPanelCollapsed, (draft, treeFilterPanelCollapsed) => {
    draft.treeFilterPanelCollapsed = treeFilterPanelCollapsed
  })

  .icase(setShowWhatsnew, (draft, showWhatsnew) => {
    draft.showWhatsnew = showWhatsnew
  })

  .icase(setShowNewRunPopup, (draft, showNewRunPopup) => {
    draft.showNewRunPopup = showNewRunPopup
  })
