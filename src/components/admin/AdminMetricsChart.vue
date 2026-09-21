<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-4">
    <!-- ════════ REGISTRATION VELOCITY (AREA CHART) ════════ (8 cols on lg) -->
    <div
      class="lg:col-span-8 bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between"
    >
      <!-- Header with Time-Range Selector -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-slate-900 text-xs tracking-tight">
              Registration Velocity
            </h3>
            <span
              v-if="hoveredPoint"
              class="text-[11px] font-mono font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-lg transition-all"
            >
              {{ hoveredPoint.day }}: {{ hoveredPoint.count }} signups
            </span>
          </div>
          <p class="text-[11px] text-slate-400 mt-0.5">
            Daily attendee volume over time
          </p>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-[10px] font-mono text-slate-400 hidden sm:inline">
            Peak: <strong class="text-blue-700 font-semibold">{{ peakCount }}</strong>/day
          </span>
          <div class="flex bg-slate-100/90 p-0.5 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200/60">
            <button
              v-for="r in ranges"
              :key="r.days"
              type="button"
              @click="selectedDays = r.days"
              class="px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer"
              :class="
                selectedDays === r.days
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-blue-600'
              "
            >
              {{ r.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Interactive SVG Chart Area -->
      <div
        class="relative w-full h-44 select-none"
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
              <stop offset="0%" stop-color="#2563eb" stop-opacity="0.22" />
              <stop offset="100%" stop-color="#2563eb" stop-opacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#2563eb" />
              <stop offset="100%" stop-color="#3b82f6" />
            </linearGradient>
          </defs>

          <!-- Horizontal Grid Lines -->
          <g class="grid-lines opacity-25">
            <line
              v-for="y in gridYLevels"
              :key="y"
              x1="0"
              :y1="y"
              :x2="viewWidth"
              :y2="y"
              stroke="#94a3b8"
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
              stroke="#2563eb"
              stroke-width="1.5"
              stroke-dasharray="2 2"
              class="opacity-60"
            />
            <!-- Outer halo -->
            <circle
              :cx="hoveredCoord.x"
              :cy="hoveredCoord.y"
              r="7"
              fill="#2563eb"
              fill-opacity="0.25"
            />
            <!-- Inner dot -->
            <circle
              :cx="hoveredCoord.x"
              :cy="hoveredCoord.y"
              r="4"
              fill="#2563eb"
              stroke="#ffffff"
              stroke-width="2"
            />
          </g>
        </svg>

        <!-- Floating Tooltip Box -->
        <div
          v-if="hoveredPoint && tooltipStyle"
          :style="tooltipStyle"
          class="absolute pointer-events-none -top-1 transform -translate-x-1/2 -translate-y-full mb-1 z-20"
        >
          <div
            class="bg-slate-900/95 backdrop-blur-md text-white text-[11px] py-1.5 px-2.5 rounded-lg shadow-xl shadow-blue-900/20 border border-blue-500/30 flex items-center gap-2 whitespace-nowrap font-mono"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-blue-400 ring-2 ring-blue-400/30"></span>
            <span class="text-slate-300">{{ hoveredPoint.day }}:</span>
            <span class="font-bold text-white">{{ hoveredPoint.count }} signups</span>
          </div>
        </div>
      </div>

      <!-- X-Axis Labels -->
      <div class="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1 pt-1.5 border-t border-slate-100">
        <span>{{ chartStartDate }}</span>
        <span class="hidden sm:inline">Daily Signups</span>
        <span>{{ chartEndDate }}</span>
      </div>
    </div>

    <!-- ════════ TOP INSTITUTIONS (4 cols on lg) ════════ -->
    <div
      class="lg:col-span-4 bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between"
    >
      <div>
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="font-bold text-slate-900 text-xs tracking-tight">
              Top Institutions
            </h3>
            <p class="text-[11px] text-slate-400 mt-0.5">
              Attendee university distribution
            </p>
          </div>
          <span class="text-[10px] font-mono font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-md">
            Ranked
          </span>
        </div>

        <!-- University Rankings Bar List -->
        <div v-if="universities.length" class="flex flex-col gap-2.5 my-1">
          <div
            v-for="(uni, idx) in universities"
            :key="uni.name"
            class="group"
          >
            <div class="flex items-center justify-between text-xs mb-0.5 font-sans">
              <span
                class="font-medium text-slate-700 truncate max-w-[190px]"
                :title="uni.name"
              >
                <span class="text-slate-400 font-mono text-[10px] mr-1">#{{ idx + 1 }}</span>
                {{ uni.name }}
              </span>
              <span class="font-mono text-[11px] font-semibold text-slate-700">
                {{ uni.count }}
                <span class="text-slate-400 text-[10px] font-normal">({{ uni.percentage }}%)</span>
              </span>
            </div>
            <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500 shadow-xs"
                :style="{ width: `${uni.percentage}%` }"
              ></div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="py-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-1.5 font-sans"
        >
          <svg class="w-6 h-6 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
          <span class="text-[11px]">No university data recorded</span>
        </div>
      </div>

      <!-- Throughput Note -->
      <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
        <span class="text-slate-400 font-sans">Delivered vs Total</span>
        <span class="text-slate-700 font-bold font-mono">
          {{ deliveredCount }} / {{ totalRegistrations }} ({{ overallCompletionRate }}%)
        </span>
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
const viewHeight = 180;
const chartContainer = ref(null);
const hoverIndex = ref(null);

const processedTrend = computed(() => {
  const countDays = selectedDays.value;
  const map = new Map();

  if (Array.isArray(props.trend)) {
    for (const item of props.trend) {
      if (item && item.day) {
        map.set(item.day, Number(item.count) || 0);
      }
    }
  }

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
  return Math.max(1, ...processedTrend.value.map((p) => p.count));
});

const points = computed(() => {
  const data = processedTrend.value;
  if (!data.length) return [];

  const maxVal = Math.max(1, ...data.map((p) => p.count));
  const topPad = 20;
  const bottomPad = 20;
  const usableHeight = viewHeight - topPad - bottomPad;
  const stepX = viewWidth / Math.max(1, data.length - 1);

  return data.map((item, idx) => {
    const x = idx * stepX;
    const norm = item.count / maxVal;
    const y = viewHeight - bottomPad - norm * usableHeight;
    return { x, y, item, idx };
  });
});

const gridYLevels = computed(() => [35, 80, 125, 160]);

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
