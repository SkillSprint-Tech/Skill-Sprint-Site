<template>
  <div class="flex flex-col gap-3 mb-4">
    <!-- Compact Executive Metric Strip (~70px height instead of massive cards) -->
    <div
      class="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4"
    >
      <!-- Hero Stat 1: Total Volume & Velocity -->
      <div class="flex items-center gap-4">
        <div class="flex flex-col">
          <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Registrations
          </span>
          <div class="flex items-baseline gap-2.5 mt-0.5">
            <span class="text-3xl font-black text-slate-900 tracking-tight tabular-nums">
              {{ (stats?.totals.registrations ?? 0).toLocaleString() }}
            </span>
            <span
              v-if="stats?.totals.registrations_7d"
              class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full tabular-nums"
            >
              ↑ +{{ stats.totals.registrations_7d }} 7d
            </span>
          </div>
        </div>
      </div>

      <!-- Stat 2: Delivery Health -->
      <div class="flex items-center gap-4 border-l border-slate-100 pl-4">
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Delivery Success
            </span>
            <span
              class="text-[11px] font-bold px-1.5 py-0.2 rounded font-mono"
              :class="
                deliveryRate >= 95
                  ? 'bg-emerald-50 text-emerald-700'
                  : deliveryRate >= 80
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-rose-50 text-rose-700'
              "
            >
              {{ deliveryRate }}%
            </span>
          </div>

          <div class="flex items-center gap-3 mt-1 text-xs tabular-nums">
            <span class="flex items-center gap-1 text-slate-700 font-semibold">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {{ stats?.email.delivered ?? 0 }} delivered
            </span>
            <span class="flex items-center gap-1 text-slate-500">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              {{ stats?.email.notReceived ?? 0 }} unsent
            </span>
            <span
              v-if="stats?.email.failed"
              class="flex items-center gap-1 text-rose-600 font-bold"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              {{ stats.email.failed }} failed
            </span>
          </div>
        </div>
      </div>

      <!-- Stat 3: Provider Capacity & Reset -->
      <div class="hidden md:flex items-center gap-4 border-l border-slate-100 pl-4 text-xs">
        <div class="flex flex-col">
          <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Daily Provider Quota
          </span>
          <div class="flex items-center gap-3 mt-1 font-mono text-slate-600">
            <span
              v-for="(q, name) in stats?.quota?.usage || {}"
              :key="name"
              class="flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md"
            >
              <strong class="uppercase text-[10px] text-slate-500">{{ name }}:</strong>
              <span>{{ q.used }}/{{ q.limit }}</span>
            </span>
            <span class="text-[11px] text-slate-400">resets {{ resetCountdown }}</span>
          </div>
        </div>
      </div>

      <!-- Right Controls: Toggle Charts Drawer & Direct Actions -->
      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="$emit('toggle-analytics')"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs"
          :class="
            showAnalytics
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          "
        >
          <span>📊</span>
          <span>{{ showAnalytics ? 'Hide Analytics' : 'Show Analytics & Trends' }}</span>
        </button>
      </div>
    </div>

    <!-- ════════ ACTIONABLE ALERTS (Surfaced immediately if attention needed) ════════ -->
    <div
      v-if="stuckWarning"
      class="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 shadow-2xs"
    >
      <div class="flex items-center gap-2.5">
        <span class="text-amber-600 font-bold">⚠</span>
        <span class="text-xs font-bold text-amber-950">
          {{ stuckWarning.title }}:
        </span>
        <span class="text-xs text-amber-800">
          {{ stuckWarning.body }}
        </span>
      </div>
      <button
        type="button"
        @click="$emit('release-stuck')"
        class="shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
      >
        Release & Send Now
      </button>
    </div>

    <div
      v-if="senderWarning"
      class="bg-rose-50 border border-rose-300 rounded-xl p-3.5 flex items-center gap-2.5 text-rose-900 shadow-2xs"
    >
      <span class="text-rose-600 font-bold">⚠</span>
      <span class="text-xs font-bold text-rose-950">{{ senderWarning.title }}:</span>
      <span class="text-xs text-rose-800">{{ senderWarning.body }}</span>
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
