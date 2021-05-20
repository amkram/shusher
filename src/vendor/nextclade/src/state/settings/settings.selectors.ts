import type { State } from '../reducer'
import { LocaleKey, LocaleWithKey, getLocaleWithKey } from '../../i18n/i18n'

export const selectLocaleKey = (state: State): LocaleKey => state.settings.localeKeyV2

export const selectLocale = (state: State): LocaleWithKey => getLocaleWithKey(selectLocaleKey(state))

export const selectQcRulesConfig = (state: State) => state.settings.qcRulesConfig
