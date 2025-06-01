<script lang="ts">
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import Counter from './lib/Counter.svelte'
  import PluginOpener from './lib/PluginOpener.svelte'
  import PluginOs from './lib/PluginOS.svelte' 
  import PluginHTTP from './lib/PluginHTTP.svelte'
  import PluginNotification from './lib/PluginNotification.svelte'
  import PluginStore from './lib/PluginStore.svelte'

  const count = writable(0);
  setContext('count', count);
</script>

<main>
  <PluginOs />
  <PluginOpener />
  <PluginHTTP />
  <PluginNotification />
  <PluginStore />
  <p></p>
  <Counter />
</main>

