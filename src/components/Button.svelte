<script lang='ts' module>
  import type { HTMLButtonAttributes } from 'svelte/elements'

  type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null }
  type OnClick = (button: ButtonName) => void

  type Props = { name: ButtonName, disabled?: boolean, onClick?: OnClick, className?: string, iconClass?: string }
  export type ButtonProps = WithElementRef<HTMLButtonAttributes> & Props
</script>

<script lang="ts">
  import { useSelector, useDispatch } from '../store'
  import { buttons, type ButtonName, type ButtonType } from '../constants'
  import { Icon } from '.'

  let { name, disabled, onClick, className, iconClass, ref = $bindable(null), children, ...restProps }: ButtonProps = $props()
  const dispatch = useDispatch()

  const onClickDefault = (button: ButtonName) => { dispatch({ type: `app/${button}` }) }
  if (!onClick) onClick = onClickDefault

  const button: ButtonType = buttons[name]

  // visible, isactive are derived stores so use $visible, $isactive to get values
  const visible  = useSelector(button.visible || (() => true))
  const isactive = useSelector(button.active || (() => false))

  // active is a derived value from $isactive store so does not need $active syntax
  const active = $derived($isactive ? 'btn-active' : '')
</script>

{#if $visible}
  <button bind:this={ref} title={button.title} {disabled}
    class="btn btn-{name} min-h-4 flex justify-center items-center {active} {className}"
    onclick={() => { if (onClick) { onClick(name) } }}
    {...restProps}
  >
    {#if children}
      {@render children()}
    {:else}
      <Icon name={button.icon} className={iconClass} />
    {/if}
  </button>
{/if}
