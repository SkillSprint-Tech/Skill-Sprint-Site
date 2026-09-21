<template>
  <div v-if="attendee" class="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
    <!-- Backdrop with subtle blur -->
    <div
      class="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
      @click="$emit('close')"
    ></div>

    <!-- Slide-over panel -->
    <div
      class="relative w-full max-w-md bg-white shadow-2xl border-l border-slate-200 h-full flex flex-col z-10 overflow-hidden"
    >
      <!-- Header -->
      <div class="p-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-xs select-none shadow-xs"
          >
            {{ initials(attendee.full_name) }}
          </div>
          <div>
            <h3 class="font-bold text-slate-900 text-sm leading-snug">
              {{ attendee.full_name }}
            </h3>
            <p class="text-xs text-slate-500 font-mono">{{ attendee.email }}</p>
          </div>
        </div>
        <button
          type="button"
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          title="Close drawer"
        >
          <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4l8 8m0-8l-8 8" />
          </svg>
        </button>
      </div>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto p-4 divide-y divide-slate-100 space-y-4">
        <!-- Email Status & Diagnostic Section -->
        <div class="pb-1">
          <div class="flex items-center justify-between mb-2.5">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Email Dispatch State
            </span>
            <span
              class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wide border"
              :class="statusPillClass(attendee.email_status)"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(attendee.email_status)"></span>
              {{ attendee.is_stuck ? 'Stuck' : attendee.email_status }}
            </span>
          </div>

          <div class="bg-slate-50 border border-slate-200/80 rounded-lg p-3 space-y-2 text-xs font-mono">
            <div class="flex justify-between">
              <span class="text-slate-400 font-sans">Provider:</span>
              <span class="font-semibold text-slate-800">{{ attendee.provider || 'Not dispatched' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400 font-sans">Attempts:</span>
              <span class="text-slate-800">{{ attendee.attempts || 0 }}</span>
            </div>
            <div v-if="attendee.locked_at" class="flex justify-between">
              <span class="text-slate-400 font-sans">Worker Lock:</span>
              <span class="text-slate-800">{{ shortDate(attendee.locked_at) }}</span>
            </div>
            <div v-if="attendee.sent_at" class="flex justify-between">
              <span class="text-slate-400 font-sans">Sent At:</span>
              <span class="text-slate-800">{{ shortDate(attendee.sent_at) }}</span>
            </div>
            <div v-if="attendee.delivered_at" class="flex justify-between">
              <span class="text-slate-400 font-sans">Delivered At:</span>
              <span class="text-emerald-700 font-semibold">{{ shortDate(attendee.delivered_at) }}</span>
            </div>
          </div>

          <!-- Error trace if any -->
          <div v-if="attendee.last_error" class="mt-2.5 bg-rose-50/80 border border-rose-200 rounded-lg p-3 text-xs">
            <div class="flex items-center justify-between text-rose-900 font-bold mb-1">
              <span class="text-[11px] uppercase tracking-wider">Failure Error Trace</span>
              <button
                type="button"
                @click="copyError(attendee.last_error)"
                class="text-[10px] text-rose-700 hover:text-rose-900 underline font-mono cursor-pointer"
              >
                {{ copied ? 'Copied' : 'Copy error' }}
              </button>
            </div>
            <p class="font-mono text-[11px] text-rose-800 break-words whitespace-pre-wrap leading-relaxed">
              {{ attendee.last_error }}
            </p>
          </div>
        </div>

        <!-- Academic & Background Details -->
        <div class="pt-3 space-y-3">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Attendee Background
          </span>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
              <div class="text-[10px] text-slate-400 font-semibold uppercase">University</div>
              <div class="font-semibold text-slate-800 mt-0.5 truncate">{{ attendee.university || 'Not specified' }}</div>
            </div>
            <div class="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
              <div class="text-[10px] text-slate-400 font-semibold uppercase">Year of Study</div>
              <div class="font-semibold text-slate-800 mt-0.5">{{ attendee.year_of_study ? `Year ${attendee.year_of_study}` : '—' }}</div>
            </div>
            <div class="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
              <div class="text-[10px] text-slate-400 font-semibold uppercase">Skill Level</div>
              <div class="font-semibold text-slate-800 mt-0.5">{{ attendee.skill_level || '—' }}</div>
            </div>
            <div class="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
              <div class="text-[10px] text-slate-400 font-semibold uppercase">Phone Number</div>
              <div class="font-mono text-slate-800 mt-0.5">{{ attendee.phone || '—' }}</div>
            </div>
          </div>

          <div v-if="attendee.interests && attendee.interests.length" class="pt-1">
            <div class="text-[10px] text-slate-400 font-semibold uppercase mb-1">Focus Interests</div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="int in attendee.interests"
                :key="int"
                class="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60"
              >
                {{ int }}
              </span>
            </div>
          </div>

          <div class="pt-2 text-[10px] text-slate-400 font-mono">
            ID: {{ attendee.id }}<br />
            Registered: {{ shortDate(attendee.created_at) }}
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="p-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-2">
        <button
          type="button"
          @click="$emit('close')"
          class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white cursor-pointer transition-colors"
        >
          Close
        </button>

        <button
          type="button"
          @click="$emit('send-one', attendee)"
          :disabled="sendingId === attendee.id || (attendee.email_status === 'processing' && !attendee.is_stuck)"
          class="px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all shadow-2xs cursor-pointer disabled:opacity-40 active:scale-[0.98]"
          :class="
            attendee.email_status === 'delivered'
              ? 'bg-slate-900 hover:bg-slate-800'
              : attendee.is_stuck
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-slate-900 hover:bg-slate-800'
          "
        >
          {{ sendingId === attendee.id ? 'Sending…' : attendee.email_status === 'delivered' ? 'Resend Email' : 'Send Email Now' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  attendee: {
    type: Object,
    default: null,
  },
  sendingId: {
    type: [String, Number, null],
    default: null,
  },
  shortDate: {
    type: Function,
    required: true,
  },
});

defineEmits(['close', 'send-one']);

const copied = ref(false);

const copyError = (text) => {
  if (!text) return;
  navigator.clipboard.writeText(text);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2500);
};

const initials = (name) => {
  if (!name) return 'SS';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const statusPillClass = (status) => {
  switch (status) {
    case 'delivered':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    case 'sent':
      return 'bg-sky-50 text-sky-700 border-sky-200/80';
    case 'pending':
    case 'processing':
      return 'bg-slate-50 text-slate-700 border-slate-200';
    case 'deferred':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'failed':
    case 'bounced':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-50 text-slate-500 border-slate-200';
  }
};

const statusDotClass = (status) => {
  switch (status) {
    case 'delivered':
      return 'bg-emerald-500 ring-2 ring-emerald-500/20';
    case 'sent':
      return 'bg-sky-500 ring-2 ring-sky-500/20';
    case 'processing':
      return 'bg-slate-500 ring-2 ring-slate-500/20 animate-pulse';
    case 'deferred':
      return 'bg-amber-500 ring-2 ring-amber-500/20';
    case 'failed':
    case 'bounced':
      return 'bg-rose-500 ring-2 ring-rose-500/20';
    default:
      return 'bg-slate-400 ring-2 ring-slate-400/20';
  }
};
</script>
