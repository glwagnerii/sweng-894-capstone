<script lang='ts' module>
  export type IconProps = { name: IconName, iconClass?: string }
</script>

<script lang="ts">
  import { icons, type IconName, type IconType } from '../constants'
  import clsx from 'clsx'

  let { name, iconClass }: IconProps = $props()

  const icon: IconType = icons[name]
  const viewbox = icon.viewbox ?? '0 0 16 16'
  const strokeWidth = icon.strokeWidth ?? ''

  // assume if strokeWidth is === '' then it is solid icon, else an outline icon
  const myprops = strokeWidth === ''
    ? { fill: 'currentColor' }
    : {
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: strokeWidth,
        strokeDasharray: icon.strokeDasharray,
      }
  const classes = clsx('icon', `icon-${name}`, iconClass)
</script>

<svg xmlns="http://www.w3.org/2000/svg" class={classes} viewBox={viewbox} {...myprops}>
  <path d={icons[name].path} />
</svg>
