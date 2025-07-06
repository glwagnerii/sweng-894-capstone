import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { load } from '@tauri-apps/plugin-store'
import { type ViewName } from '../views'

export interface App {
  titleBar:   { title: string, visible: boolean }
  view:       { selected: ViewName, visible: boolean }
  theme:      { name: string, isDark: boolean }
  selected:   { name: string, url: string, ingredients: string[] }
  ingredient: { name: string }
  recipe:     { id: string }
  favorites: string[]
}

export const detectPlatform = () => {
  const ua = navigator.userAgent.toLowerCase()
  console.log(ua)
  if (/iphone|ipad|ipod/.test(ua)) return 'ios'
  if (/android/.test(ua)) return 'android'
  if (/mac/.test(ua)) return 'macos'
  if (/win/.test(ua)) return 'windows'
  if (/linux/.test(ua)) return 'linux'
  return 'desktop'
}

const app: App = {
  titleBar: { title: 'Classifi-Cam', visible: true },
  view:     { selected:'home', visible:true },
  theme:    {
    name: detectPlatform(),
    // isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
    isDark: true,
  },
  selected:   { name:'tomato-soup.jpg', url:'photos/tomato-soup.jpg', ingredients: ['tomatoes', 'onion', 'garlic', 'vegetable broth', 'cream'] },
  ingredient: { name:'beef' },
  recipe:     { id: '53071 ' },
  favorites: [],
}

// Thunks
export const addFavorite = createAsyncThunk<void, string>(
  'app/addFavorite',
  async (favorite, thunkAPI) => {
    thunkAPI.dispatch(appSlice.actions._addFavorite(favorite))
    await thunkAPI.dispatch(saveFavorites())
  },
)

export const removeFavorite = createAsyncThunk<void, string>(
  'app/removeFavorite',
  async (favorite, thunkAPI) => {
    thunkAPI.dispatch(appSlice.actions._removeFavorite(favorite))
    await thunkAPI.dispatch(saveFavorites())
  },
)

const STORE = 'classificam-store.json'
const FAV_KEY = 'favorites'

export const saveFavorites = createAsyncThunk(
  'app/saveFavorites',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as { app: App }
    const favorites = state.app.favorites
    console.log('save: ', favorites)
    const store = await load(STORE, { autoSave: false })
    await store.set(FAV_KEY, JSON.stringify(favorites))
    await store.save()
  },
)

export const getFavorites = createAsyncThunk(
  'app/getFavorites',
  async () => {
    const store = await load(STORE, { autoSave: false })
    const jsonFavorites = await store.get<string>(FAV_KEY)
    console.log(jsonFavorites)
    try   { return jsonFavorites ? JSON.parse(jsonFavorites) : [] }
    catch { return [] }
  },
)

export const appSlice = createSlice({
  name: 'app',
  initialState: app,
  reducers: {
    getRecipes:    (state, action) => { state.ingredient.name = action.payload.name; state.view.selected = 'recipe' },
    selectImage:   (state, action) => { state.selected = action.payload; state.view.selected = 'result' },
    showRecipe:    (state, action) => { state.recipe.id = action.payload.id; state.view.selected = 'http' },
    showMenu:      (state) => { state.view.selected = 'home' },
    themeDark:     (state) => { state.theme.isDark = true },
    themeLight:    (state) => { state.theme.isDark = false },
    viewCamera:    (state) => { state.view.selected = 'camera' },
    viewHome:      (state) => { state.view.selected = 'home' },
    viewHttp:      (state) => { state.view.selected = 'http' },
    viewLibrary:   (state) => { state.view.selected = 'library' },
    viewPath:      (state) => { state.view.selected = 'path' },
    viewRecipe:    (state) => { state.view.selected = 'recipe' },
    viewResult:    (state) => { state.view.selected = 'result' },
    // viewAIResult:  (state) => { state.view.selected = 'airecipe' },
    viewFavorites: (state) => { state.view.selected = 'favorites' },

    _addFavorite:   (state, action) => {
      const favorite = action.payload
      if (favorite && !state.favorites.includes(favorite)) { state.favorites.push(favorite) }
    },
    _removeFavorite: (state, action) => {
      const favorite = action.payload
      state.favorites = state.favorites.filter((id) => id !== favorite)
    },
    // testing navigation use case
    setView: (state, action: { payload: { selected: ViewName, visible: boolean } }) => {
      state.view.selected = action.payload.selected
      state.view.visible = action.payload.visible
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFavorites.fulfilled, (state, action) => { state.favorites = action.payload })
  },
})
