<script lang='ts'>
  import { Button } from '../components'
  import { open, message } from '@tauri-apps/plugin-dialog'

  const openFolder = async () => {
    const file = await open({ multiple: false, directory: false })
    await message(`You selected: ${file}`, { title: 'Classifi-Cam', kind:'info' })
  }
</script>

<div id='statusbar' class='border-t flex items-center h-18 w-full select-none'>
  <div class="flex flex-1 flex-row justify-evenly items-center h-full space-x-1">
    <Button name='viewCamera'>Camera</Button>
    <Button name='viewLibrary'>Library</Button>
    <Button name='viewResult'>Results</Button>
    <Button name='viewRecipe'>Recipe</Button>
    <Button name='viewHttp'>HTTP</Button>
    <Button name='openFolder' onClick={() => openFolder()}>Models</Button>
  </div>
</div>

<style lang="postcss">
  @reference "tailwindcss";
  #statusbar :global(.btn)  { @apply h-full px-1; }
  #statusbar :global(.icon) { @apply h-10; }
</style>
