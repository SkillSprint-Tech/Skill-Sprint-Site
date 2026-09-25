<template>
  <div class="flex flex-col gap-3 mb-4">
    <!-- Compact Executive Metric Strip -->
    <div
      class="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/70 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-4 transition-colors duration-150"
    >
      <!-- Hero Stat 1: Total Volume & Velocity -->
      <div class="flex items-center gap-6">
        <div class="flex flex-col">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
            Total Registrations
          </span>
          <div class="flex items-baseline gap-2 mt-0.5">
            <span class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono tabular-nums">
              {{ (stats?.totals.registrations ?? 0).toLocaleString() }}
            </span>
            <span
              v-if="stats?.totals.registrations_7d"
              class="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 px-2 py-0.5 rounded-lg font-mono tabular-nums"
            >
              <svg class="w-3 h-3 text-blue-600 dark:text-blue-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 11l5-5 5 5" />
              </svg>
              +{{ stats.totals.registrations_7d }} past 7d
            </span>
          </div>
        </div>

        <!-- Stat 2: Delivery Health -->
        <div class="hidden sm:flex flex-col border-l border-slate-100 dark:border-slate-800 pl-6">
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
              Delivery Success
            </span>
            <span
              class="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded-md"
              :class="
                deliveryRate >= 95
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                  : deliveryRate >= 80
                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60'
              "
            >
              {{ deliveryRate }}%
            </span>
          </div>

          <div class="flex items-center gap-3 mt-1 text-xs tabular-nums font-mono text-slate-600 dark:text-slate-400">
            <span class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"></span>
              <strong class="font-semibold text-slate-800 dark:text-slate-200">{{ stats?.email.delivered ?? 0 }}</strong> delivered
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500 ring-2 ring-amber-500/20"></span>
              <strong class="font-semibold text-slate-700 dark:text-slate-300">{{ stats?.email.notReceived ?? 0 }}</strong> pending
            </span>
            <span
              v-if="stats?.email.failed"
              class="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-semibold"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500 ring-2 ring-rose-500/20"></span>
              {{ stats.email.failed }} failed
            </span>
          </div>
        </div>
      </div>

      <!-- Right Controls: Capacity & Charts Drawer Toggle -->
      <div class="flex items-center gap-4">
        <!-- Daily Provider Quota -->
        <div class="hidden lg:flex items-center gap-2 border-r border-slate-100 dark:border-slate-800 pr-4 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Quota:</span>
          <span
            v-for="(q, name) in stats?.quota?.usage || {}"
            :key="name"
            class="px-2 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-[11px]"
          >
            <span class="uppercase font-semibold text-slate-600 dark:text-slate-400">{{ name }}</span>
            <span class="text-slate-800 dark:text-slate-200 font-bold ml-1">{{ q.used }}/{{ q.limit }}</span>
          </span>
          <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">reset {{ resetCountdown }}</span>
        </div>

        <button
          type="button"
          @click="$emit('toggle-analytics')"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
          :class="
            showAnalytics
              ? 'bg-blue-600 text-white border border-blue-600 shadow-sm shadow-blue-500/25'
              : 'bg-white dark:bg-slate-800 hover:bg-blue-50/60 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-200/80 dark:border-slate-700 hover:border-blue-200 dark:hover:border-slate-600'
          "
        >
          <svg class="w-3.5 h-3.5 text-current" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2 13.5h12M4 10.5v-3M8 10.5v-7M12 10.5v-5" />
          </svg>
          <span class="hidden sm:inline">{{ showAnalytics ? 'Hide Analytics' : 'Analytics & Trends' }}</span>
          <span class="sm:hidden">{{ showAnalytics ? 'Hide' : 'Analytics' }}</span>
        </button>
      </div>
    </div>

    <!-- Actionable Alert Banners (surfaced when attention needed) -->
    <div
      v-if="stuckWarning"
      class="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200 shadow-2xs"
    >
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 2l6 12H2L8 2zm0 5v3m0 2h.01" />
        </svg>
        <span class="text-xs font-bold text-amber-950 dark:text-amber-100">
          {{ stuckWarning.title }}:
        </span>
        <span class="text-xs text-amber-800 dark:text-amber-300">
          {{ stuckWarning.body }}
        </span>
      </div>
      <button
        type="button"
        @click="$emit('release-stuck')"
        class="shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
      >
        Release & Send Now
      </button>
    </div>

    <div
      v-if="senderWarning"
      class="bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/80 rounded-2xl p-3.5 flex items-center gap-2 text-rose-900 dark:text-rose-200 shadow-2xs"
    >
      <svg class="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="8" cy="8" r="6" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 5v3m0 2.5h.01" />
      </svg>
      <span class="text-xs font-bold text-rose-950 dark:text-rose-100">{{ senderWarning.title }}:</span>
      <span class="text-xs text-rose-800 dark:text-rose-300">{{ senderWarning.body }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  stats: {
    type: Object,
    default: null,
  },
  emailView: {
    type: String,
    default: 'welcome_schedule',
  },
  resetCountdown: {
    type: String,
    default: '—',
  },
  senderSummary: {
    type: String,
    default: '',
  },
  senderWarning: {
    type: Object,
    default: null,
  },
  stuckWarning: {
    type: Object,
    default: null,
  },
  showAnalytics: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['toggle-analytics', 'release-stuck', 'retry-failed']);

const deliveryRate = computed(() => {
  if (!props.stats?.email) return 100;
  const totalSent = (props.stats.email.sent || 0) + (props.stats.email.delivered || 0);
  const delivered = props.stats.email.delivered || 0;
  if (!totalSent) return 100;
  return Math.round((delivered / totalSent) * 100);
});
</script>
