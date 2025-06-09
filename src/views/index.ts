import type { Component } from 'svelte'

import CameraView from './CameraView.svelte'
import HomeView from './HomeView.svelte'
import HttpView from './HttpView.svelte'
import LibraryView from './LibraryView.svelte'
import PathView from './PathView.svelte'
import RecipeView from './RecipeView.svelte'
import ResultView from './ResultView.svelte'

export { HomeView, LibraryView, PathView, RecipeView, ResultView }
export type ViewType = { component: Component }

function tView<V extends ViewType, T extends { [key in string]: V }>(o: T): T { return o } // ensure type of value object
export const views = tView({
  camera:  { component: CameraView },
  home:    { component: HomeView },
  http:    { component: HttpView },
  path:    { component: PathView },
  library: { component: LibraryView },
  recipe:  { component: RecipeView },
  result:  { component: ResultView },
})
export type ViewName = keyof typeof views
