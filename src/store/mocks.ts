import { writable } from 'svelte/store'
import { vi } from 'vitest'
import { mealsApi, type Meal, type RecentMeal } from './api'

// @ts-expect-error: return type does not match
mealsApi.endpoints.getMealById.initiate = (id: string) => ({ arg: id })

export const meal: Meal[] = [
  { idMeal: '1', strMeal: 'Meal 1', strCategory: 'Cat1', strMealThumb: 'img1.jpg' },
  { idMeal: '2', strMeal: 'Meal 2', strCategory: 'Cat2', strMealThumb: 'img2.jpg' },
  { idMeal: '52772', strMeal: 'Meal 2', strCategory: 'Cat2', strMealThumb: 'img2.jpg' },
]

const recent: RecentMeal[] = [
  { idMeal: '52772', strMeal: 'Meal 2', strMealThumb: 'img1.jpg', viewedAt: new Date().toISOString() },
]

export const id = writable('1')
export const favorites = writable(['1', '2'])
export const meals = writable({ error: false, isLoading: false, data: { meals: meal as Meal[] | null } })
export const recents = writable(recent)
export const name = writable('beef')
export const checklist = writable({ 1: { instructions: [], ingredients: [] } })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dispatchedActions: any[] = []

export const mockDispatch = vi.fn((action) => {
  if (action && typeof action === 'object' && 'arg' in action) {
    return {
      unwrap: () => Promise.resolve({ meals: meal.filter((m) => m.idMeal === action.arg) }),
    }
  }
  else if (action && typeof action === 'function') {
    dispatchedActions.length = 0
    action(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (dispatched: any) => {
        dispatchedActions.push(dispatched)
        return dispatched
      },
    //   () => {
    //     return { /* mock state */ }
    //   }
    )
  }
  return Promise.resolve()
})

export function setupStoreMocks() {
  vi.mock('../store', () => ({
    useSelector: (fn: (state: unknown) => unknown) => {
      if (fn.toString().includes('id')) return id
      if (fn.toString().includes('name')) return name
      if (fn.toString().includes('favorites')) return favorites
      if (fn.toString().includes('getMealById')) return meals
      if (fn.toString().includes('checklist')) return checklist
      if (fn.toString().includes('state.app.recentsList')) return recents
      return writable(null)
    },
    useDispatch: () => mockDispatch,
  }))
}
