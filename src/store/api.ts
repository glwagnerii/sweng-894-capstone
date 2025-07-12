import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://www.themealdb.com/api/json/v1/1/' }),
  endpoints: () => ({}),
})

export type Meal = {
  idMeal: string
  strMeal: string
  strMealThumb?: string
  strDrinkAlternate?: string | null
  strCategory?: string
  strArea?: string
  strInstructions?: string
  strTags?: string | null
  strYoutube?: string
  [key: string]: string | null | undefined
}

export const mealsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMealsByIngredient: builder.query<{ meals: Meal[] }, string>({
      query: (ingredient) => `filter.php?i=${ingredient}`,
    }),
    getMealById: builder.query<{ meals: Meal[] }, string>({
      query: (id) => `lookup.php?i=${id}`,
    }),
    // Add more endpoints here as needed
  }),
  overrideExisting: false,
})
