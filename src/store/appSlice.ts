import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { load } from '@tauri-apps/plugin-store'
import { type ViewName } from '../views'

export type Detection = {
  class: string
  score: number
  bbox: [number, number, number, number] // [x, y, width, height]
}

export interface App {
  titleBar:   { title: string, visible: boolean }
  view:       { selected: ViewName, visible: boolean }
  theme:      { name: string, isDark: boolean }
  results:    { name: string, base64: string, detections: Detection[] }
  ingredient: { name: string }
  recipe:     { id: string }
  favorites: string[]
}

export const detectPlatform = () => {
  const ua = navigator.userAgent.toLowerCase()
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
  results:    { name:'', base64:'', detections: [] },
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
    try   { return jsonFavorites ? JSON.parse(jsonFavorites) : [] }
    catch { return [] }
  },
)

export const appSlice = createSlice({
  name: 'app',
  initialState: app,
  reducers: {

    // viewAIResult:  (state) => { state.view.selected = 'airecipe' },
    showMenu:      (state) => { state.view.selected = 'home' },
    themeDark:     (state) => { state.theme.isDark = true },
    themeLight:    (state) => { state.theme.isDark = false },

    viewCamera:    (state) => { state.view.selected = 'camera' },
    viewDetails:   (state, action) => { if (action.payload) { state.recipe.id = action.payload.id }; state.view.selected = 'details' },
    viewFavorites: (state) => { state.view.selected = 'favorites' },
    viewHome:      (state) => { state.view.selected = 'home' },
    viewLibrary:   (state) => { state.view.selected = 'library' },
    viewMatches:   (state, action) => { if (action.payload) { state.ingredient.name = action.payload.name }; state.view.selected = 'matches' },
    viewPath:      (state) => { state.view.selected = 'path' },
    viewResults:   (state, action) => { if (action.payload) { state.results = action.payload }; state.view.selected = 'results' },
    viewSettings:  (state) => { state.view.selected = 'settings' },

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
