import { getVirus } from '../../algorithms/defaults/viruses'
import { reducerWithInitialState } from '../util/fsaReducer'

import {
  resetQcRulesConfig,
  setLastVersionSeen,
  setLocale,
  setQcRulesConfig,
  setShowAdvancedControls,
  setShowWhatsnewOnUpdate,
} from './settings.actions'
import { settingsDefaultState } from './settings.state'

export const settingsReducer = reducerWithInitialState(settingsDefaultState)
  .icase(setLocale, (draft, localeKey) => {
    draft.localeKeyV2 = localeKey
  })

  .icase(setQcRulesConfig, (draft, qcRulesConfig) => {
    draft.qcRulesConfig = qcRulesConfig
  })

  .icase(resetQcRulesConfig, (draft) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('TODO: remove this action')
    }
    draft.qcRulesConfig = getVirus().qcRulesConfig
  })

  .icase(setShowWhatsnewOnUpdate, (draft, showWhatsnewOnUpdate) => {
    draft.showWhatsnewOnUpdate = showWhatsnewOnUpdate
  })

  .icase(setLastVersionSeen, (draft, lastVersionSeen) => {
    draft.lastVersionSeen = lastVersionSeen
  })

  .icase(setShowAdvancedControls, (draft, showAdvancedControls) => {
    draft.showAdvancedControls = showAdvancedControls
  })
