import type { Component } from 'svelte'

import CameraView from './CameraView.svelte'
import HomeView from './HomeView.svelte'
import HttpView from './HttpView.svelte'
import LibraryView from './LibraryView.svelte'
import PathView from './PathView.svelte'
import RecipeView from './RecipeView.svelte'
import ResultView from './ResultView.svelte'
import FavoritesView from './FavoritesView.svelte'

export { CameraView, HomeView, HttpView, LibraryView, PathView, RecipeView, ResultView, FavoritesView }
export type ViewType = { component: Component }

function tView<V extends ViewType, T extends { [key in string]: V }>(o: T): T { return o } // ensure type of value object
export const views = tView({
  camera:    { component: CameraView },
  home:      { component: HomeView },
  http:      { component: HttpView },
  library:   { component: LibraryView },
  path:      { component: PathView },
  recipe:    { component: RecipeView },
  result:    { component: ResultView },
  favorites: { component: FavoritesView },
})
export type ViewName = keyof typeof views
