<template>
  <div class="flex flex-col gap-4 mb-6">
    <!-- Main Stats Grid: Asymmetric Hero + Structured Sub-Clusters -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <!-- ════════ HERO PRIMARY METRIC CARD (Takes 5 cols on lg) ════════ -->
      <div
        class="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-sm border border-slate-800 flex flex-col justify-between relative overflow-hidden group"
      >
        <!-- Decorative subtle background glow -->
        <div
          class="absolute -right-12 -top-12 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/15 transition-all duration-700"
        ></div>

        <!-- Top metadata row -->
        <div class="flex items-center justify-between gap-3 mb-4 relative z-10">
          <div class="flex items-center gap-2">
            <span
              class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
            ></span>
            <span
              class="text-xs font-bold uppercase tracking-wider text-slate-300"
            >
              Primary Metric
            </span>
          </div>
          <span
            class="text-[11px] font-medium bg-slate-800/80 border border-slate-700/60 text-slate-300 px-2.5 py-0.5 rounded-full"
          >
            {{ emailScopeLabel }}
          </span>
        </div>

        <!-- Metric Value -->
        <div class="my-auto py-2 relative z-10">
          <div
            class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1"
          >
            Total Registrations
          </div>
          <div class="flex items-baseline gap-3 flex-wrap">
            <span
              class="text-4xl sm:text-5xl font-black tracking-tight tabular-nums text-white"
            >
              {{ (stats?.totals.registrations ?? 0).toLocaleString() }}
            </span>
            <span
              v-if="stats?.totals.registrations_7d"
              class="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md tabular-nums"
              title="New signups in the last 7 days"
            >
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              +{{ stats.totals.registrations_7d }} this week
            </span>
          </div>
        </div>

        <!-- Bottom Insights & Sparkline Footer -->
        <div
          class="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 relative z-10"
        >
          <div class="flex items-center gap-2">
            <span class="text-slate-300 font-semibold tabular-nums">
              {{ weeklyVelocityPercentage }}%
            </span>
            <span>of total joined in past 7 days</span>
          </div>
          <div class="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
            <span>{{ stats?.totals.workshops ?? 0 }} workshops</span>
          </div>
        </div>
      </div>

      <!-- ════════ SECONDARY SUB-STAT CLUSTERS (Takes 7 cols on lg) ════════ -->
      <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- ── Cluster 1: Email Delivery Funnel & Health ── -->
        <div
          class="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between mb-3">
              <span
                class="text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Delivery Health
              </span>
              <span
                class="text-xs font-bold px-2 py-0.5 rounded-full"
                :class="
                  deliveryRate >= 95
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    : deliveryRate >= 80
                      ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                      : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                "
              >
                {{ deliveryRate }}% success
              </span>
            </div>

            <!-- Visual Multi-segment Progress Bar -->
            <div
              class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex mb-4"
              title="Delivered / In Transit / Needs Attention"
            >
              <div
                class="h-full bg-emerald-500 transition-all duration-500"
                :style="{ width: `${deliveredPercent}%` }"
                title="Delivered"
              ></div>
              <div
                class="h-full bg-sky-400 transition-all duration-500"
                :style="{ width: `${sentPercent}%` }"
                title="Sent (Awaiting receipt confirmation)"
              ></div>
              <div
                class="h-full bg-amber-400 transition-all duration-500"
                :style="{ width: `${pendingPercent}%` }"
                title="Pending / Queued"
              ></div>
              <div
                class="h-full bg-rose-500 transition-all duration-500"
                :style="{ width: `${failedPercent}%` }"
                title="Failed / Bounced"
              ></div>
            </div>

            <!-- Sub-Metrics Pill Grid (Clickable to Filter) -->
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                @click="$emit('filter-status', 'delivered')"
                class="flex flex-col p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors text-left cursor-pointer group"
              >
                <span
                  class="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Delivered
                </span>
                <span
                  class="text-lg font-extrabold text-slate-900 tabular-nums mt-0.5 group-hover:text-emerald-700"
                >
                  {{ (stats?.email.delivered ?? 0).toLocaleString() }}
                </span>
              </button>

              <button
                type="button"
                @click="$emit('filter-status', 'sent')"
                class="flex flex-col p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-sky-50/50 hover:border-sky-200 transition-colors text-left cursor-pointer group"
              >
                <span
                  class="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                  Sent (transit)
                </span>
                <span
                  class="text-lg font-extrabold text-slate-900 tabular-nums mt-0.5 group-hover:text-sky-700"
                >
                  {{ (stats?.email.sent ?? 0).toLocaleString() }}
                </span>
              </button>

              <button
                type="button"
                @click="$emit('filter-status', 'not_received')"
                class="flex flex-col p-2.5 rounded-xl border transition-colors text-left cursor-pointer group"
                :class="
                  (stats?.email.notReceived ?? 0) > 0
                    ? 'border-amber-200 bg-amber-50/40 hover:bg-amber-100/50'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100'
                "
              >
                <span
                  class="text-[11px] font-semibold flex items-center gap-1.5"
                  :class="
                    (stats?.email.notReceived ?? 0) > 0
                      ? 'text-amber-800'
                      : 'text-slate-500'
                  "
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="
                      (stats?.email.notReceived ?? 0) > 0
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    "
                  ></span>
                  Unsent / Queued
                </span>
                <span
                  class="text-lg font-extrabold tabular-nums mt-0.5"
                  :class="
                    (stats?.email.notReceived ?? 0) > 0
                      ? 'text-amber-900'
                      : 'text-slate-900'
                  "
                >
                  {{ (stats?.email.notReceived ?? 0).toLocaleString() }}
                </span>
              </button>

              <button
                type="button"
                @click="$emit('filter-status', 'failed')"
                class="flex flex-col p-2.5 rounded-xl border transition-colors text-left cursor-pointer group"
                :class="
                  (stats?.email.failed ?? 0) > 0
                    ? 'border-rose-200 bg-rose-50/40 hover:bg-rose-100/50'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100'
                "
              >
                <span
                  class="text-[11px] font-semibold flex items-center gap-1.5"
                  :class="
                    (stats?.email.failed ?? 0) > 0
                      ? 'text-rose-800'
                      : 'text-slate-500'
                  "
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="
                      (stats?.email.failed ?? 0) > 0
                        ? 'bg-rose-500'
                        : 'bg-slate-400'
                    "
                  ></span>
                  Failed / Bounce
                </span>
                <span
                  class="text-lg font-extrabold tabular-nums mt-0.5"
                  :class="
                    (stats?.email.failed ?? 0) > 0
                      ? 'text-rose-900'
                      : 'text-slate-900'
                  "
                >
                  {{ (stats?.email.failed ?? 0).toLocaleString() }}
                </span>
              </button>
            </div>
          </div>

          <div
            class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400"
          >
            <span>Click any metric to filter list</span>
            <span v-if="stats?.email.unconfirmed" class="text-amber-700 font-medium">
              {{ stats.email.unconfirmed }} unconfirmed &gt;24h
            </span>
          </div>
        </div>

        <!-- ── Cluster 2: Infrastructure & Quota Capacity ── -->
        <div
          class="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between mb-3">
              <span
                class="text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Daily Email Capacity
              </span>
              <span
                class="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full"
              >
                resets {{ resetCountdown }}
              </span>
            </div>

            <!-- Quota meters -->
            <div class="flex flex-col gap-3 my-2">
              <div
                v-for="(q, name) in stats?.quota?.usage || {}"
                :key="name"
                class="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60"
              >
                <div class="flex items-center justify-between mb-1.5">
                  <div class="flex items-center gap-1.5">
                    <span
                      class="text-xs font-bold uppercase tracking-wider text-slate-700"
                    >
                      {{ name }}
                    </span>
                    <span
                      v-if="!q.configured"
                      class="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-200/70 px-1.5 py-0.5 rounded"
                    >
                      no key
                    </span>
                  </div>
                  <span class="text-xs font-mono tabular-nums text-slate-600 font-semibold">
                    {{ q.used }} / {{ q.limit }}
                  </span>
                </div>
                <div class="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :class="
                      q.remaining === 0
                        ? 'bg-rose-500'
                        : (q.used / q.limit) > 0.8
                          ? 'bg-amber-500'
                          : 'bg-indigo-600'
                    "
                    :style="{
                      width: Math.min(100, (q.used / Math.max(1, q.limit)) * 100) + '%',
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Verified Domain Status -->
          <div
            class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs"
          >
            <span class="text-slate-400">Sender domain</span>
            <span
              class="font-mono text-[11px] font-medium px-2 py-0.5 rounded"
              :class="
                senderWarning
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-slate-100 text-slate-700'
              "
            >
              {{ senderSummary || 'Default Provider' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ════════ ACTIONABLE ALERTS (Displayed when attention needed) ════════ -->
    <div
      v-if="stuckWarning"
      class="bg-amber-50/90 border border-amber-300/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 shadow-xs"
    >
      <div class="flex items-start gap-3">
        <span class="text-amber-600 text-lg leading-none mt-0.5">⚠</span>
        <div>
          <h4 class="font-bold text-sm text-amber-950">
            {{ stuckWarning.title }}
          </h4>
          <p class="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
            {{ stuckWarning.body }}
          </p>
        </div>
      </div>
      <button
        type="button"
        @click="$emit('release-stuck')"
        class="shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
      >
        Release & Send Now
      </button>
    </div>

    <div
      v-if="senderWarning"
      class="bg-rose-50/90 border border-rose-300/80 rounded-xl p-4 flex items-start gap-3 text-rose-900 shadow-xs"
    >
      <span class="text-rose-600 text-lg leading-none mt-0.5">⚠</span>
      <div>
        <h4 class="font-bold text-sm text-rose-950">
          {{ senderWarning.title }}
        </h4>
        <p class="text-xs text-rose-800/90 mt-0.5 leading-relaxed">
          {{ senderWarning.body }}
        </p>
      </div>
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
});

defineEmits(['filter-status', 'release-stuck', 'retry-failed']);

const emailScopeLabel = computed(() => {
  if (props.emailView === 'welcome_schedule') {
    return 'Welcome Campaign';
  }
  return 'Meeting Link Dispatch';
});

const weeklyVelocityPercentage = computed(() => {
  if (!props.stats?.totals.registrations) return 0;
  const total = props.stats.totals.registrations;
  const recent = props.stats.totals.registrations_7d || 0;
  return Math.min(100, Math.round((recent / total) * 100));
});

const deliveryRate = computed(() => {
  if (!props.stats?.email) return 100;
  const totalSent = (props.stats.email.sent || 0) + (props.stats.email.delivered || 0);
  const delivered = props.stats.email.delivered || 0;
  if (!totalSent) return 100;
  return Math.round((delivered / totalSent) * 100);
});

const deliveredPercent = computed(() => {
  if (!props.stats?.totals.registrations) return 0;
  const total = props.stats.totals.registrations;
  return Math.min(100, ((props.stats.email.delivered || 0) / total) * 100);
});

const sentPercent = computed(() => {
  if (!props.stats?.totals.registrations) return 0;
  const total = props.stats.totals.registrations;
  return Math.min(100, ((props.stats.email.sent || 0) / total) * 100);
});

const pendingPercent = computed(() => {
  if (!props.stats?.totals.registrations) return 0;
  const total = props.stats.totals.registrations;
  return Math.min(100, ((props.stats.email.notReceived || 0) / total) * 100);
});

const failedPercent = computed(() => {
  if (!props.stats?.totals.registrations) return 0;
  const total = props.stats.totals.registrations;
  return Math.min(100, ((props.stats.email.failed || 0) / total) * 100);
});
</script>
