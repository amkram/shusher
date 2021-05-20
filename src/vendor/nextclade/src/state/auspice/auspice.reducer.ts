import { reducerWithInitialState } from '../util/fsaReducer'

import { setLocale } from '../settings/settings.actions'

export const auspiceGeneralReducer = reducerWithInitialState<{ language?: string }>({ language: 'en' }) // prettier-ignore
  .icase(setLocale, (draft, localeKey) => {
    draft.language = localeKey
  })

export const auspiceQueryReducer = reducerWithInitialState({})
