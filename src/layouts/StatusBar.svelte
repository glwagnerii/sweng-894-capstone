<script lang='ts'>
  import { Button } from '../components'

  const btnClass = 'btn-secondary btn-ghost border-none shadow-none transition-colors h-full px-4'
</script>

<div id='statusbar' class='border-t flex items-center h-18 w-full select-none'>
  <div class="flex flex-1 flex-row justify-evenly items-center h-full space-x-1">
    <Button name='viewCamera'    btnClass={btnClass}>Camera</Button>
    <Button name='viewLibrary'   btnClass={btnClass}>Library</Button>
    <Button name='viewResults'   btnClass={btnClass}>Results</Button>
    <Button name='viewMatches'   btnClass={btnClass}>Recipes</Button>
    <Button name='viewDetails'   btnClass={btnClass}>Details</Button>
    <Button name='viewFavorites' btnClass={btnClass}>Favorites</Button>
  </div>
</div>

<style lang="postcss">
  @reference "tailwindcss";
  #statusbar :global(.icon) { @apply h-10; }
</style>
