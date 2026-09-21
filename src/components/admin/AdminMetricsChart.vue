<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
    <!-- ════════ REGISTRATION VELOCITY (AREA CHART) ════════ (8 cols on lg) -->
    <div
      class="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
    >
      <!-- Header with Time-Range Selector -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-extrabold text-slate-900 text-sm tracking-tight">
              Registration Velocity
            </h3>
            <span
              v-if="hoveredPoint"
              class="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md transition-all"
            >
              {{ hoveredPoint.day }}: {{ hoveredPoint.count }} signups
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">
            Daily attendee registrations over time
          </p>
        </div>

        <div class="flex items-center gap-2">
          <!-- Summary pills -->
          <span class="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Peak: <strong class="text-slate-700 font-semibold">{{ peakCount }}</strong>/day
          </span>
          <div class="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
            <button
              v-for="r in ranges"
              :key="r.days"
              type="button"
              @click="selectedDays = r.days"
              class="px-2.5 py-1 rounded-md transition-all cursor-pointer"
              :class="
                selectedDays === r.days
                  ? 'bg-white text-indigo-600 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              "
            >
              {{ r.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Interactive SVG Chart Area -->
      <div
        class="relative w-full h-48 sm:h-56 select-none"
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
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#6366f1" stop-opacity="0.32" />
              <stop offset="85%" stop-color="#6366f1" stop-opacity="0.02" />
              <stop offset="100%" stop-color="#6366f1" stop-opacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#4f46e5" />
              <stop offset="100%" stop-color="#818cf8" />
            </linearGradient>
          </defs>

          <!-- Horizontal Grid Lines -->
          <g class="grid-lines opacity-30">
            <line
              v-for="y in gridYLevels"
              :key="y"
              x1="0"
              :y1="y"
              :x2="viewWidth"
              :y2="y"
              stroke="#cbd5e1"
              stroke-width="1"
              stroke-dasharray="3 3"
            />
          </g>

          <!-- Filled Area Under Curve -->
          <path
            v-if="areaPathD"
            :d="areaPathD"
            fill="url(#areaGradient)"
            class="transition-all duration-300"
          />

          <!-- The Metric Curve Line -->
          <path
            v-if="linePathD"
            :d="linePathD"
            fill="none"
            stroke="url(#lineGradient)"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="transition-all duration-300"
          />

          <!-- Interactive Active Hover Marker -->
          <g v-if="hoveredCoord">
            <!-- Vertical hairline crosshair -->
            <line
              :x1="hoveredCoord.x"
              y1="0"
              :x2="hoveredCoord.x"
              :y2="viewHeight"
              stroke="#6366f1"
              stroke-width="1.5"
              stroke-dasharray="2 2"
              class="opacity-70"
            />
            <!-- Outer pulse halo -->
            <circle
              :cx="hoveredCoord.x"
              :cy="hoveredCoord.y"
              r="7"
              fill="#818cf8"
              fill-opacity="0.25"
            />
            <!-- Inner dot -->
            <circle
              :cx="hoveredCoord.x"
              :cy="hoveredCoord.y"
              r="4"
              fill="#4f46e5"
              stroke="#ffffff"
              stroke-width="2"
            />
          </g>
        </svg>

        <!-- Floating Tooltip Box (HTML for crisp typography) -->
        <div
          v-if="hoveredPoint && tooltipStyle"
          :style="tooltipStyle"
          class="absolute pointer-events-none -top-1 transform -translate-x-1/2 -translate-y-full mb-1 z-20"
        >
          <div
            class="bg-slate-900 text-white text-[11px] py-1 px-2.5 rounded-lg shadow-lg border border-slate-800 flex items-center gap-1.5 whitespace-nowrap"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span class="text-slate-300">{{ hoveredPoint.day }}:</span>
            <span class="font-bold font-mono">{{ hoveredPoint.count }} signups</span>
          </div>
        </div>
      </div>

      <!-- X-Axis Labels -->
      <div class="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-100">
        <span>{{ chartStartDate }}</span>
        <span class="hidden sm:inline">Daily Signup Flow</span>
        <span>{{ chartEndDate }}</span>
      </div>
    </div>

    <!-- ════════ TOP INSTITUTIONS & CONVERSION BREAKDOWN ════════ (4 cols on lg) -->
    <div
      class="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
    >
      <div>
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="font-extrabold text-slate-900 text-sm tracking-tight">
              Top Institutions
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Attendee university distribution
            </p>
          </div>
          <span class="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            Ranked
          </span>
        </div>

        <!-- University Rankings Bar List -->
        <div v-if="universities.length" class="flex flex-col gap-3 my-2">
          <div
            v-for="(uni, idx) in universities"
            :key="uni.name"
            class="group"
          >
            <div class="flex items-center justify-between text-xs mb-1">
              <span
                class="font-medium text-slate-700 truncate max-w-[200px]"
                :title="uni.name"
              >
                <span class="text-slate-400 font-mono text-[10px] mr-1">#{{ idx + 1 }}</span>
                {{ uni.name }}
              </span>
              <span class="font-mono text-[11px] font-semibold text-slate-600">
                {{ uni.count }}
                <span class="text-slate-400 text-[10px] font-normal">({{ uni.percentage }}%)</span>
              </span>
            </div>
            <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500 group-hover:from-indigo-600 group-hover:to-blue-600"
                :style="{ width: `${uni.percentage}%` }"
              ></div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="py-10 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-1"
        >
          <span>🎓</span>
          <span>No university data recorded yet</span>
        </div>
      </div>

      <!-- Quick Delivery Insight Card -->
      <div class="mt-4 pt-3 border-t border-slate-100 bg-slate-50/70 -mx-2 -mb-2 p-3 rounded-xl">
        <div class="flex items-center justify-between text-xs">
          <span class="text-slate-600 font-medium">Pipeline Throughput</span>
          <span class="text-emerald-700 font-bold font-mono">{{ overallCompletionRate }}%</span>
        </div>
        <p class="text-[11px] text-slate-500 mt-0.5">
          {{ deliveredCount }} of {{ totalRegistrations }} total attendees confirmed receipt.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

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
});

const ranges = [
  { label: '7D', days: 7 },
  { label: '14D', days: 14 },
  { label: '30D', days: 30 },
];
const selectedDays = ref(14);

const viewWidth = 600;
const viewHeight = 200;
const chartContainer = ref(null);
const hoverIndex = ref(null);

// Normalize the trend data to guarantee continuity (fill missing dates with 0)
const processedTrend = computed(() => {
  const countDays = selectedDays.value;
  const map = new Map();

  // Populate from real database response
  if (Array.isArray(props.trend)) {
    for (const item of props.trend) {
      if (item && item.day) {
        map.set(item.day, Number(item.count) || 0);
      }
    }
  }

  // Generate sequence of dates ending today
  const result = [];
  const now = new Date();
  for (let i = countDays - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dayStr = d.toISOString().split('T')[0];
    const count = map.get(dayStr) || 0;
    result.push({
      day: dayStr,
      count,
      label: d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
    });
  }

  return result;
});

const peakCount = computed(() => {
  const max = Math.max(1, ...processedTrend.value.map((p) => p.count));
  return max;
});

const points = computed(() => {
  const data = processedTrend.value;
  if (!data.length) return [];

  const maxVal = Math.max(1, ...data.map((p) => p.count));
  // Keep padding of 20px top and 20px bottom
  const topPad = 25;
  const bottomPad = 25;
  const usableHeight = viewHeight - topPad - bottomPad;
  const stepX = viewWidth / Math.max(1, data.length - 1);

  return data.map((item, idx) => {
    const x = idx * stepX;
    const norm = item.count / maxVal;
    const y = viewHeight - bottomPad - norm * usableHeight;
    return { x, y, item, idx };
  });
});

const gridYLevels = computed(() => {
  return [40, 90, 140, 175];
});

// Generate smooth cubic bezier SVG path
const linePathD = computed(() => {
  const pts = points.value;
  if (!pts.length) return '';
  if (pts.length === 1) return `M 0,${pts[0].y} L ${viewWidth},${pts[0].y}`;

  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const cp1x = (p0.x + (p1.x - p0.x) * 0.5).toFixed(1);
    const cp1y = p0.y.toFixed(1);
    const cp2x = cp1x;
    const cp2y = p1.y.toFixed(1);
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`;
  }
  return d;
});

const areaPathD = computed(() => {
  const lineD = linePathD.value;
  if (!lineD) return '';
  const pts = points.value;
  const lastX = pts[pts.length - 1].x.toFixed(1);
  return `${lineD} L ${lastX},${viewHeight} L 0,${viewHeight} Z`;
});

const onMouseMove = (event) => {
  if (!chartContainer.value || !points.value.length) return;
  const rect = chartContainer.value.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const scale = viewWidth / rect.width;
  const svgX = mouseX * scale;

  // Find nearest point
  let closestIdx = 0;
  let minDist = Infinity;
  points.value.forEach((pt, idx) => {
    const dist = Math.abs(pt.x - svgX);
    if (dist < minDist) {
      minDist = dist;
      closestIdx = idx;
    }
  });

  hoverIndex.value = closestIdx;
};

const hoveredCoord = computed(() => {
  if (hoverIndex.value === null || !points.value[hoverIndex.value]) return null;
  return points.value[hoverIndex.value];
});

const hoveredPoint = computed(() => {
  if (hoverIndex.value === null || !processedTrend.value[hoverIndex.value]) return null;
  return processedTrend.value[hoverIndex.value];
});

const tooltipStyle = computed(() => {
  if (!hoveredCoord.value || !chartContainer.value) return null;
  const pct = (hoveredCoord.value.x / viewWidth) * 100;
  return {
    left: `${pct}%`,
    top: `${(hoveredCoord.value.y / viewHeight) * 100}%`,
  };
});

const chartStartDate = computed(() => {
  const data = processedTrend.value;
  return data.length ? data[0].label : '';
});

const chartEndDate = computed(() => {
  const data = processedTrend.value;
  return data.length ? data[data.length - 1].label : '';
});

// University distribution
const totalRegistrations = computed(() => props.stats?.totals.registrations || 0);
const deliveredCount = computed(() => props.stats?.email.delivered || 0);

const universities = computed(() => {
  const list = props.topUniversities || [];
  const total = totalRegistrations.value || 1;
  return list.slice(0, 5).map((u) => ({
    name: u.name,
    count: u.count,
    percentage: Math.min(100, Math.round((u.count / total) * 100)),
  }));
});

const overallCompletionRate = computed(() => {
  if (!totalRegistrations.value) return 100;
  return Math.min(100, Math.round((deliveredCount.value / totalRegistrations.value) * 100));
});
</script>
