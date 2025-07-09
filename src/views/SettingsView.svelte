<script lang="ts">
  import { icons, type IconName } from '../constants/icons'
  import Icon from '../components/Icon.svelte'
</script>

<div class="mx-2">
  <h2 class="text-xl font-semibold mb-4">All Icons</h2>
  <div class="flex flex-wrap gap-6">
    {#each Object.keys(icons) as iconName (iconName)}
      <div class="flex flex-col items-center w-12">
        <Icon name={iconName as IconName} iconClass="icon-lg" />
        <span class="text-xs mt-2">{iconName}</span>
      </div>
    {/each}
  </div>
</div>
