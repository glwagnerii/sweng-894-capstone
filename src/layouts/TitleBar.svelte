<script lang='ts'>
  import { Button } from '../components'
  import { openUrl } from '@tauri-apps/plugin-opener'

  const title = 'top'
  const openGoogle = async () => { await openUrl('https://www.google.com') }
</script>

<div id='titlebar' class='border-b flex justify-between items-center absolute top-0 left-0 h-8 w-screen select-none text-sm whitespace-normal overflow-hidden drag'>
  <div class='titlebar-left flex justify-start items-center h-full min-w-min nodrag order-0'>
    <!-- {/* { window.electron && isMac && !isFullScreen && <div className="flex-none h-full w-16"></div> } */} -->
    <div class ='title-bar-logo flex justify-start items-center h-full px-2' >
      <Button name='psu' onClick={() => openGoogle()}/>
      <div class='app-name px-2'>Classi-Cam</div>
    </div>
  </div>
  <div class='titlebar-center flex items-center justify-center my-0 mx-2 h-full max-w-max min-w-0 order-1'>
  <div class='window-title block basis-auto flex-shrink flex-grow-0 mx-0 truncate selected'>{title}</div>
  </div>
  <div class='titlebar-right flex justify-end items-center h-full min-w-min nodrag order-2 px-2'>
    <Button name='panelLeftShow'/>
    <Button name='panelLeftHide'/>
    <Button name='panelBottomShow'/>
    <Button name='panelBottomHide'/>
    <Button name='panelRightShow'/>
    <Button name='panelRightHide'/>
  </div>
</div>

<style lang="postcss">
  @reference "tailwindcss";
  #titlebar :global(.btn) { @apply h-full px-1; }
  #titlebar :global(.icon-psu) { @apply w-8 text-blue-800 bg-white; }
</style>
