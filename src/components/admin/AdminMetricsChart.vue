<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-3.5 mb-4">
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!-- SPATIAL VELOCITY TELEMETRY (8 cols on lg)                             -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <div
      class="lg:col-span-8 relative rounded-3xl p-4 sm:p-5 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)] flex flex-col justify-between overflow-hidden group transition-all duration-300"
    >
      <!-- Spatial Ambient Glow Orbs behind the Chart -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute -top-16 -left-16 w-64 h-64 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-16 -right-16 w-72 h-72 bg-violet-500/10 dark:bg-violet-500/15 rounded-full blur-3xl"></div>
        <!-- Cybernetic dot matrix watermark -->
        <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] [background-image:radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      <!-- Header: Title, Telemetry Chips, Range Selector -->
      <div class="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-3">
        <!-- Title & Live Trajectory Status -->
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/25 shrink-0">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm tracking-tight">
                Registration Velocity
              </h3>
              <!-- Pulse Beacon -->
              <span class="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200/80 dark:border-cyan-800/70 shadow-2xs">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping"></span>
                <span>Spatial HUD</span>
              </span>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              High-density trajectory telemetry across {{ selectedDays }} days
            </p>
          </div>
        </div>

        <!-- Telemetry HUD Badges & Range Selector -->
        <div class="flex items-center gap-2">
          <!-- Peak Surge Badge -->
          <div
            class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-[11px] font-mono"
            title="Highest single-day signup surge in this range"
          >
            <span class="text-slate-400 dark:text-slate-500 uppercase text-[9px] font-bold">Peak</span>
            <span class="font-extrabold text-cyan-600 dark:text-cyan-400">{{ peakCount }}</span>
            <span class="text-slate-400 text-[10px]">/day</span>
          </div>

          <!-- Total Range Volume -->
          <div
            class="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-[11px] font-mono"
            title="Total signups within window"
          >
            <span class="text-slate-400 dark:text-slate-500 uppercase text-[9px] font-bold">Sum</span>
            <span class="font-extrabold text-violet-600 dark:text-violet-400">{{ windowTotal }}</span>
          </div>

          <!-- Range Switcher -->
          <div
            class="flex items-center bg-slate-100 dark:bg-slate-800/90 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs"
          >
            <button
              v-for="r in ranges"
              :key="r.days"
              type="button"
              @click="selectedDays = r.days"
              class="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer"
              :class="
                selectedDays === r.days
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
              "
            >
              {{ r.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Telemetry Sub-Strip (Pace & Momentum) -->
      <div class="relative z-10 grid grid-cols-3 gap-2 py-2 mb-2 border-y border-slate-100 dark:border-slate-800/70 text-xs font-mono">
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] text-slate-400 uppercase">Avg Velocity:</span>
          <span class="font-bold text-slate-800 dark:text-slate-200">~{{ dailyAverage }}/day</span>
        </div>
        <div class="flex items-center justify-center gap-1.5">
          <span class="text-[10px] text-slate-400 uppercase">Surge Pace:</span>
          <span
            class="font-bold px-1.5 py-0.2 rounded text-[11px]"
            :class="momentum >= 0 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'"
          >
            {{ momentum >= 0 ? `+${momentum}%` : `${momentum}%` }}
          </span>
        </div>
        <div class="flex items-center justify-end gap-1.5 text-right">
          <span class="text-[10px] text-slate-400 uppercase">Window:</span>
          <span class="font-bold text-slate-800 dark:text-slate-200">{{ chartStartDate }} → {{ chartEndDate }}</span>
        </div>
      </div>

      <!-- ═══════════════ INTERACTIVE SPATIAL SVG CHART AREA ═══════════════ -->
      <div
        class="relative w-full h-48 select-none my-1"
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
            <!-- Multi-stop spatial area gradient -->
            <linearGradient id="spatialAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.45" />
              <stop offset="40%" stop-color="#3b82f6" stop-opacity="0.25" />
              <stop offset="80%" stop-color="#8b5cf6" stop-opacity="0.08" />
              <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.00" />
            </linearGradient>

            <!-- Holographic neon laser curve gradient -->
            <linearGradient id="spatialLaserGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#06b6d4" />
              <stop offset="45%" stop-color="#3b82f6" />
              <stop offset="80%" stop-color="#8b5cf6" />
              <stop offset="100%" stop-color="#ec4899" />
            </linearGradient>

            <!-- SVG Glow Filter for Laser Aura -->
            <filter id="laserNeonAura" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <!-- Cybernetic Datum Grid Lines -->
          <g class="stroke-slate-200/80 dark:stroke-slate-800/80">
            <line
              v-for="y in gridYLevels"
              :key="y"
              x1="0"
              :y1="y"
              :x2="viewWidth"
              :y2="y"
              stroke-width="1"
              stroke-dasharray="4 4"
            />
          </g>

          <!-- Filled Area Under Curve -->
          <path
            v-if="areaPathD"
            :d="areaPathD"
            fill="url(#spatialAreaGrad)"
            class="transition-all duration-300"
          />

          <!-- Radiant Glow Layer (Soft photon emission behind the laser) -->
          <path
            v-if="linePathD"
            :d="linePathD"
            fill="none"
            stroke="url(#spatialLaserGrad)"
            stroke-width="6"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="opacity-40 blur-[3px]"
          />

          <!-- Crisp Primary Laser Curve Line -->
          <path
            v-if="linePathD"
            :d="linePathD"
            fill="none"
            stroke="url(#spatialLaserGrad)"
            stroke-width="2.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            filter="url(#laserNeonAura)"
            class="transition-all duration-300"
          />

          <!-- Subtle Glowing Node Beads on Key Points -->
          <g v-for="pt in sampledPoints" :key="pt.idx">
            <circle
              :cx="pt.x"
              :cy="pt.y"
              r="2.5"
              fill="#06b6d4"
              class="opacity-60 dark:opacity-80"
            />
          </g>

          <!-- Interactive Holographic Crosshair Reticle on Hover -->
          <g v-if="hoveredCoord">
            <!-- Vertical Laser Guide Line with Neon Dash -->
            <line
              :x1="hoveredCoord.x"
              y1="0"
              :x2="hoveredCoord.x"
              :y2="viewHeight"
              stroke="#06b6d4"
              stroke-width="1.5"
              stroke-dasharray="3 3"
              class="opacity-80"
            />

            <!-- Horizontal Alignment Guide to Axis -->
            <line
              x1="0"
              :y1="hoveredCoord.y"
              :x2="viewWidth"
              :y2="hoveredCoord.y"
              stroke="#8b5cf6"
              stroke-width="1"
              stroke-dasharray="2 2"
              class="opacity-50"
            />

            <!-- Outer Pulse Ripple -->
            <circle
              :cx="hoveredCoord.x"
              :cy="hoveredCoord.y"
              r="12"
              fill="#06b6d4"
              fill-opacity="0.18"
              class="animate-ping"
            />

            <!-- Holographic Targeting Ring -->
            <circle
              :cx="hoveredCoord.x"
              :cy="hoveredCoord.y"
              r="8"
              fill="#06b6d4"
              fill-opacity="0.30"
              stroke="#38bdf8"
              stroke-width="1.5"
            />

            <!-- Laser Core Bead -->
            <circle
              :cx="hoveredCoord.x"
              :cy="hoveredCoord.y"
              r="3.5"
              fill="#ffffff"
              stroke="#06b6d4"
              stroke-width="2"
            />
          </g>
        </svg>

        <!-- Floating Holographic HUD Tooltip Box -->
        <div
          v-if="hoveredPoint && tooltipStyle"
          :style="tooltipStyle"
          class="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full -top-2 z-30 transition-transform duration-75"
        >
          <div
            class="bg-slate-950/95 backdrop-blur-xl border border-cyan-500/50 rounded-xl px-3 py-2 text-white shadow-2xl shadow-cyan-950/60 font-mono text-xs flex flex-col gap-1 min-w-[140px]"
          >
            <div class="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1">
              <span>{{ hoveredPoint.label }}</span>
              <span class="text-cyan-400 font-bold">#{{ hoveredPoint.day }}</span>
            </div>
            <div class="flex items-center justify-between gap-3 pt-0.5">
              <span class="text-slate-300 font-medium">Registrations:</span>
              <span class="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {{ hoveredPoint.count }}
              </span>
            </div>
            <div class="flex items-center justify-between text-[9px] text-slate-400">
              <span>Surge Intensity:</span>
              <span class="text-emerald-400 font-bold">
                {{ Math.round((hoveredPoint.count / peakCount) * 100) }}% of peak
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- X-Axis Telemetry Timeline -->
      <div class="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <span class="flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
          {{ chartStartDate }}
        </span>
        <span class="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
          Daily Velocity Vector
        </span>
        <span class="flex items-center gap-1">
          {{ chartEndDate }}
          <span class="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
        </span>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!-- TOP INSTITUTIONS: HOLOGRAPHIC MAXIMALIST LEADERBOARD (4 cols on lg)   -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <div
      class="lg:col-span-4 relative rounded-3xl p-4 sm:p-5 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)] flex flex-col justify-between overflow-hidden group transition-all duration-300"
    >
      <!-- Ambient Backlight -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl"></div>
      </div>

      <div class="relative z-10">
        <!-- Header -->
        <div class="flex items-center justify-between mb-3.5">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/25 shrink-0">
              <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div>
              <h3 class="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm tracking-tight">
                Top Institutions
              </h3>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">
                Maximalist university distribution
              </p>
            </div>
          </div>

          <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/70">
            Ranked #1-5
          </span>
        </div>

        <!-- Leaderboard List -->
        <div v-if="universities.length" class="flex flex-col gap-3 my-2">
          <div
            v-for="(uni, idx) in universities"
            :key="uni.name"
            class="group/item transition-all duration-200 hover:translate-x-1"
          >
            <!-- Uni Name & Volume -->
            <div class="flex items-center justify-between text-xs mb-1.5 font-sans">
              <div class="flex items-center gap-1.5 min-w-0 pr-2">
                <!-- Maximalist Holographic Rank Badges -->
                <span
                  v-if="idx === 0"
                  class="inline-flex items-center justify-center w-5 h-5 rounded-md bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[10px] shadow-sm shadow-amber-500/40 shrink-0"
                  title="Rank 1: Highest Campus Volume"
                >
                  👑
                </span>
                <span
                  v-else-if="idx === 1"
                  class="inline-flex items-center justify-center w-5 h-5 rounded-md bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-black text-[10px] shadow-sm shadow-cyan-500/30 shrink-0"
                >
                  2
                </span>
                <span
                  v-else-if="idx === 2"
                  class="inline-flex items-center justify-center w-5 h-5 rounded-md bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black text-[10px] shadow-sm shadow-purple-500/30 shrink-0"
                >
                  3
                </span>
                <span
                  v-else
                  class="inline-flex items-center justify-center w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[10px] font-bold shrink-0"
                >
                  {{ idx + 1 }}
                </span>

                <span
                  class="font-semibold text-slate-800 dark:text-slate-200 truncate group-hover/item:text-blue-600 dark:group-hover/item:text-cyan-400 transition-colors"
                  :title="uni.name"
                >
                  {{ uni.name }}
                </span>
              </div>

              <!-- Count & Percentage Telemetry -->
              <div class="flex items-center gap-1.5 font-mono text-[11px] shrink-0">
                <span class="font-extrabold text-slate-900 dark:text-white">
                  {{ uni.count }}
                </span>
                <span class="text-[10px] px-1.5 py-0.2 rounded-md font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {{ uni.percentage }}%
                </span>
              </div>
            </div>

            <!-- Dual-Layer Spatial Progress Bar -->
            <div class="relative w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800/90 overflow-hidden shadow-inner p-[1px]">
              <div
                class="h-full rounded-full transition-all duration-700 relative shadow-sm"
                :class="
                  idx === 0
                    ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 shadow-amber-500/30'
                    : idx === 1
                    ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 shadow-cyan-500/30'
                    : idx === 2
                    ? 'bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 shadow-purple-500/30'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                "
                :style="{ width: `${uni.percentage}%` }"
              >
                <!-- Glowing laser tip -->
                <div class="absolute right-0 top-0 bottom-0 w-2 bg-white/70 rounded-full blur-[1px]"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="py-12 text-center text-xs text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center gap-2 font-sans"
        >
          <div class="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
            </svg>
          </div>
          <p class="text-xs">No university affiliations indexed</p>
        </div>
      </div>

      <!-- ═══════════════ SPATIAL PIPELINE CONVERSION GAUGE ═══════════════ -->
      <div class="relative z-10 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2">
        <div class="flex items-center justify-between text-[11px] font-mono">
          <div class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span class="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"></span>
            <span>Delivery Pipeline:</span>
          </div>
          <span class="font-extrabold text-slate-900 dark:text-white">
            {{ deliveredCount }} / {{ totalRegistrations }}
            <span class="text-emerald-600 dark:text-emerald-400">({{ overallCompletionRate }}%)</span>
          </span>
        </div>

        <!-- Multi-segment pipeline status bar -->
        <div class="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
          <div
            class="h-full bg-emerald-500 transition-all duration-500"
            :style="{ width: `${overallCompletionRate}%` }"
            title="Delivered"
          ></div>
          <div
            class="h-full bg-amber-400 transition-all duration-500"
            :style="{ width: `${Math.max(0, 100 - overallCompletionRate)}%` }"
            title="Pending or Queued"
          ></div>
        </div>
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

const dailyAverage = computed(() => {
  if (!selectedDays.value) return 0
  return Math.round(windowTotal.value / selectedDays.value)
})

const peakCount = computed(() => {
  return Math.max(1, ...processedTrend.value.map((p) => p.count))
})

const momentum = computed(() => {
  const data = processedTrend.value
  if (data.length < 4) return 0
  const mid = Math.floor(data.length / 2)
  const firstHalf = data.slice(0, mid).reduce((a, b) => a + b.count, 0)
  const secondHalf = data.slice(mid).reduce((a, b) => a + b.count, 0)
  if (firstHalf === 0) return secondHalf > 0 ? 100 : 0
  return Math.round(((secondHalf - firstHalf) / firstHalf) * 100)
})

const points = computed(() => {
  const data = processedTrend.value
  if (!data.length) return []

  const maxVal = Math.max(1, ...data.map((p) => p.count))
  const topPad = 24
  const bottomPad = 22
  const usableHeight = viewHeight - topPad - bottomPad
  const stepX = viewWidth / Math.max(1, data.length - 1)

  return data.map((item, idx) => {
    const x = idx * stepX
    const norm = item.count / maxVal
    const y = viewHeight - bottomPad - norm * usableHeight
    return { x, y, item, idx }
  })
})

const sampledPoints = computed(() => {
  const pts = points.value
  if (pts.length <= 14) return pts
  // Sample every other point to keep spatial maximalism clean
  return pts.filter((_, idx) => idx % 2 === 0)
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
