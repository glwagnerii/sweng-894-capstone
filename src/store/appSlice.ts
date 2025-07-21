import { createAsyncThunk, createSlice, type AsyncThunk, type PayloadActionCreator } from '@reduxjs/toolkit'
import { load } from '@tauri-apps/plugin-store'
import { type ViewName } from '../views'

export type Detection = {
  class: string
  score: number
  bbox: [number, number, number, number] // [x, y, width, height]
}

export type Model = {
  selected: string
}

export type Models = {
  name: string
  desc: string
  file: string
  size: string
  conf: number
  iou: number
  shape: string
}

export interface App {
  titleBar:   { title: string, visible: boolean }
  view:       { selected: ViewName, visible: boolean }
  theme:      { name: string, isDark: boolean }
  results:    { name: string, base64: string, detections: Detection[] }
  ingredient: { name: string }
  recipe:     { id: string }
  favorites:  string[]
  model:      Model
  models:     Models[]
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
  ingredient: { name:'' },
  recipe:     { id: '' },
  favorites:  [],
  model:      { selected:'' },
  models:     [],
}

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

    searchByName: (state, action) => {
      const name = action.payload?.name
      if (typeof name === 'string') {
        state.results.name = name
        state.view.selected = 'results'
      }
    },
    searchByIngredient: (state, action) => {
      const name = action.payload?.name
      if (typeof name === 'string') {
        state.ingredient.name = name
        state.results.name = ''
        state.view.selected = 'results'
      }
    },

    _addFavorite:   (state, action) => {
      const favorite = action.payload
      if (favorite && !state.favorites.includes(favorite)) { state.favorites.push(favorite) }
    },
    _deleteFavorite: (state, action) => {
      const favorite = action.payload
      state.favorites = state.favorites.filter((id) => id !== favorite)
    },

    // model reducers
    _addModel: (state, action) => {
      const model = action.payload
      if (!state.models.some((m) => m.file === model.file)) { state.models.push(model) }
    },
    _deleteModel: (state) => { state.models = state.models.filter((m) => m.file !== state.model.selected) },
    _selectModel: (state, action) => { state.model.selected = action.payload },
    _updateModel: (state, action) => {
      const idx = state.models.findIndex((m) => m.file === state.model.selected)
      if (idx !== -1) { state.models[idx] = { ...state.models[idx], ...action.payload } }
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
      .addCase(getModels.fulfilled, (state, action) => { state.models = action.payload })
      .addCase(getModel.fulfilled, (state, action) => { state.model = action.payload })
  },
})

// Generic thunk factory: dispatches a reducer action, then persists the change using a save thunk

function createActionAndSaveThunk<Arg>(
  type: string,
  reducerAction: PayloadActionCreator<Arg>,
  saveThunk: AsyncThunk<void, void, object>,
) {
  return createAsyncThunk<void, Arg>(
    type,
    async (arg, thunkAPI) => {
      thunkAPI.dispatch(reducerAction(arg))
      await thunkAPI.dispatch(saveThunk())
    },
  )
}

// Generic thunk factories for saving and loading state slices to persistent storage.
// Use createSaveThunk to persist a specific key from the app state,
//     and createGetThunk to load and parse that key from storage at startup or on demand.
// Add extraReducers above for fulfilled actions (get***.fulfilled) to update state after read from store

const STORE = 'classificam-store.json'
const FAV_KEY = 'favorites'
const MODELS_KEY = 'models'
const MODEL_KEY = 'model'

function createSaveThunk<T>(key: string, selector: (state: App) => T) {
  return createAsyncThunk(
    `app/save_${key}`,
    async (_, thunkAPI) => {
      const state = thunkAPI.getState() as { app: App }
      const value = selector(state.app)
      const store = await load(STORE, { autoSave: false })
      await store.set(key, value)
      await store.save()
    },
  )
}

function createGetThunk<T>(key: string, defaultValue: T) {
  return createAsyncThunk<T, void>(
    `app/get_${key}`,
    async () => {
      const store = await load(STORE, { autoSave: false })
      const value = await store.get<T>(key)
      return value ?? defaultValue
    },
  )
}

export const saveFavorites = createSaveThunk(FAV_KEY, (app) => app.favorites)
export const getFavorites = createGetThunk<string[]>(FAV_KEY, [])
export const saveModels = createSaveThunk(MODELS_KEY, (app) => app.models)
export const getModels = createGetThunk<Models[]>(MODELS_KEY, [])
export const saveModel = createSaveThunk(MODEL_KEY, (app) => app.model)
export const getModel = createGetThunk<Model>(MODEL_KEY, { selected: '' })

// Thunks that wrap reducer actions for favorites and models, then persist changes to storage.
// Use these instead of dispatching the reducer actions directly to ensure state is saved.

export const addFavorite    = createActionAndSaveThunk('app/addFavorite',    appSlice.actions._addFavorite,    saveFavorites)
export const deleteFavorite = createActionAndSaveThunk('app/deleteFavorite', appSlice.actions._deleteFavorite, saveFavorites)

export const addModel    = createActionAndSaveThunk('app/addModel',    appSlice.actions._addModel,    saveModels)
export const deleteModel = createActionAndSaveThunk('app/deleteModel', appSlice.actions._deleteModel, saveModels)
export const updateModel = createActionAndSaveThunk('app/updateModel', appSlice.actions._updateModel, saveModels)

export const selectModel = createActionAndSaveThunk('app/selectModel', appSlice.actions._selectModel, saveModel)
