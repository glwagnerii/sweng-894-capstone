import { describe, it, expect, afterEach, type Mock } from 'vitest'
import { store, useDispatch } from './'
import { detectPlatform, saveModel, getModel, addModel, deleteModel, updateExpire } from './appSlice'

import * as pluginStore from '@tauri-apps/plugin-store'

vi.mock('@tauri-apps/plugin-store', () => ({
  load: vi.fn().mockResolvedValue({
    set: vi.fn(),
    save: vi.fn(),
    get: vi.fn(),
  }),
}))

describe('dispatch actions change states', () => {
  const dispatch = useDispatch()
  it('showMenu sets view.selected to home', () => {
    dispatch({ type: 'app/themeLight' })
    dispatch({ type: 'app/themeDark' })
    expect(store.getState().app.theme.isDark).toBe(true)
  })

  it('showMenu sets view.selected to home', () => {
    dispatch({ type: 'app/themeDark' })
    dispatch({ type: 'app/themeLight' })
    expect(store.getState().app.theme.isDark).toBe(false)
  })

  it('showMenu sets view.selected to home', () => {
    dispatch({ type: 'app/viewCamera' })
    dispatch({ type: 'app/showMenu' })
    expect(store.getState().app.view.selected).toBe('home')
  })

  it('viewCamera sets view.selected to camera', () => {
    dispatch({ type: 'app/viewHome' })
    dispatch({ type: 'app/viewCamera' })
    expect(store.getState().app.view.selected).toBe('camera')
  })

  it('viewHome sets view.selected to home', () => {
    dispatch({ type: 'app/viewCamera' })
    dispatch({ type: 'app/viewHome' })
    expect(store.getState().app.view.selected).toBe('home')
  })

  it('viewHttp sets view.selected to http', () => {
    dispatch({ type: 'app/viewCamera' })
    dispatch({ type: 'app/viewDetails' })
    expect(store.getState().app.view.selected).toBe('details')
  })

  it('viewLibrary sets view.selected to library', () => {
    dispatch({ type: 'app/viewCamera' })
    dispatch({ type: 'app/viewLibrary' })
    expect(store.getState().app.view.selected).toBe('library')
  })
  it('viewPath sets view.selected to path', () => {
    dispatch({ type: 'app/viewCamera' })
    dispatch({ type: 'app/viewPath' })
    expect(store.getState().app.view.selected).toBe('path')
  })
  it('viewRecipe sets view.selected to recipe', () => {
    dispatch({ type: 'app/viewCamera' })
    dispatch({ type: 'app/viewMatches' })
    expect(store.getState().app.view.selected).toBe('matches')
  })
  it('viewResult sets view.selected to result', () => {
    dispatch({ type: 'app/viewCamera' })
    dispatch({ type: 'app/viewResults' })
    expect(store.getState().app.view.selected).toBe('results')
  })
})

describe('detectPlatform', () => {
  const originalUserAgent = navigator.userAgent

  function setUserAgent(ua: string) {
    Object.defineProperty(navigator, 'userAgent', { value: ua, configurable: true })
  }

  afterEach(() => { setUserAgent(originalUserAgent) })

  it('detects iOS', () => {
    setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)')
    expect(detectPlatform()).toBe('ios')
  })

  it('detects Android', () => {
    setUserAgent('Mozilla/5.0 (Linux; Android 10; SM-G970F)')
    expect(detectPlatform()).toBe('android')
  })

  it('detects macOS', () => {
    setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
    expect(detectPlatform()).toBe('macos')
  })

  it('detects Windows', () => {
    setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
    expect(detectPlatform()).toBe('windows')
  })

  it('detects Linux', () => {
    setUserAgent('Mozilla/5.0 (X11; Linux x86_64)')
    expect(detectPlatform()).toBe('linux')
  })

  it('returns desktop for unknown user agent', () => {
    setUserAgent('UnknownAgent/1.0')
    expect(detectPlatform()).toBe('desktop')
  })
})

describe('view actions with payloads', () => {
  const dispatch = useDispatch()

  it('viewDetails sets recipe id and view', () => {
    dispatch({ type: 'app/viewDetails', payload: { id: 'recipe123' } })
    expect(store.getState().app.recipe.id).toBe('recipe123')
    expect(store.getState().app.view.selected).toBe('details')
  })

  it('viewMatches sets ingredient name and view', () => {
    dispatch({ type: 'app/viewMatches', payload: { name: 'tomato' } })
    expect(store.getState().app.ingredient.name).toBe('tomato')
    expect(store.getState().app.view.selected).toBe('matches')
  })

  it('viewResults sets results and view', () => {
    const payload = { name: 'test', base64: 'data', detections: [], timing: {} }
    dispatch({ type: 'app/viewResults', payload })
    expect(store.getState().app.results.name).toBe('test')
    expect(store.getState().app.view.selected).toBe('results')
  })

  it('viewFavorites sets view to favorites', () => {
    dispatch({ type: 'app/viewFavorites' })
    expect(store.getState().app.view.selected).toBe('favorites')
  })

  it('viewSettings sets view to settings', () => {
    dispatch({ type: 'app/viewSettings' })
    expect(store.getState().app.view.selected).toBe('settings')
  })
})

describe('search actions', () => {
  const dispatch = useDispatch()

  it('searchByName sets results name and view', () => {
    dispatch({ type: 'app/searchByName', payload: { name: 'pizza' } })
    expect(store.getState().app.results.name).toBe('pizza')
    expect(store.getState().app.view.selected).toBe('results')
  })

  it('searchByName ignores invalid payload', () => {
    const initialName = store.getState().app.results.name
    dispatch({ type: 'app/searchByName', payload: { name: 123 } })
    expect(store.getState().app.results.name).toBe(initialName)
  })

  it('searchByIngredient sets ingredient name and clears results', () => {
    dispatch({ type: 'app/searchByIngredient', payload: { name: 'cheese' } })
    expect(store.getState().app.ingredient.name).toBe('cheese')
    expect(store.getState().app.results.name).toBe('')
    expect(store.getState().app.view.selected).toBe('results')
  })

  it('searchByIngredient ignores invalid payload', () => {
    const initialIngredient = store.getState().app.ingredient.name
    dispatch({ type: 'app/searchByIngredient', payload: { name: null } })
    expect(store.getState().app.ingredient.name).toBe(initialIngredient)
  })
})

describe('favorites reducers', () => {
  const dispatch = useDispatch()

  it('_addFavorite adds new favorite', () => {
    dispatch({ type: 'app/_addFavorite', payload: 'recipe123' })
    expect(store.getState().app.favorites).toContain('recipe123')
  })

  it('_addFavorite does not add duplicate favorite', () => {
    dispatch({ type: 'app/_addFavorite', payload: 'recipe456' })
    dispatch({ type: 'app/_addFavorite', payload: 'recipe456' })
    const favorites = store.getState().app.favorites.filter((f) => f === 'recipe456')
    expect(favorites).toHaveLength(1)
  })

  it('_deleteFavorite removes favorite', () => {
    dispatch({ type: 'app/_addFavorite', payload: 'recipe789' })
    dispatch({ type: 'app/_deleteFavorite', payload: 'recipe789' })
    expect(store.getState().app.favorites).not.toContain('recipe789')
  })
})

describe('checklist reducers', () => {
  const dispatch = useDispatch()

  it('_toggleInstructionCheck adds instruction index', () => {
    dispatch({ type: 'app/_toggleInstructionCheck', payload: { recipeId: 'recipe1', index: 0 } })
    expect(store.getState().app.checklist.recipe1?.instructions).toContain(0)
  })

  it('_toggleInstructionCheck removes instruction index when already checked', () => {
    dispatch({ type: 'app/_toggleInstructionCheck', payload: { recipeId: 'recipe1', index: 1 } })
    dispatch({ type: 'app/_toggleInstructionCheck', payload: { recipeId: 'recipe1', index: 1 } })
    expect(store.getState().app.checklist.recipe1?.instructions).not.toContain(1)
  })

  it('_toggleIngredientCheck adds ingredient index', () => {
    dispatch({ type: 'app/_toggleIngredientCheck', payload: { recipeId: 'recipe2', index: 0 } })
    expect(store.getState().app.checklist.recipe2?.ingredients).toContain(0)
  })

  it('_toggleIngredientCheck removes ingredient index when already checked', () => {
    dispatch({ type: 'app/_toggleIngredientCheck', payload: { recipeId: 'recipe2', index: 1 } })
    dispatch({ type: 'app/_toggleIngredientCheck', payload: { recipeId: 'recipe2', index: 1 } })
    expect(store.getState().app.checklist.recipe2?.ingredients).not.toContain(1)
  })

  it('clearChecklist resets checklist for recipe', () => {
    dispatch({ type: 'app/_toggleInstructionCheck', payload: { recipeId: 'recipe3', index: 0 } })
    dispatch({ type: 'app/_toggleIngredientCheck', payload: { recipeId: 'recipe3', index: 0 } })
    dispatch({ type: 'app/clearChecklist', payload: 'recipe3' })
    expect(store.getState().app.checklist.recipe3?.instructions).toEqual([])
    expect(store.getState().app.checklist.recipe3?.ingredients).toEqual([])
  })
})

describe('model reducers', () => {
  const dispatch = useDispatch()
  const testModel = { name: 'test', desc: 'test model', file: 'test.onnx', size: '10MB', conf: 0.5, iou: 0.4, shape: '640x640' }

  it('_addModel adds new model', () => {
    dispatch({ type: 'app/_addModel', payload: testModel })
    expect(store.getState().app.models).toContainEqual(testModel)
  })

  it('_addModel does not add duplicate model', () => {
    const duplicateModel = { ...testModel, file: 'duplicate.onnx' }
    dispatch({ type: 'app/_addModel', payload: duplicateModel })
    dispatch({ type: 'app/_addModel', payload: duplicateModel })
    const models = store.getState().app.models.filter((m) => m.file === 'duplicate.onnx')
    expect(models).toHaveLength(1)
  })

  it('_selectModel sets selected model', () => {
    dispatch({ type: 'app/_selectModel', payload: 'selected.onnx' })
    expect(store.getState().app.model.selected).toBe('selected.onnx')
  })

  it('_updateModel updates existing model', () => {
    const newModel = { ...testModel, file: 'update.onnx', conf: 0.7 }
    dispatch({ type: 'app/_addModel', payload: newModel })
    dispatch({ type: 'app/_selectModel', payload: 'update.onnx' })
    dispatch({ type: 'app/_updateModel', payload: { conf: 0.8 } })
    const updatedModel = store.getState().app.models.find((m) => m.file === 'update.onnx')
    expect(updatedModel?.conf).toBe(0.8)
  })

  it('_deleteModel removes selected model', () => {
    const deleteModel = { ...testModel, file: 'delete.onnx' }
    dispatch({ type: 'app/_addModel', payload: deleteModel })
    dispatch({ type: 'app/_selectModel', payload: 'delete.onnx' })
    dispatch({ type: 'app/_deleteModel' })
    expect(store.getState().app.models.find((m) => m.file === 'delete.onnx')).toBeUndefined()
  })
})

describe('setView reducer', () => {
  const dispatch = useDispatch()

  it('setView sets both selected and visible properties', () => {
    dispatch({ type: 'app/setView', payload: { selected: 'camera', visible: false } })
    expect(store.getState().app.view.selected).toBe('camera')
    expect(store.getState().app.view.visible).toBe(false)
  })

  it('setView can make view visible again', () => {
    dispatch({ type: 'app/setView', payload: { selected: 'home', visible: true } })
    expect(store.getState().app.view.selected).toBe('home')
    expect(store.getState().app.view.visible).toBe(true)
  })
})

describe('pluginStore', () => {
  const dispatch = useDispatch()
  it('calls set and save on the fake store', async () => {
    const store = await pluginStore.load('fake')
    await store.set('key', 'value')
    await store.save()

    expect(store.set).toHaveBeenCalledWith('key', 'value')
    expect(store.save).toHaveBeenCalled()
  })
  it('dispatches saveModel', async () => {
    await dispatch(saveModel())
    const storeInstance = await (pluginStore.load as Mock).mock.results[0].value
    expect(storeInstance.set).toHaveBeenCalled()
    expect(storeInstance.save).toHaveBeenCalled()
  })

  it('dispatches getModel', async () => {
    await dispatch(getModel())
    const storeInstance = await (pluginStore.load as Mock).mock.results[0].value
    expect(storeInstance.get).toHaveBeenCalled()
  })

  it('dispatches addModel', async () => {
    dispatch(addModel('fakemodel'))
    expect(store.getState().app.models).toContain('fakemodel')
  })

  it('dispatches deleteModel', async () => {
    dispatch(deleteModel())
    expect(store.getState().app.models).toBeDefined()
  })
})

describe('viewRecents', () => {
  const dispatch = useDispatch()

  const testRecent = { idMeal: 'test123', strMeal: 'Test Meal', strMealThumb: 'test.jpg', viewedAt: new Date().toISOString() }

  it('_addRecent adds new model', () => {
    dispatch({ type: 'app/_addRecent', payload: testRecent })
    expect(store.getState().app.recentsList).toContainEqual(testRecent)
  })

  it('_addRecent does not add duplicate model', () => {
    dispatch({ type: 'app/_addRecent', payload: testRecent })
    dispatch({ type: 'app/_addRecent', payload: testRecent })
    const recents = store.getState().app.recentsList.filter((r) => r.idMeal === 'test123')
    expect(recents).toHaveLength(1)
  })

  it('_deleteRecent removes selected model', () => {
    dispatch({ type: 'app/_addRecent', payload: testRecent })
    dispatch({ type: 'app/_deleteRecent', payload: 'test123' })
    const recents = store.getState().app.recentsList.filter((r) => r.idMeal === 'test123')
    expect(recents).toHaveLength(0)
  })

  it('viewRecents sets view.selected to recents', () => {
    dispatch({ type: 'app/viewRecents' })
    expect(store.getState().app.view.selected).toBe('recents')
  })
})

describe('recentExpireDays reducer', () => {
  const dispatch = useDispatch()

  it('setRecentExpireDays sets recentExpireDays', () => {
    dispatch(updateExpire(10))
    expect(store.getState().app.recentExpireDays).toBe(10)
  })

  // it('setRecentExpireDays does not accept negative values', () => {
  //   dispatch({ type: 'app/setRecentExpireDays', payload: -5 })
  //   expect(store.getState().app.recentExpireDays).toBe(10)
  // })

  // it('setRecentExpireDays does not accept non-integer values', () => {
  //   dispatch({ type: 'app/setRecentExpireDays', payload: 10.5 })
  //   expect(store.getState().app.recentExpireDays).toBe(10)
  // })

  // it('setRecentExpireDays accepts stringified integer', () => {
  //   dispatch({ type: 'app/setRecentExpireDays', payload: '7' })
  //   expect(store.getState().app.recentExpireDays).toBe(7)
  // })

  // it('setRecentExpireDays ignores invalid payload', () => {
  //   const initialRecentExpireDays = store.getState().app.recentExpireDays
  //   dispatch({ type: 'app/setRecentExpireDays', payload: null })
  //   expect(store.getState().app.recentExpireDays).toBe(initialRecentExpireDays)
  // })
})
