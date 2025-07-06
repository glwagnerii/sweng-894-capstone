<script lang="ts">
  import { useDispatch } from '../store'
  import { type Detection } from '../store/appSlice'
  import { invoke } from '@tauri-apps/api/core'

  const dispatch = useDispatch()

  type File = { name: string, ingredients: Detection[] }
  const files: File[] = [
    {
      name: 'bailey.jpeg',
      ingredients: [],
    },
    {
      name: 'ingredients4.jpg',
      ingredients: [
        { class: 'eggs', score: 0, bbox: [1250, 590, 460, 240] },
        { class: 'ham', score: 0, bbox: [380, 50, 500, 500] },
        { class: 'scallions', score: 0, bbox: [200, 610, 350, 350] },
        { class: 'carrots', score: 0, bbox: [670, 990, 326, 326] },
        { class: 'peas', score: 0, bbox: [800, 610, 232, 232] },
        { class: 'rice', score: 0, bbox: [1040, 240, 330, 330] },
        { class: 'soy sauce', score: 0, bbox: [1510, 230, 232, 232] },
        { class: 'salt', score: 0, bbox: [1440, 860, 232, 232] },
        { class: 'sesame seeds', score: 0, bbox: [1190, 1040, 214, 214] },
      ],
    },
    {
      name: 'ingredients6.jpg',
      ingredients: [
        { class: 'onions', score: 0, bbox: [450, 40, 120, 140] },
        { class: 'white beans', score: 0, bbox: [226, 70, 190, 170] },
        { class: 'chicken breast', score: 0, bbox: [415, 250, 190, 170] },
        { class: 'lentils', score: 0, bbox: [305, 420, 120, 120] },
        { class: 'cheese', score: 0, bbox: [50, 500, 120, 120] },
        { class: 'avocado', score: 0, bbox: [30, 360, 100, 100] },
        { class: 'corn', score: 0, bbox: [20, 110, 150, 130] },
        { class: 'jalapenos', score: 0, bbox: [269, 273, 104, 96] },
        { class: 'cilantro', score: 0, bbox: [180, 420, 114, 178] },
        { class: 'flour', score: 0, bbox: [580, 185, 84, 88] },
        { class: 'chicken broth', score: 0, bbox: [490, 488, 110, 110] },
        { class: 'sour cream', score: 0, bbox: [390, 562, 70, 80] },
        { class: 'garlic', score: 0, bbox: [0, 250, 70, 80] },
        { class: 'cumin', score: 0, bbox: [100, 290, 50, 50] },
        { class: 'paprika', score: 0, bbox: [190, 319, 50, 50] },
        { class: 'oregano', score: 0, bbox: [170, 230, 50, 50] },
      ],
    },
    {
      name: 'ingredients7.jpg',
      ingredients: [
        { class: 'beef', score: 0, bbox: [580, 345, 440, 410] },
        { class: 'onions', score: 0, bbox: [260, 10, 350, 280] },
        { class: 'mushrooms', score: 0, bbox: [10, 370, 350, 280] },
        { class: 'butter', score: 0, bbox: [310, 690, 210, 170] },
        { class: 'garlic', score: 0, bbox: [950, 920, 140, 130] },
        { class: 'carrots', score: 0, bbox: [1190, 330, 270, 190] },
        { class: 'beef broth', score: 0, bbox: [980, 0, 340, 240] },
        { class: 'parsley', score: 0, bbox: [1360, 90, 140, 150] },
        { class: 'soy sauce', score: 0, bbox: [1205, 880, 240, 210] },
        { class: 'salt', score: 0, bbox: [220, 910, 120, 130] },
        { class: 'pepper', score: 0, bbox: [720, 940, 120, 130] },
        { class: 'thyme', score: 0, bbox: [1050, 740, 120, 130] },
        { class: 'sauce', score: 0, bbox: [760, 40, 120, 130] },
        { class: 'olive oil', score: 0, bbox: [0, 80, 160, 160] },
        { class: 'flour', score: 0, bbox: [-10, 780, 160, 160] },
        { class: 'paprika', score: 0, bbox: [530, 860, 110, 110] },
        { class: 'bay leaves', score: 0, bbox: [1275, 590, 220, 230] },
      ],
    },
    {
      name: 'ingredients8.jpg',
      ingredients: [
        { class: 'butter', score: 0, bbox: [20, 230, 170, 190] },
        { class: 'bell pepper', score: 0, bbox: [320, 210, 260, 230] },
        { class: 'mushrooms', score: 0, bbox: [760, 200, 390, 320] },
        { class: 'onions', score: 0, bbox: [1280, 50, 210, 290] },
        { class: 'shredded beef', score: 0, bbox: [410, 650, 400, 290] },
        { class: 'peppers', score: 0, bbox: [40, 810, 240, 210] },
        { class: 'cheese', score: 0, bbox: [1220, 840, 240, 210] },
        { class: 'bread', score: 0, bbox: [960, 610, 260, 410] },
      ],
    },
    {
      name: 'ingredients9.jpg',
      ingredients: [
        { class: 'salmon', score: 0, bbox: [150, 190, 200, 170] },
        { class: 'lemons', score: 0, bbox: [110, 480, 100, 70] },
        { class: 'potatoes', score: 0, bbox: [10, 280, 120, 100] },
        { class: 'mustard', score: 0, bbox: [260, 420, 70, 60] },
        { class: 'cherry tomatoes', score: 0, bbox: [10, 90, 130, 150] },
        { class: 'parsley', score: 0, bbox: [140, 410, 90, 80] },
        { class: 'feta cheese', score: 0, bbox: [230, 40, 90, 80] },
        { class: 'butter', score: 0, bbox: [110, 20, 90, 80] },
        { class: 'salt', score: 0, bbox: [20, 400, 70, 70] },
      ],
    },
  ]

  async function handleImageClick(file: { name: string, ingredients: Detection[] }) {
    const response = await fetch(`/photos/${file.name}`)
    const blob = await response.blob()
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
    const base64stipped = base64.replace(/^data:image\/\w+;base64,/, '')
    const detections = (file.ingredients.length > 0) ? file.ingredients : await invoke('infer_base64', { base64: base64stipped }) as Detection[]
    dispatch({ type: 'app/viewResults', payload: { name: file.name, base64, detections } })
  }
</script>

<ul class="flex flex-wrap gap-4 justify-center px-6 py-4 list-none">
  {#each files as file (file.name)}
    <li class="flex flex-col items-center max-w-[200px]">
      <button
        type="button"
        class="p-0 border-none bg-transparent cursor-pointer focus:outline-none"
        on:click={() => handleImageClick(file)}
        aria-label={`Select image ${file.name}`}
      >
        <img
          src={`/photos/${file.name}`}
          alt={file.name}
          class="object-cover h-48 w-auto rounded shadow"
        />
      </button>
      <div class="mt-2 break-all text-center text-sm">{file.name}</div>
    </li>
  {/each}
</ul>
