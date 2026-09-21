<template>
  <div class="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden flex flex-col">
    <!-- ════════ TABLE TOP TOOLBAR: STATUS TABS & DUAL PAGINATION ════════ -->
    <div
      class="p-3 sm:p-4 bg-slate-50/80 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3"
    >
      <!-- 1-Click Segmented Status Tabs (No Dropdown Hunting) -->
      <div class="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          v-for="tab in filterTabs"
          :key="tab.id"
          type="button"
          @click="$emit('update:status-filter', tab.id)"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          :class="
            statusFilter === tab.id
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          "
        >
          <span>{{ tab.label }}</span>
          <span
            v-if="tab.count != null"
            class="text-[10px] font-mono px-1.5 py-0.2 rounded-full font-semibold"
            :class="
              statusFilter === tab.id
                ? 'bg-slate-800 text-slate-200'
                : tab.highlight
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-200 text-slate-600'
            "
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Top Fast Pagination Controls (ZERO SCROLL NEEDED) -->
      <div class="flex items-center gap-3 text-xs">
        <!-- Page size selector -->
        <div class="flex items-center gap-1 text-slate-500 font-medium">
          <span class="hidden sm:inline">Rows:</span>
          <select
            :value="limit"
            @change="$emit('update:limit', Number($event.target.value))"
            class="bg-white border border-slate-200 rounded-md px-1.5 py-1 text-xs font-mono font-semibold text-slate-700 cursor-pointer"
          >
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>

        <!-- Page jump buttons -->
        <div class="flex items-center gap-1 font-mono">
          <span class="text-slate-500 font-semibold mr-1">
            {{ total ? (page - 1) * limit + 1 : 0 }}–{{ Math.min(page * limit, total) }} of {{ total }}
          </span>
          <button
            type="button"
            @click="$emit('change-page', -1)"
            :disabled="page === 1 || loading"
            class="px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed font-bold cursor-pointer transition-colors shadow-2xs"
            title="Previous page"
          >
            ‹
          </button>
          <span class="px-1.5 font-bold text-slate-700">{{ page }} / {{ maxPages || 1 }}</span>
          <button
            type="button"
            @click="$emit('change-page', 1)"
            :disabled="page * limit >= total || loading"
            class="px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed font-bold cursor-pointer transition-colors shadow-2xs"
            title="Next page"
          >
            ›
          </button>
        </div>
      </div>
    </div>

    <!-- Multi-select Batch Action Floating Bar (when rows are selected) -->
    <div
      v-if="selectedIds.length"
      class="bg-indigo-900 text-white px-4 py-2.5 flex items-center justify-between text-xs transition-all shadow-md"
    >
      <div class="flex items-center gap-2">
        <span class="font-bold">{{ selectedIds.length }} attendee{{ selectedIds.length === 1 ? '' : 's' }} selected</span>
        <button
          type="button"
          @click="clearSelection"
          class="text-indigo-200 hover:text-white underline text-[11px] cursor-pointer"
        >
          Deselect all
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="$emit('batch-send', selectedIds)"
          :disabled="batchSending"
          class="bg-white hover:bg-indigo-50 text-indigo-900 font-bold px-3.5 py-1 rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          {{ batchSending ? 'Sending…' : `Send to ${selectedIds.length} Selected` }}
        </button>
      </div>
    </div>

    <!-- ════════ DESKTOP TABLE VIEW (with Sticky Header & Sticky Action Column) ════════ -->
    <div class="hidden md:block overflow-x-auto relative">
      <table class="w-full text-sm text-left border-collapse">
        <thead class="sticky top-0 bg-slate-50/95 z-20 backdrop-blur-xs border-b border-slate-200/80">
          <tr>
            <!-- Select All Checkbox -->
            <th class="px-3 py-3 w-8">
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll"
                class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </th>
            <th
              v-for="h in ['Attendee', 'Email', 'University', 'Registered', 'Email Status']"
              :key="h"
              class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap"
            >
              {{ h }}
            </th>
            <!-- Sticky Action Column Header -->
            <th
              class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap sticky right-0 bg-slate-50/95 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)] text-right"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <!-- Loading Skeletons -->
          <tr v-if="loading" v-for="n in 6" :key="n" class="animate-pulse">
            <td class="px-3 py-3.5"><div class="w-4 h-4 bg-slate-200 rounded"></div></td>
            <td class="px-4 py-3.5"><div class="h-4 bg-slate-200 rounded w-32"></div></td>
            <td class="px-4 py-3.5"><div class="h-3.5 bg-slate-200 rounded w-36"></div></td>
            <td class="px-4 py-3.5"><div class="h-3.5 bg-slate-200 rounded w-24"></div></td>
            <td class="px-4 py-3.5"><div class="h-3.5 bg-slate-200 rounded w-20"></div></td>
            <td class="px-4 py-3.5"><div class="h-5 bg-slate-200 rounded-full w-20"></div></td>
            <td class="px-4 py-3.5 sticky right-0 bg-white"><div class="h-7 bg-slate-200 rounded-lg w-20 ml-auto"></div></td>
          </tr>

          <!-- Empty State -->
          <tr v-else-if="!registrations.length">
            <td colspan="7" class="px-4 py-16 text-center text-slate-400">
              <div class="flex flex-col items-center justify-center gap-1.5">
                <span class="text-2xl">🔍</span>
                <p class="text-sm font-bold text-slate-700">No attendees match this filter</p>
                <p class="text-xs text-slate-400">Try changing status filter tab or search keywords</p>
              </div>
            </td>
          </tr>

          <!-- Rows -->
          <tr
            v-else
            v-for="r in registrations"
            :key="r.id"
            class="hover:bg-slate-50/80 transition-colors group cursor-pointer"
            :class="{ 'bg-indigo-50/30': selectedIds.includes(r.id) }"
            @click="$emit('inspect', r)"
          >
            <!-- Checkbox -->
            <td class="px-3 py-3 w-8" @click.stop>
              <input
                type="checkbox"
                :value="r.id"
                v-model="selectedIds"
                class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </td>

            <!-- Attendee Name -->
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="flex items-center gap-2.5">
                <div
                  class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 select-none bg-slate-900 text-white shadow-2xs"
                >
                  {{ initials(r.full_name) }}
                </div>
                <div>
                  <div class="font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                    {{ r.full_name }}
                  </div>
                  <div v-if="r.phone" class="text-[10px] text-slate-400 font-mono">
                    {{ r.phone }}
                  </div>
                </div>
              </div>
            </td>

            <!-- Email -->
            <td class="px-4 py-3 font-mono text-xs text-slate-600 whitespace-nowrap">
              {{ r.email }}
            </td>

            <!-- University -->
            <td class="px-4 py-3 whitespace-nowrap text-xs text-slate-700">
              {{ r.university || "—" }}
              <span v-if="r.year_of_study" class="text-[10px] text-slate-400 ml-1">
                (Y{{ r.year_of_study }})
              </span>
            </td>

            <!-- Registered Date -->
            <td class="px-4 py-3 text-xs text-slate-400 font-mono tabular-nums whitespace-nowrap">
              {{ shortDate(r.created_at) }}
            </td>

            <!-- Status -->
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="flex items-center gap-1.5">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide"
                  :class="r.is_stuck ? 'bg-amber-100 text-amber-800 border border-amber-300' : statusPillClass(r.email_status)"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="r.is_stuck ? 'bg-amber-500 animate-pulse' : statusDotClass(r.email_status)"
                  ></span>
                  {{ r.is_stuck ? "Stuck" : r.email_status }}
                </span>

                <span
                  v-if="r.email_status === 'processing'"
                  class="text-[10px] font-mono text-slate-400"
                >
                  {{ lockAge(r.locked_at) }}
                </span>
              </div>

              <div
                v-if="r.last_error"
                class="text-[10px] text-rose-600 mt-0.5 max-w-[200px] truncate font-mono"
                :title="r.last_error"
              >
                ⚠ {{ r.last_error }}
              </div>
            </td>

            <!-- ════ STICKY ACTION COLUMN (NEVER GETS PUSHED OFF-SCREEN) ════ -->
            <td
              class="px-4 py-3 whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 transition-colors shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)] text-right"
              @click.stop
            >
              <button
                v-if="r.email_status !== 'delivered'"
                @click="$emit('send-one', r)"
                :disabled="sendingId === r.id || (r.email_status === 'processing' && !r.is_stuck)"
                class="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                :class="
                  r.is_stuck
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                "
              >
                <svg
                  v-if="sendingId === r.id"
                  class="w-3 h-3 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>{{ sendingId === r.id ? "Sending…" : getSendLabel(r) }}</span>
              </button>
              <span v-else class="text-emerald-700 text-xs font-bold inline-flex items-center gap-1">
                ✓ Delivered
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ════════ MOBILE CARDS VIEW (< 768px) ════════ -->
    <div class="md:hidden divide-y divide-slate-100">
      <div
        v-for="r in registrations"
        :key="r.id"
        class="p-4 hover:bg-slate-50 transition-colors flex flex-col gap-2"
        @click="$emit('inspect', r)"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-2.5">
            <div
              class="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0"
            >
              {{ initials(r.full_name) }}
            </div>
            <div>
              <div class="font-bold text-slate-900 text-sm leading-tight">{{ r.full_name }}</div>
              <div class="text-[11px] font-mono text-slate-500">{{ r.email }}</div>
            </div>
          </div>

          <span
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0"
            :class="r.is_stuck ? 'bg-amber-100 text-amber-800' : statusPillClass(r.email_status)"
          >
            {{ r.is_stuck ? 'Stuck' : r.email_status }}
          </span>
        </div>

        <div class="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>{{ r.university || 'No institution' }}</span>
          <span class="font-mono text-[11px] text-slate-400">{{ shortDate(r.created_at) }}</span>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-slate-100 mt-1">
          <span class="text-[11px] text-slate-400">Tap card to inspect</span>
          <button
            v-if="r.email_status !== 'delivered'"
            @click.stop="$emit('send-one', r)"
            :disabled="sendingId === r.id || (r.email_status === 'processing' && !r.is_stuck)"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer disabled:opacity-40"
          >
            {{ sendingId === r.id ? 'Sending…' : getSendLabel(r) }}
          </button>
          <span v-else class="text-emerald-700 text-xs font-bold">✓ Delivered</span>
        </div>
      </div>
    </div>

    <!-- ════════ BOTTOM PAGINATION BAR ════════ -->
    <div
      class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-50/80 border-t border-slate-200/80 text-xs"
    >
      <span class="text-slate-500 font-mono tabular-nums">
        Showing {{ total ? (page - 1) * limit + 1 : 0 }}–{{ Math.min(page * limit, total) }} of {{ total.toLocaleString() }}
      </span>

      <div class="flex items-center gap-1.5 font-mono">
        <button
          @click="$emit('change-page', -1)"
          :disabled="page === 1 || loading"
          class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
        >
          Previous
        </button>
        <span class="px-2 font-bold text-slate-700">Page {{ page }} of {{ maxPages || 1 }}</span>
        <button
          @click="$emit('change-page', 1)"
          :disabled="page * limit >= total || loading"
          class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  registrations: {
    type: Array,
    default: () => [],
  },
  stats: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  page: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 50,
  },
  total: {
    type: Number,
    default: 0,
  },
  statusFilter: {
    type: String,
    default: 'all',
  },
  sendingId: {
    type: [String, Number, null],
    default: null,
  },
  batchSending: {
    type: Boolean,
    default: false,
  },
  emailView: {
    type: String,
    default: 'welcome_schedule',
  },
  shortDate: {
    type: Function,
    required: true,
  },
  lockAge: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits([
  'send-one',
  'batch-send',
  'change-page',
  'update:limit',
  'update:status-filter',
  'inspect',
]);

const selectedIds = ref([]);

const clearSelection = () => {
  selectedIds.value = [];
};

const isAllSelected = computed(() => {
  if (!props.registrations.length) return false;
  return props.registrations.every((r) => selectedIds.value.includes(r.id));
});

const toggleSelectAll = (e) => {
  if (e.target.checked) {
    selectedIds.value = props.registrations.map((r) => r.id);
  } else {
    selectedIds.value = [];
  }
};

const maxPages = computed(() => {
  if (!props.total || !props.limit) return 1;
  return Math.ceil(props.total / props.limit);
});

// 1-Click Status Filter Tabs
const filterTabs = computed(() => {
  const e = props.stats?.email || {};
  return [
    { id: 'all', label: 'All', count: props.stats?.totals.registrations },
    {
      id: 'not_received',
      label: 'Needs Action',
      count: e.notReceived,
      highlight: Boolean(e.notReceived && e.notReceived > 0),
    },
    { id: 'delivered', label: 'Delivered', count: e.delivered },
    { id: 'sent', label: 'In Transit', count: e.sent },
    { id: 'stuck', label: 'Stuck', count: e.stuck, highlight: Boolean(e.stuck && e.stuck > 0) },
    { id: 'failed', label: 'Failed', count: e.failed, highlight: Boolean(e.failed && e.failed > 0) },
  ];
});

const initials = (name) => {
  if (!name) return 'SS';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const statusPillClass = (status) => {
  switch (status) {
    case 'delivered':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200/80';
    case 'sent':
      return 'bg-sky-50 text-sky-700 border border-sky-200/80';
    case 'pending':
    case 'processing':
      return 'bg-slate-100 text-slate-700 border border-slate-200';
    case 'deferred':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'failed':
    case 'bounced':
      return 'bg-rose-50 text-rose-700 border border-rose-200';
    default:
      return 'bg-slate-100 text-slate-500 border border-slate-200';
  }
};

const statusDotClass = (status) => {
  switch (status) {
    case 'delivered':
      return 'bg-emerald-500';
    case 'sent':
      return 'bg-sky-500';
    case 'processing':
      return 'bg-slate-500 animate-pulse';
    case 'deferred':
      return 'bg-amber-500';
    case 'failed':
    case 'bounced':
      return 'bg-rose-500';
    default:
      return 'bg-slate-400';
  }
};

const getSendLabel = (r) => {
  if (r.is_stuck) return 'Release & send';
  if (r.email_status === 'processing') return 'Sending…';
  if (r.email_status === 'sent') return 'Resend';
  return props.emailView === 'welcome_schedule' ? 'Send email' : 'Send link';
};
</script>
