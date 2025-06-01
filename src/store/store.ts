import { configureStore, type EnhancedStore, type StoreEnhancer } from '@reduxjs/toolkit'
import { derived, type Readable } from 'svelte/store'

import { appSlice } from './appSlice'

// create an enhancer to use redux store as svelte store (must prepend default enhancers)
// svelte store subscribe signature ...subscribe(listener: ListenerCallback): Unsubscribe
//   our listener is "fn" and the reduxStore unsubscribe will unsubscribe from svelte store too

const svelteStoreEnhancer: StoreEnhancer = (createStore) => (reducer, initialState) => {
  const reduxStore = createStore(reducer, initialState)
  return {
    ...reduxStore,
    subscribe(fn: (value: ReturnType<typeof reduxStore.getState>) => void) {
      fn(reduxStore.getState())
      return reduxStore.subscribe(() => { fn(reduxStore.getState()) })
    },
  }
}

const store = configureStore({
  reducer: {
    [appSlice.name]: appSlice.reducer,
  },
  enhancers: (gDE) => gDE().prepend(svelteStoreEnhancer),
})

export type RootState = ReturnType<typeof store.getState>
export type SvelteStore = EnhancedStore<RootState> & Readable<RootState>
export type AppDispatch = typeof store.dispatch
export type AppStore = ReturnType<typeof configureStore>

export const useDispatch = (): AppDispatch => store.dispatch
export const useSelector = <S>(selector: (state: RootState) => S): Readable<S> => derived(store as SvelteStore, ($state: RootState) => selector($state))
