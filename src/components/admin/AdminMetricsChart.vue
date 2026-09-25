<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-3.5 mb-4">
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!-- REGISTRATION VELOCITY (8 cols on lg)                                  -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <div
      class="lg:col-span-8 rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors duration-150"
    >
      <!-- Header: Title, Summary Numbers, and Time Range -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
              Registration Velocity
            </h3>
            <span
              v-if="hoveredPoint"
              class="text-[11px] font-mono font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-900/60 px-2 py-0.5 rounded-md"
            >
              {{ hoveredPoint.label }}: {{ hoveredPoint.count }} signups
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daily attendee signups over time
          </p>
        </div>

        <div class="flex items-center gap-2">
          <!-- Summary stats pill -->
          <div class="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 text-xs font-mono text-slate-600 dark:text-slate-300">
            <span>Peak: <strong class="text-slate-900 dark:text-white font-semibold">{{ peakCount }}</strong>/day</span>
            <span class="text-slate-300 dark:text-slate-600">·</span>
            <span>Total: <strong class="text-slate-900 dark:text-white font-semibold">{{ windowTotal }}</strong></span>
          </div>

          <!-- Range Switcher -->
          <div class="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
            <button
              v-for="r in ranges"
              :key="r.days"
              type="button"
              @click="selectedDays = r.days"
              class="px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all cursor-pointer"
              :class="
                selectedDays === r.days
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              "
            >
              {{ r.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Clean SVG Chart Area -->
      <div
        class="relative w-full h-44 select-none my-2"
        @mousemove="onMouseMove"
        @mouseleave="hoverIndex = null"
        ref="chartContainer"
      >
        <svg
          class="w-full h-full overflow-visible"
          :viewBox="`0 0 ${viewWidth} ${viewHeight}`"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="velocityAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.18" />
              <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.0" />
            </linearGradient>
          </defs>

          <!-- Horizontal Grid Lines -->
          <g class="stroke-slate-100 dark:stroke-slate-800">
            <line
              v-for="y in gridYLevels"
              :key="y"
              x1="0"
              :y1="y"
              :x2="viewWidth"
              :y2="y"
              stroke-width="1"
              stroke-dasharray="3 3"
            />
          </g>

          <!-- Area Fill -->
          <path
            v-if="areaPathD"
            :d="areaPathD"
            fill="url(#velocityAreaGradient)"
            class="transition-all duration-300"
          />

          <!-- Primary Curve Line -->
          <path
            v-if="linePathD"
            :d="linePathD"
            fill="none"
            stroke="#3b82f6"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="transition-all duration-300"
          />

          <!-- Interactive Hover Marker -->
          <g v-if="hoveredCoord">
            <!-- Vertical guide line -->
            <line
              :x1="hoveredCoord.x"
              y1="0"
              :x2="hoveredCoord.x"
              :y2="viewHeight"
              stroke="#3b82f6"
              stroke-width="1.5"
              stroke-dasharray="2 2"
              class="opacity-50"
            />

            <!-- Outer ring -->
            <circle
              :cx="hoveredCoord.x"
              :cy="hoveredCoord.y"
              r="6"
              fill="#3b82f6"
              fill-opacity="0.2"
            />

            <!-- Inner dot -->
            <circle
              :cx="hoveredCoord.x"
              :cy="hoveredCoord.y"
              r="3.5"
              fill="#3b82f6"
              stroke="#ffffff"
              stroke-width="2"
            />
          </g>
        </svg>

        <!-- Floating Tooltip Box -->
        <div
          v-if="hoveredPoint && tooltipStyle"
          :style="tooltipStyle"
          class="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full -top-1.5 z-20"
        >
          <div
            class="bg-slate-900/95 dark:bg-slate-800/95 text-white text-xs py-1 px-2.5 rounded-lg shadow-lg border border-slate-700/80 flex items-center gap-2 whitespace-nowrap font-mono"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span class="text-slate-300">{{ hoveredPoint.label }}:</span>
            <span class="font-bold text-white">{{ hoveredPoint.count }} signups</span>
          </div>
        </div>
      </div>

      <!-- X-Axis Labels -->
      <div class="flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span>{{ chartStartDate }}</span>
        <span>Daily Registrations</span>
        <span>{{ chartEndDate }}</span>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!-- TOP INSTITUTIONS (4 cols on lg)                                       -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <div
      class="lg:col-span-4 rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors duration-150"
    >
      <div>
        <!-- Header -->
        <div class="flex items-center justify-between mb-3.5">
          <div>
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
              Top Institutions
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Attendee university distribution
            </p>
          </div>
          <span class="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700">
            Top 5
          </span>
        </div>

        <!-- University Rankings List -->
        <div v-if="universities.length" class="flex flex-col gap-3 my-1">
          <div
            v-for="(uni, idx) in universities"
            :key="uni.name"
            class="group"
          >
            <div class="flex items-center justify-between text-xs mb-1 font-sans">
              <span
                class="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[200px]"
                :title="uni.name"
              >
                <span class="text-slate-400 dark:text-slate-500 font-mono text-[11px] mr-1.5">{{ idx + 1 }}.</span>
                {{ uni.name }}
              </span>
              <span class="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 shrink-0">
                {{ uni.count }}
                <span class="text-slate-400 dark:text-slate-500 font-normal text-[11px]">({{ uni.percentage }}%)</span>
              </span>
            </div>
            <!-- Clean Progress Track -->
            <div class="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-500"
                :style="{ width: `${uni.percentage}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="py-10 text-center text-xs text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center gap-1.5"
        >
          <svg class="w-6 h-6 text-slate-300 dark:text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
          <span>No university records available</span>
        </div>
      </div>

      <!-- Conversion Summary Footer -->
      <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
        <span class="text-slate-500 dark:text-slate-400 font-sans">Delivered vs Total</span>
        <span class="text-slate-800 dark:text-slate-200 font-semibold">
          {{ deliveredCount }} / {{ totalRegistrations }} ({{ overallCompletionRate }}%)
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  trend: {
    type: Array,
    default: () => [],
  },
  topUniversities: {
    type: Array,
    default: () => [],
  },
  stats: {
    type: Object,
    default: null,
  },
})

const ranges = [
  { label: '7D', days: 7 },
  { label: '14D', days: 14 },
  { label: '30D', days: 30 },
]
const selectedDays = ref(14)

const viewWidth = 600
const viewHeight = 180
const chartContainer = ref(null)
const hoverIndex = ref(null)

const processedTrend = computed(() => {
  const countDays = selectedDays.value
  const map = new Map()

  if (Array.isArray(props.trend)) {
    for (const item of props.trend) {
      if (item && item.day) {
        map.set(item.day, Number(item.count) || 0)
      }
    }
  }

  const result = []
  const now = new Date()
  for (let i = countDays - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000)
    const dayStr = d.toISOString().split('T')[0]
    const count = map.get(dayStr) || 0
    result.push({
      day: dayStr,
      count,
      label: d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
    })
  }

  return result
})

const windowTotal = computed(() => {
  return processedTrend.value.reduce((acc, curr) => acc + curr.count, 0)
})

const peakCount = computed(() => {
  return Math.max(1, ...processedTrend.value.map((p) => p.count))
})

const points = computed(() => {
  const data = processedTrend.value
  if (!data.length) return []

  const maxVal = Math.max(1, ...data.map((p) => p.count))
  const topPad = 20
  const bottomPad = 20
  const usableHeight = viewHeight - topPad - bottomPad
  const stepX = viewWidth / Math.max(1, data.length - 1)

  return data.map((item, idx) => {
    const x = idx * stepX
    const norm = item.count / maxVal
    const y = viewHeight - bottomPad - norm * usableHeight
    return { x, y, item, idx }
  })
})

const gridYLevels = computed(() => [35, 75, 115, 155])

const linePathD = computed(() => {
  const pts = points.value
  if (!pts.length) return ''
  if (pts.length === 1) return `M 0,${pts[0].y} L ${viewWidth},${pts[0].y}`

  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i]
    const p1 = pts[i + 1]
    const cp1x = (p0.x + (p1.x - p0.x) * 0.5).toFixed(1)
    const cp1y = p0.y.toFixed(1)
    const cp2x = cp1x
    const cp2y = p1.y.toFixed(1)
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`
  }
  return d
})

const areaPathD = computed(() => {
  const lineD = linePathD.value
  if (!lineD) return ''
  const pts = points.value
  const lastX = pts[pts.length - 1].x.toFixed(1)
  return `${lineD} L ${lastX},${viewHeight} L 0,${viewHeight} Z`
})

const onMouseMove = (event) => {
  if (!chartContainer.value || !points.value.length) return
  const rect = chartContainer.value.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  const scale = viewWidth / rect.width
  const svgX = mouseX * scale

  let closestIdx = 0
  let minDist = Infinity
  points.value.forEach((pt, idx) => {
    const dist = Math.abs(pt.x - svgX)
    if (dist < minDist) {
      minDist = dist
      closestIdx = idx
    }
  })

  hoverIndex.value = closestIdx
}

const hoveredCoord = computed(() => {
  if (hoverIndex.value === null || !points.value[hoverIndex.value]) return null
  return points.value[hoverIndex.value]
})

const hoveredPoint = computed(() => {
  if (hoverIndex.value === null || !processedTrend.value[hoverIndex.value]) return null
  return processedTrend.value[hoverIndex.value]
})

const tooltipStyle = computed(() => {
  if (!hoveredCoord.value || !chartContainer.value) return null
  const pct = (hoveredCoord.value.x / viewWidth) * 100
  return {
    left: `${pct}%`,
    top: `${(hoveredCoord.value.y / viewHeight) * 100}%`,
  }
})

const chartStartDate = computed(() => {
  const data = processedTrend.value
  return data.length ? data[0].label : ''
})

const chartEndDate = computed(() => {
  const data = processedTrend.value
  return data.length ? data[data.length - 1].label : ''
})

const totalRegistrations = computed(() => props.stats?.totals?.registrations || 0)
const deliveredCount = computed(() => props.stats?.email?.delivered || 0)

const universities = computed(() => {
  const list = props.topUniversities || []
  const total = totalRegistrations.value || 1
  return list.slice(0, 5).map((u) => ({
    name: u.name,
    count: u.count,
    percentage: Math.min(100, Math.round((u.count / total) * 100)),
  }))
})

const overallCompletionRate = computed(() => {
  if (!totalRegistrations.value) return 100
  return Math.min(100, Math.round((deliveredCount.value / totalRegistrations.value) * 100))
})
</script>
