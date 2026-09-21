<template>
  <div class="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
    <!-- Desktop Table View (hidden on mobile, visible on sm/md and up) -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead>
          <tr class="bg-slate-50/80 border-b border-slate-200/80">
            <th
              v-for="h in [
                'Attendee',
                'Email',
                'University & Year',
                'Registered',
                'Email Status',
                'Action',
              ]"
              :key="h"
              class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap"
            >
              {{ h }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <!-- Loading Skeletons -->
          <tr v-if="loading" v-for="n in 6" :key="n" class="animate-pulse">
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-slate-200 shrink-0"></div>
                <div class="h-4 bg-slate-200 rounded w-28"></div>
              </div>
            </td>
            <td class="px-4 py-3.5"><div class="h-3.5 bg-slate-200 rounded w-36"></div></td>
            <td class="px-4 py-3.5"><div class="h-3.5 bg-slate-200 rounded w-24"></div></td>
            <td class="px-4 py-3.5"><div class="h-3.5 bg-slate-200 rounded w-20"></div></td>
            <td class="px-4 py-3.5"><div class="h-6 bg-slate-200 rounded-full w-20"></div></td>
            <td class="px-4 py-3.5"><div class="h-7 bg-slate-200 rounded-lg w-20"></div></td>
          </tr>

          <!-- Empty State -->
          <tr v-else-if="!registrations.length">
            <td colspan="6" class="px-4 py-14 text-center text-slate-400">
              <div class="flex flex-col items-center justify-center gap-2">
                <span class="text-3xl">🔍</span>
                <p class="text-sm font-medium text-slate-600">
                  {{
                    hasFilters
                      ? "No attendees match that specific filter or search term."
                      : "No registrations recorded yet."
                  }}
                </p>
                <p v-if="hasFilters" class="text-xs text-slate-400">
                  Try adjusting the search query or clearing the status filter.
                </p>
              </div>
            </td>
          </tr>

          <!-- Data Rows -->
          <tr
            v-else
            v-for="r in registrations"
            :key="r.id"
            class="hover:bg-slate-50/70 transition-colors duration-150 group"
          >
            <!-- Attendee Name & Initials -->
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="flex items-center gap-2.5">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-xs"
                  :class="avatarColor(r.full_name)"
                >
                  {{ initials(r.full_name) }}
                </div>
                <div>
                  <div class="font-bold text-slate-900 leading-tight">
                    {{ r.full_name }}
                  </div>
                  <div v-if="r.phone" class="text-[11px] text-slate-400 font-mono">
                    {{ r.phone }}
                  </div>
                </div>
              </div>
            </td>

            <!-- Email -->
            <td class="px-4 py-3 font-mono text-xs text-slate-600 whitespace-nowrap">
              {{ r.email }}
            </td>

            <!-- University & Year -->
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="text-xs text-slate-700 font-medium">
                {{ r.university || "—" }}
              </div>
              <div v-if="r.year_of_study" class="text-[10px] text-slate-400">
                Year {{ r.year_of_study }}
              </div>
            </td>

            <!-- Registered Date -->
            <td class="px-4 py-3 text-xs text-slate-400 font-mono tabular-nums whitespace-nowrap">
              {{ shortDate(r.created_at) }}
            </td>

            <!-- Email Status -->
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="flex items-center gap-1.5">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-2xs"
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
                  class="text-[10px] font-mono"
                  :class="r.is_stuck ? 'text-amber-700 font-bold' : 'text-slate-400'"
                >
                  {{ lockAge(r.locked_at) }}
                </span>

                <span
                  v-if="r.provider"
                  class="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded"
                >
                  {{ r.provider }}
                </span>
              </div>

              <!-- Error details if any -->
              <div
                v-if="r.last_error"
                class="text-[11px] text-rose-600 mt-1 max-w-xs truncate font-mono"
                :title="r.last_error"
              >
                ⚠ {{ r.last_error }}
              </div>
            </td>

            <!-- Action Button -->
            <td class="px-4 py-3 whitespace-nowrap">
              <button
                v-if="r.email_status !== 'delivered'"
                @click="$emit('send-one', r)"
                :disabled="sendingId === r.id || (r.email_status === 'processing' && !r.is_stuck)"
                class="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                :class="
                  r.is_stuck
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60'
                "
              >
                <svg
                  v-if="sendingId === r.id"
                  class="w-3.5 h-3.5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>{{ sendingId === r.id ? "Sending…" : getSendLabel(r) }}</span>
              </button>
              <span v-else class="text-emerald-600 text-xs font-semibold flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Delivered
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View (< 768px) - Eliminates Horizontally-Cut Tables -->
    <div class="md:hidden divide-y divide-slate-100">
      <div v-if="loading" v-for="n in 4" :key="n" class="p-4 animate-pulse">
        <div class="flex items-center justify-between mb-2">
          <div class="h-4 bg-slate-200 rounded w-32"></div>
          <div class="h-5 bg-slate-200 rounded-full w-16"></div>
        </div>
        <div class="h-3 bg-slate-200 rounded w-48 mb-2"></div>
        <div class="h-3 bg-slate-200 rounded w-28"></div>
      </div>

      <div v-else-if="!registrations.length" class="p-8 text-center text-slate-400">
        <span class="text-3xl block mb-2">🔍</span>
        <p class="text-sm font-medium text-slate-600">No attendees found</p>
      </div>

      <div
        v-else
        v-for="r in registrations"
        :key="r.id"
        class="p-4 hover:bg-slate-50/70 transition-colors"
      >
        <div class="flex items-start justify-between gap-2 mb-1.5">
          <div class="flex items-center gap-2">
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 select-none shadow-xs"
              :class="avatarColor(r.full_name)"
            >
              {{ initials(r.full_name) }}
            </div>
            <div>
              <span class="font-bold text-slate-900 text-sm block leading-tight">
                {{ r.full_name }}
              </span>
              <span class="text-[11px] text-slate-500 font-mono">
                {{ r.email }}
              </span>
            </div>
          </div>

          <span
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0"
            :class="r.is_stuck ? 'bg-amber-100 text-amber-800' : statusPillClass(r.email_status)"
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="r.is_stuck ? 'bg-amber-500' : statusDotClass(r.email_status)"
            ></span>
            {{ r.is_stuck ? 'Stuck' : r.email_status }}
          </span>
        </div>

        <div class="flex items-center justify-between text-xs text-slate-500 my-2 pt-2 border-t border-slate-50">
          <span>{{ r.university || 'No university' }}</span>
          <span class="font-mono text-[11px] text-slate-400">{{ shortDate(r.created_at) }}</span>
        </div>

        <div v-if="r.last_error" class="text-[11px] text-rose-600 mb-2 font-mono truncate">
          ⚠ {{ r.last_error }}
        </div>

        <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
          <span v-if="r.provider" class="text-[10px] font-mono text-slate-400">
            via {{ r.provider }}
          </span>
          <span v-else></span>

          <button
            v-if="r.email_status !== 'delivered'"
            @click="$emit('send-one', r)"
            :disabled="sendingId === r.id || (r.email_status === 'processing' && !r.is_stuck)"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            :class="
              r.is_stuck
                ? 'bg-amber-600 text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            "
          >
            {{ sendingId === r.id ? 'Sending…' : getSendLabel(r) }}
          </button>
          <span v-else class="text-emerald-600 text-xs font-semibold">
            ✓ Delivered
          </span>
        </div>
      </div>
    </div>

    <!-- ════════ PAGINATION FOOTER ════════ -->
    <div
      class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-50/80 border-t border-slate-200/80 text-xs"
    >
      <span class="text-slate-500 font-medium tabular-nums">
        Showing
        <strong class="text-slate-700">{{ total ? (page - 1) * limit + 1 : 0 }}</strong>
        to
        <strong class="text-slate-700">{{ Math.min(page * limit, total) }}</strong>
        of
        <strong class="text-slate-900">{{ total.toLocaleString() }}</strong>
        attendees
      </span>

      <div class="flex items-center gap-1.5">
        <button
          @click="$emit('change-page', -1)"
          :disabled="page === 1 || loading"
          class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Previous
        </button>
        <span class="px-2 font-mono text-slate-500 font-semibold">
          Page {{ page }}
        </span>
        <button
          @click="$emit('change-page', 1)"
          :disabled="page * limit >= total || loading"
          class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  registrations: {
    type: Array,
    default: () => [],
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
  sendingId: {
    type: [String, Number, null],
    default: null,
  },
  emailView: {
    type: String,
    default: 'welcome_schedule',
  },
  hasFilters: {
    type: Boolean,
    default: false,
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

defineEmits(['send-one', 'change-page']);

const initials = (name) => {
  if (!name) return 'SS';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const avatarColor = (name) => {
  const colors = [
    'bg-indigo-100 text-indigo-700',
    'bg-blue-100 text-blue-700',
    'bg-emerald-100 text-emerald-700',
    'bg-violet-100 text-violet-700',
    'bg-amber-100 text-amber-800',
    'bg-teal-100 text-teal-700',
  ];
  let sum = 0;
  for (let i = 0; i < (name || '').length; i++) {
    sum += name.charCodeAt(i);
  }
  return colors[sum % colors.length];
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
    case 'not_queued':
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
    case 'pending':
    case 'not_queued':
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
