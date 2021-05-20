import type { Router } from 'next/router'

import { configureStore } from './state/store'
import { createWorkerPools } from './workers/createWorkerPools'
import { setLocale } from './state/settings/settings.actions'

export interface InitializeParams {
  router: Router
}

const allowResultsPage = process.env.NODE_ENV === 'development' && process.env.DEBUG_SET_INITIAL_DATA === 'true'

export async function initialize({ router }: InitializeParams) {


  void router.prefetch('/') // eslint-disable-line no-void
  void router.prefetch('/results') // eslint-disable-line no-void

  const workerPools = await createWorkerPools()

  const { persistor, store } = await configureStore({ router, workerPools })

  const { localeKeyV2, lastVersionSeen, showWhatsnewOnUpdate } = store.getState().settings
  store.dispatch(setLocale(localeKeyV2))


  return { persistor, store }
}
