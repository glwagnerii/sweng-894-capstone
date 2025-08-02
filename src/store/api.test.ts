import { describe, it, expect, vi } from 'vitest'
import { api, mealsApi, type Meal } from './api'
import { useDispatch, store } from './store'

// Mock fetchBaseQuery globally
vi.mock('@reduxjs/toolkit/query', async () => {
  const actual = await vi.importActual<typeof import('@reduxjs/toolkit/query')>('@reduxjs/toolkit/query')
  return {
    ...actual,
    fetchBaseQuery: vi.fn(() => () => Promise.resolve({ data: { meals: [{ idMeal: '1', strMeal: 'Mock Meal' }] } })),
  }
})

describe('api', () => {
  it('should have correct reducerPath', () => {
    expect(api.reducerPath).toBe('api')
  })

  it('should have 3 endpoints', () => {
    expect(Object.keys(api.endpoints)).toHaveLength(3)
  })
})

describe('Meal type', () => {
  it('should allow dynamic keys', () => {
    const meal: Meal = {
      idMeal: '1',
      strMeal: 'Test Meal',
      customField: 'custom',
    }
    expect(meal.customField).toBe('custom')
  })
})

describe('mealsApi endpoints', () => {
  const dispatch = useDispatch()
  it('should define getMealsByIngredient endpoint', () => {
    const endpoints = mealsApi.endpoints
    expect(endpoints.getMealsByIngredient).toBeDefined()
    expect(typeof endpoints.getMealsByIngredient.initiate).toBe('function')
  })

  it('should define getMealById endpoint', () => {
    const endpoints = mealsApi.endpoints
    expect(endpoints.getMealById).toBeDefined()
    expect(typeof endpoints.getMealById.initiate).toBe('function')
  })

  it('should define getMealsByName endpoint', () => {
    const endpoints = mealsApi.endpoints
    expect(endpoints.getMealsByName).toBeDefined()
    expect(typeof endpoints.getMealsByName.initiate).toBe('function')
  })

  it('should mock getMealsByIngredient initiate', async () => {
    await dispatch(mealsApi.endpoints.getMealsByIngredient.initiate('chicken'))
    const result = mealsApi.endpoints.getMealsByIngredient.select('chicken')(store.getState())
    expect(result.data?.meals).toEqual([{ idMeal: '1', strMeal: 'Mock Meal' }])
  })
  it('should mock getMealById initiate', async () => {
    await dispatch(mealsApi.endpoints.getMealById.initiate('1'))
    const result = mealsApi.endpoints.getMealById.select('1')(store.getState())
    expect(result.data?.meals).toEqual([{ idMeal: '1', strMeal: 'Mock Meal' }])
  })
  it('should mock getMealsByName initiate', async () => {
    await dispatch(mealsApi.endpoints.getMealsByName.initiate('Spaghetti'))
    const result = mealsApi.endpoints.getMealsByName.select('Spaghetti')(store.getState())
    expect(result.data?.meals).toEqual([{ idMeal: '1', strMeal: 'Mock Meal' }])
  })
})
