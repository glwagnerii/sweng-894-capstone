import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query'

// import { type BaseQueryFn } from '@reduxjs/toolkit/query'
// import { load } from '@tauri-apps/plugin-store'

// const STORE = 'mealdb-cache.dat'
// const persistentBaseQuery: BaseQueryFn = async (args, api, extraOptions) => {
//   // Create a unique cache key
//   const cacheKey = JSON.stringify(args)
//   const store = await load(STORE, { autoSave: false })

//   const cached = await store.get(cacheKey)
//   if (cached) { return { data: cached } }

//   // Otherwise, fetch from API
//   const rawResult = await fetchBaseQuery({ baseUrl: 'https://www.themealdb.com/api/json/v1/1/' })(args, api, extraOptions)
//   if (rawResult.data) {
//     await store.set(cacheKey, rawResult.data)
//     await store.save()
//   }
//   return rawResult
// }

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
    getMealsByName: builder.query<{ meals: Meal[] | null }, string>({
      query: (name) => `search.php?s=${name}`,
    }),
    // Add more endpoints here as needed
  }),

  overrideExisting: false,
})
