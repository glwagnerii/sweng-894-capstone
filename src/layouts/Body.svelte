<script lang='ts'>
    import { useSelector } from '../store'

  // width, height, level are derived stores so use $width, $height, $level to get values
    const width = useSelector((state) => state.app.zoom.width)
    const height = useSelector((state) => state.app.zoom.height)
    const level = useSelector((state) => state.app.zoom.level)

    // zoom level is a derived value from $level store so does not need $zoomLevel syntax
    const zoomLevel = $derived($level / 100)

</script>

<div id='plot-area' class='border 1 absolute'
    style:top='max(50%,{$height / 2 * zoomLevel + 24}px)'
    style:left='max(50%,{$width / 2 * zoomLevel + 24}px)'
    style:height='{$height}px'
    style:width='{$width}px'
    style:transform='scale({zoomLevel}) translate({-50 / zoomLevel}%,{-50 / zoomLevel}%)'
>
    <div id='plot' class='h-full w-full'>

    </div>
</div>
