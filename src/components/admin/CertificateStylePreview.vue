<template>
  <div class="grid gap-4 lg:grid-cols-[1fr_15rem]">
    <div ref="wrap" class="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
      <canvas ref="canvas" class="block w-full cursor-crosshair" role="img"
              :aria-label="`Certificate preview. Name baseline ${placedLabel}. Click to move it.`"
              @click="place"></canvas>
      <p v-if="modelValue.x == null" class="absolute inset-x-0 top-3 text-center pointer-events-none">
        <span class="bg-white/95 text-sm font-semibold text-gray-800 px-3 py-1.5 rounded-full shadow-sm">
          Click where the name should sit (its baseline)
        </span>
      </p>
    </div>

    <div class="flex flex-col gap-4">
      <label class="flex flex-col gap-1.5">
        <span :class="ui.label">Size (pt)</span>
        <input type="number" min="4" max="400" step="1" :value="modelValue.size" :class="ui.input"
               @change="update({ size: clamp(Number($event.target.value), 4, 400) })" />
      </label>
      <label class="flex flex-col gap-1.5">
        <span :class="ui.label">Colour</span>
        <input type="color" :value="modelValue.color"
               class="h-10 w-full rounded-lg border border-gray-200 bg-white cursor-pointer"
               @input="update({ color: $event.target.value })" />
      </label>
      <label class="flex flex-col gap-1.5">
        <span :class="ui.label">Max width · {{ Math.round(modelValue.maxWidth * 100) }}%</span>
        <input type="range" min="10" max="100" step="1" :value="Math.round(modelValue.maxWidth * 100)"
               class="accent-blue-600" @input="update({ maxWidth: Number($event.target.value) / 100 })" />
      </label>
      <label class="flex flex-col gap-1.5">
        <span :class="ui.label">Preview name</span>
        <input v-model="previewName" type="text" :class="ui.input" />
      </label>
      <p class="text-xs text-gray-500 leading-relaxed">
        Names longer than the dashed line shrink to fit. The preview is close; the sample PDF is exact.
      </p>
      <p v-if="fontError" class="text-xs text-red-600">{{ fontError }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { layoutName } from '../../../lib/certificates/layout.js'
import { ui } from '../../utils/adminApi.js'

const props = defineProps({
  modelValue: { type: Object, required: true },
  previewUrl: { type: String, required: true },
  fontUrl: { type: String, default: '' },
  fontKey: { type: String, default: '' },
  pageWidth: { type: Number, required: true },
  pageHeight: { type: Number, required: true },
  sampleName: { type: String, default: 'Sample Name' },
})
const emit = defineEmits(['update:modelValue'])

const wrap = ref(null)
const canvas = ref(null)
const previewName = ref(props.sampleName)
const fontError = ref('')
let image = null
let family = ''
let observer = null

watch(() => props.sampleName, (value) => { if (value) previewName.value = value })

const clamp = (n, min, max) => Math.min(max, Math.max(min, Number.isFinite(n) ? n : min))
const placedLabel = computed(() =>
  props.modelValue.x == null
    ? 'not set'
    : `at ${Math.round(props.modelValue.x * 100)}% across, ${Math.round(props.modelValue.y * 100)}% down`
)

function update(patch) {
  emit('update:modelValue', { ...props.modelValue, ...patch })
}

async function loadImage(url) {
  const img = new Image()
  img.src = url
  await img.decode()
  image = img
}

async function loadFont() {
  fontError.value = ''
  family = ''
  if (!props.fontUrl) return
  const name = `cert-${props.fontKey}`
  try {
    const face = new FontFace(name, `url(${props.fontUrl})`)
    await face.load()
    document.fonts.add(face)
    family = name
  } catch {
    fontError.value = 'The browser could not load this font for the preview. The sample PDF still uses it.'
  }
}

function draw() {
  const el = canvas.value
  if (!el || !image || !wrap.value) return

  const cssWidth = wrap.value.clientWidth
  const cssHeight = cssWidth * (props.pageHeight / props.pageWidth)
  const dpr = window.devicePixelRatio || 1
  el.width = Math.round(cssWidth * dpr)
  el.height = Math.round(cssHeight * dpr)
  el.style.height = `${cssHeight}px`

  const ctx = el.getContext('2d')
  ctx.clearRect(0, 0, el.width, el.height)
  ctx.drawImage(image, 0, 0, el.width, el.height)

  const s = props.modelValue
  if (s.x == null || s.y == null) return

  // Guide: the max-width line on the baseline, with end ticks.
  const centreX = s.x * el.width
  const baseline = s.y * el.height
  const half = (s.maxWidth * el.width) / 2
  const tick = 8 * dpr
  ctx.save()
  ctx.strokeStyle = 'rgba(37, 99, 235, 0.9)'
  ctx.lineWidth = Math.max(1, dpr)
  ctx.setLineDash([6 * dpr, 4 * dpr])
  ctx.beginPath()
  ctx.moveTo(centreX - half, baseline)
  ctx.lineTo(centreX + half, baseline)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.beginPath()
  for (const edge of [-half, half]) {
    ctx.moveTo(centreX + edge, baseline - tick)
    ctx.lineTo(centreX + edge, baseline + tick)
  }
  ctx.stroke()
  ctx.restore()

  const name = previewName.value.replace(/\s+/g, ' ').trim()
  if (!name) return

  // Same maths as the PDF renderer, in canvas pixels. pdf-lib does not kern, so neither do we.
  const scale = el.width / props.pageWidth
  const fontStack = family ? `"${family}"` : 'sans-serif'
  ctx.fontKerning = 'none'
  const measure = (text, size) => {
    ctx.font = `${size}px ${fontStack}`
    return ctx.measureText(text).width
  }
  const layout = layoutName({
    name,
    style: { ...s, size: s.size * scale },
    pageWidth: el.width,
    pageHeight: el.height,
    measure,
  })
  ctx.font = `${layout.size}px ${fontStack}`
  ctx.fillStyle = s.color
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(name, layout.x, el.height - layout.y)
}

function place(event) {
  const rect = canvas.value.getBoundingClientRect()
  const round = (n) => Math.round(clamp(n, 0, 1) * 10000) / 10000
  update({
    x: round((event.clientX - rect.left) / rect.width),
    y: round((event.clientY - rect.top) / rect.height),
  })
}

watch(() => props.previewUrl, async (url) => { await loadImage(url); draw() })
watch(() => props.fontKey, async () => { await loadFont(); draw() })
watch([() => props.modelValue, previewName], draw, { deep: true })

onMounted(async () => {
  await Promise.all([loadImage(props.previewUrl), loadFont()])
  draw()
  observer = new ResizeObserver(draw)
  observer.observe(wrap.value)
})
onUnmounted(() => observer?.disconnect())
</script>
