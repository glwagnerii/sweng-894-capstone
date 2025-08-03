import type { Component } from 'svelte'

import CameraView from './CameraView.svelte'
import DetailsView from './DetailsView.svelte'
import FavoritesView from './FavoritesView.svelte'
import HomeView from './HomeView.svelte'
import LibraryView from './LibraryView.svelte'
import MatchesView from './MatchesView.svelte'
import PathView from './PathView.svelte'
import ResultView from './ResultsView.svelte'
import RecentsView from './RecentsView.svelte'
import SettingsView from './SettingsView.svelte'

export { CameraView, DetailsView, FavoritesView, HomeView, LibraryView, MatchesView, PathView, ResultView, RecentsView, SettingsView }
export type ViewType = { component: Component }

function tView<V extends ViewType, T extends { [key in string]: V }>(o: T): T { return o } // ensure type of value object
export const views = tView({
  camera:    { component: CameraView },
  details:   { component: DetailsView },
  favorites: { component: FavoritesView },
  home:      { component: HomeView },
  library:   { component: LibraryView },
  matches:   { component: MatchesView },
  path:      { component: PathView },
  results:   { component: ResultView },
  recents:   { component: RecentsView},
  settings:  { component: SettingsView },
})
export type ViewName = keyof typeof views
