<script lang='ts'>
  import { Button } from '../components'
  import { open, message } from '@tauri-apps/plugin-dialog'

  const openFolder = async () => {
    const file = await open({ multiple: false, directory: false })
    await message(`You selected: ${file}`, { title: 'Classifi-Cam', kind:'info' })
  }
</script>

<div id='statusbar' class='border-t flex items-center h-18 w-full px-4 select-none text-base'>
  <div class="flex flex-1 flex-row justify-evenly items-center h-full space-x-2">
    <Button name='viewCamera'  iconClass='h-10' label="Camera"/>
    <Button name='viewLibrary' iconClass='h-10' label="Library"/>
    <Button name='viewResult'  iconClass='h-10' label="Results"/>
    <Button name='viewRecipe'  iconClass='h-10' label="Recipe"/>
    <Button name='viewHttp'    iconClass='h-10' label="HTTP"/>
    <Button name='openFolder'  iconClass='h-10' label="Models" onClick={() => openFolder()}/>
  </div>
</div>

<style lang="postcss">
  @reference "tailwindcss";
  #statusbar :global(.btn) { @apply h-full px-2; }
</style>
