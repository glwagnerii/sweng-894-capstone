<script lang='ts'>
  import { Button } from '../components'
  import { open, message } from '@tauri-apps/plugin-dialog'

  const openFolder = async () => {
    const file = await open({ multiple: false, directory: false })
    await message(`You selected: ${file}`, { title: 'Classifi-Cam', kind:'info' })
  }

  const btnClass = 'btn-secondary btn-ghost border-none shadow-none transition-colors h-full px-4'
</script>

<div id='statusbar' class='border-t flex items-center h-18 w-full select-none'>
  <div class="flex flex-1 flex-row justify-evenly items-center h-full space-x-1">
    <Button name='viewCamera'  btnClass={btnClass}>Camera</Button>
    <Button name='viewLibrary' btnClass={btnClass}>Library</Button>
    <Button name='viewResult'  btnClass={btnClass}>Results</Button>
    <Button name='viewRecipe'  btnClass={btnClass}>Recipe</Button>
    <Button name='viewHttp'    btnClass={btnClass}>HTTP</Button>
    <Button name='openFolder'  btnClass={btnClass} onClick={() => openFolder()}>Models</Button>
  </div>
</div>

<style lang="postcss">
  @reference "tailwindcss";
  #statusbar :global(.icon) { @apply h-10; }
</style>
