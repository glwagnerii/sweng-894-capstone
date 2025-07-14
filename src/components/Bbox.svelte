<script lang="ts">
  import { onMount } from 'svelte'
  import { type Detection } from '../store/appSlice'

  type BboxProps = { det: Detection, imgEl: HTMLImageElement | null }
  let { det, imgEl }: BboxProps = $props()

  let textEl: SVGTextElement

  const scalex = imgEl?.width  && imgEl?.naturalWidth  ? imgEl.width  / imgEl.naturalWidth  : 0
  const scaley = imgEl?.height && imgEl?.naturalHeight ? imgEl.height / imgEl.naturalHeight : 0

  const [x, y, w, h] = det.bbox.map((v, i) => v * (i % 2 === 0 ? scalex : scaley))
  const score = `(${(det.score * 100).toFixed(0)}%)`
  let labelWidth = $state(0)

  onMount(() => labelWidth = textEl.getComputedTextLength() + 14)
</script>

<g>
  <rect x={x} y={y} width={w} height={h} class="fill-none stroke-red-500 stroke-2"/>
  <rect x={x} y={y} width={labelWidth} height="16" class="fill-red-500 opacity-60 rounded" rx="4" ry="4"/>
  <text bind:this={textEl} x={x + 8} y={y + 12} class="fill-white text-[15px] font-medium drop-shadow">
    {det.class} {score}
  </text>
</g>
