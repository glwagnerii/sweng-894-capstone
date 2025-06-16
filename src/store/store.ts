import { configureStore, type StoreEnhancer } from '@reduxjs/toolkit'
import { derived, type Readable } from 'svelte/store'
import { appSlice } from './appSlice'

// Svelte store enhancer so Redux store can behave like a Svelte readable
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

// Create the enhanced Redux store
export const store = configureStore({
  reducer: {
    [appSlice.name]: appSlice.reducer,
  },
  enhancers: (gDE) => gDE().prepend(svelteStoreEnhancer),
})

// Export types for state, dispatch, etc.
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
export type SvelteStore = typeof store & Readable<RootState>

// Use to dispatch Redux actions
export const useDispatch = (): AppDispatch => store.dispatch

// Use to access derived state as a Svelte store
export const useSelector = <S>(selector: (state: RootState) => S): Readable<S> =>
  derived(store as SvelteStore, ($state) => selector($state))
