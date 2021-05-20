import type { QCRulesConfig } from '../../algorithms/QC/types'
import { getVirus } from '../../algorithms/defaults/viruses'

import { DEFAULT_LOCALE_KEY, LocaleKey } from '../../i18n/i18n'

export interface SettingsState {
  localeKeyV2: LocaleKey
  qcRulesConfig: QCRulesConfig
  showWhatsnewOnUpdate: boolean
  lastVersionSeen: string
  showAdvancedControls: boolean
}

export const settingsDefaultState: SettingsState = {
  localeKeyV2: DEFAULT_LOCALE_KEY,
  qcRulesConfig: getVirus().qcRulesConfig,
  showWhatsnewOnUpdate: true,
  lastVersionSeen: '',
  showAdvancedControls: false,
}
