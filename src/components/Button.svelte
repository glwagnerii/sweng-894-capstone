<script lang='ts' module>
  import type { HTMLButtonAttributes } from 'svelte/elements'

  type OnClick = (button: ButtonName) => void
  type Props = { name: ButtonName, disabled?: boolean, onClick?: OnClick, btnClass?: string, iconClass?: string }
  export type ButtonProps = HTMLButtonAttributes & Props
</script>

<script lang="ts">
  import { useSelector, useDispatch } from '../store'
  import { buttons, type ButtonName, type ButtonType } from '../constants'
  import { Icon } from '.'
  import clsx from 'clsx'

  let { name, disabled, onClick, btnClass, iconClass, children, ...restProps }: ButtonProps = $props()
  const dispatch = useDispatch()

  const onClickDefault = (button: ButtonName) => { dispatch({ type: `app/${button}` }) }
  if (!onClick) onClick = onClickDefault

  const button: ButtonType = buttons[name]
  const visible  = useSelector(button.visible || (() => true))
  const isactive = useSelector(button.active  || (() => false))

  const classes = $derived(clsx('btn', 'btn-${name}', $isactive ? 'btn-active' : '', btnClass))

</script>

{#if $visible}
  <button title={button.title} {disabled} class={classes} onclick={() => { if (onClick) { onClick(name) } }} {...restProps}>
    {#if children}
      {@render children()}
    {:else}
      <Icon name={button.icon} iconClass={iconClass} />
    {/if}
  </button>
{/if}
