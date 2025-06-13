<script lang='ts' module>
  import type { HTMLButtonAttributes } from 'svelte/elements'
  type OnClick = (button: ButtonName) => void
  type Props = { name: ButtonName, disabled?: boolean, onClick?: OnClick, btnClass?: string, iconClass?: string, labelRight?: boolean }
  export type ButtonProps = HTMLButtonAttributes & Props
</script>

<script lang="ts">
  import { useSelector, useDispatch } from '../store'
  import { buttons, type ButtonName, type ButtonType } from '../constants'
  import { Icon } from '.'
  import clsx from 'clsx'

  let { name, disabled, onClick, btnClass, iconClass, labelRight = false, children, ...restProps }: ButtonProps = $props()
  const dispatch = useDispatch()

  const onClickDefault = (button: ButtonName) => { dispatch({ type: `app/${button}` }) }
  if (!onClick) onClick = onClickDefault

  const button: ButtonType = buttons[name]
  const visible  = useSelector(button.visible || (() => true))
  const isactive = useSelector(button.active  || (() => false))

  const classes = $derived(clsx('btn', `btn-${name}`, $isactive ? 'btn-active' : '', labelRight ? 'flex flex-row items-center' : 'flex flex-col items-center', 'justify-center', btnClass))
</script>

{#if $visible}
  <button title={button.title} {disabled} class={classes} onclick={() => onClick(name)} {...restProps}>
    {#if button.icon !== ''}
      <Icon name={button.icon} iconClass={iconClass} />
    {/if}
    {#if children}
      <span class={labelRight ? 'text-base' : 'text-xs'}>{@render children()}</span>
    {/if}
  </button>
{/if}
