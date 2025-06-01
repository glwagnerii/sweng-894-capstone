<script lang="ts">
  import { icons, type IconName, type IconType } from '../constants'

  interface IconProps { name: IconName, className?: string }
  let { name, className = 'h-5 w-5' }: IconProps = $props()

  const icon: IconType = icons[name]
  const viewbox = icon.viewbox ?? '0 0 16 16'
  const strokeWidth = icon.strokeWidth ?? ''
  // assume if strokeWidth is === '' then it is solid icon, else an outline icon
  const myprops = strokeWidth === '' ? { fill: 'currentColor' } : { fill: 'none', stroke: 'currentColor', strokeWidth: strokeWidth, strokeDasharray: icon.strokeDasharray }
</script>

<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-{name} {className}" viewBox={viewbox} {...myprops}>
  <path d={icons[name].path} />
</svg>
