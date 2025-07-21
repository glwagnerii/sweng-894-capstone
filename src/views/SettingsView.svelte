<script lang="ts">
  import { open, message } from '@tauri-apps/plugin-dialog'
  import { EditableField, ThresholdSlider } from '../components'

  import { useSelector, useDispatch } from '../store'
  import { addModel, deleteModel, updateModel, selectModel, type Models } from '../store/appSlice'

  const dispatch = useDispatch()

  const models = useSelector((state) => state.app.models)
  const selected = useSelector((state) => state.app.model.selected)

  const selectedModel = $derived($models.find((m) => m.file === $selected) || null)

  // local editable variables
  let selectedModelFile = $derived($selected)
  let conf = $derived(selectedModel ? selectedModel.conf : 0)
  let iou  = $derived(selectedModel ? selectedModel.iou  : 0)
  let name = $derived(selectedModel ? selectedModel.name : '')
  let desc = $derived(selectedModel ? selectedModel.desc : '')

  const handleSelectModel = () => { if (selectedModelFile !== $selected) { dispatch(selectModel(selectedModelFile)) } }

  async function handleAddModel() {
    try {
      const file = await open({ multiple: false, directory: false })
      if (!file) return
      const filePath = file as string
      const fileName = filePath.split(/[\\/]/).pop() || ''
      if (!fileName) {
        await message('Invalid file.')
        return
      }
      if ($models.some((m) => m.file === fileName)) {
        await message('A model with this file already exists.')
        return
      }
      const model: Models = {
        name: fileName.replace(/\.[^.]+$/, ''),
        file: fileName,
        desc: 'Model Description',
        shape: 'Unknown',
        size: 'Unknown',
        conf: 70,
        iou: 50,
      }
      dispatch(addModel(model))
      selectedModelFile = model.file
      handleSelectModel()
    }
    catch (e) {
      await message(`Failed to add model. ${e instanceof Error ? e.message : String(e)}`)
    }
  }

</script>

<div class="w-full max-w-lg mx-auto px-4">
  <h2 class="text-2xl font-bold my-6">Detection Settings</h2>

  <!-- Model Selection -->
  <div class="mb-4">
    <div class="flex items-center justify-between mb-4">
      <label class="block font-semibold" for="model-select">ONNX Model</label>
      <div class="flex gap-2">
        <button class="btn btn-xs btn-primary" onclick={handleAddModel} aria-label="Add model">Add</button>
        <button class="btn btn-xs btn-error"   onclick={() => dispatch(deleteModel())} aria-label="Delete model" disabled={$models.length <= 1}>Delete</button>
      </div>
    </div>

    <select id="model-select" class="select select-bordered w-full" bind:value={selectedModelFile} onchange={handleSelectModel}>
      <option value={null}>-- No model selected --</option>
      {#each $models as model (model.file)}
        <option value={model.file}>{model.name} ({model.file})</option>
      {/each}
    </select>

    {#if selectedModel}
      <div class="mt-4 card bg-base-200 shadow-sm">
        <div class="card-body">
          <EditableField id="name" label="Name"        bind:value={name} onSave={() => dispatch(updateModel({ name:name }))} />
          <EditableField id="desc" label="Description" bind:value={desc} onSave={() => dispatch(updateModel({ desc:desc }))} />
          <div>
            <div class="text-sm text-base-content/60">File:  {selectedModel.file}</div>
            <div class="text-sm text-base-content/60">Shape: {selectedModel.shape}</div>
            <div class="text-sm text-base-content/60">Size:  {selectedModel.size}</div>
          </div>
          <ThresholdSlider id="conf" label="Confidence Threshold" bind:value={conf} onchange={() => dispatch(updateModel({ conf:conf }))}/>
          <ThresholdSlider id="iou"  label="IOU Threshold"        bind:value={iou}  onchange={() => dispatch(updateModel({ iou:iou }))}/>
        </div>
      </div>
    {/if}
  </div>
</div>
