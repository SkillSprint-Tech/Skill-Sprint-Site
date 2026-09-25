<template>
  <div v-if="attendee" class="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
    <!-- Backdrop with subtle blur -->
    <div
      class="fixed inset-0 bg-slate-900/25 backdrop-blur-sm transition-opacity"
      @click="$emit('close')"
    ></div>

    <!-- Slide-over panel -->
    <div
      class="relative w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl border-l border-slate-200/80 h-full flex flex-col z-10 overflow-hidden"
    >
      <!-- Header -->
      <div class="p-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-mono font-bold text-xs select-none shadow-md shadow-blue-500/25 border border-blue-400/30"
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
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
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

          <div class="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3 space-y-2 text-xs font-mono">
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
          <div v-if="attendee.last_error" class="mt-2.5 bg-rose-50/80 border border-rose-200 rounded-xl p-3 text-xs">
            <div class="flex items-center justify-between text-rose-900 font-bold mb-1">
              <span class="text-[11px] uppercase tracking-wider font-mono">Failure Error Trace</span>
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
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
            Attendee Background
          </span>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="p-2.5 bg-slate-50/80 border border-slate-200/70 rounded-xl">
              <div class="text-[10px] text-slate-400 font-semibold uppercase font-mono">University</div>
              <div class="font-semibold text-slate-800 mt-0.5 truncate">{{ attendee.university || 'Not specified' }}</div>
            </div>
            <div class="p-2.5 bg-slate-50/80 border border-slate-200/70 rounded-xl">
              <div class="text-[10px] text-slate-400 font-semibold uppercase font-mono">Year of Study</div>
              <div class="font-semibold text-slate-800 mt-0.5">{{ attendee.year_of_study ? `Year ${attendee.year_of_study}` : '—' }}</div>
            </div>
            <div class="p-2.5 bg-slate-50/80 border border-slate-200/70 rounded-xl">
              <div class="text-[10px] text-slate-400 font-semibold uppercase font-mono">Skill Level</div>
              <div class="font-semibold text-slate-800 mt-0.5">{{ attendee.skill_level || '—' }}</div>
            </div>
            <div class="p-2.5 bg-slate-50/80 border border-slate-200/70 rounded-xl">
              <div class="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase font-mono">
                <span>Phone</span>
                <a
                  v-if="cleanPhone"
                  :href="`https://wa.me/${cleanPhone}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold normal-case transition-colors"
                  title="Open WhatsApp chat"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.588-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.288.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.963 1.2 1.002.894 1.848 1.17 2.108 1.299.26.13.413.115.566-.058.153-.174.653-.761.826-1.022.173-.26.347-.217.578-.13.231.087 1.472.694 1.724.82.253.127.42.188.48.289.06.102.06.592-.084.997z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
              <div class="font-mono text-slate-800 mt-0.5 truncate">{{ attendee.phone || '—' }}</div>
            </div>
          </div>

          <div v-if="attendee.interests && attendee.interests.length" class="pt-1">
            <div class="text-[10px] text-slate-400 font-semibold uppercase font-mono mb-1">Focus Interests</div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="int in attendee.interests"
                :key="int"
                class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60 font-mono"
              >
                {{ int }}
              </span>
            </div>
          </div>

          <!-- Internal Organizer Notes & Tags -->
          <div class="bg-amber-50/40 border border-amber-200/70 rounded-2xl p-3.5 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold uppercase tracking-wider text-amber-800 font-mono flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Internal Organizer Notes & Tags
              </span>
              <span v-if="notesSaved" class="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                ✓ Saved
              </span>
            </div>

            <!-- Tags -->
            <div class="space-y-1.5">
              <div class="text-[10px] text-slate-500 font-medium uppercase font-mono">Tags</div>
              <div class="flex flex-wrap gap-1.5 min-h-[26px]">
                <span
                  v-for="(tag, idx) in localTags"
                  :key="tag"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-100 text-amber-900 border border-amber-200/80 font-mono shadow-2xs"
                >
                  {{ tag }}
                  <button
                    type="button"
                    @click="removeTag(idx)"
                    class="text-amber-700 hover:text-amber-900 font-bold ml-0.5 cursor-pointer leading-none"
                    title="Remove tag"
                  >
                    ×
                  </button>
                </span>
                <span v-if="!localTags.length" class="text-xs text-slate-400 italic">No tags assigned</span>
              </div>

              <!-- Quick preset tag pills -->
              <div class="pt-1 flex items-center gap-1 flex-wrap">
                <span class="text-[10px] text-slate-400 mr-1">Add:</span>
                <button
                  v-for="preset in presetTags"
                  :key="preset"
                  type="button"
                  @click="addPresetTag(preset)"
                  :disabled="localTags.includes(preset)"
                  class="px-2 py-0.5 text-[10px] rounded border font-mono transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  :class="localTags.includes(preset) ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-white border-amber-300 text-amber-800 hover:bg-amber-100/60'"
                >
                  + {{ preset }}
                </button>
              </div>

              <!-- Custom tag input -->
              <div class="pt-1 flex items-center gap-1.5">
                <input
                  v-model="newTagInput"
                  @keydown.enter.prevent="addCustomTag"
                  type="text"
                  placeholder="New tag..."
                  class="flex-1 px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
                <button
                  type="button"
                  @click="addCustomTag"
                  class="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-2xs"
                >
                  Add
                </button>
              </div>
            </div>

            <!-- Notes Textarea -->
            <div class="space-y-1 pt-1">
              <label class="text-[10px] text-slate-500 font-medium uppercase font-mono block">Private Organizer Note</label>
              <textarea
                v-model="localNotes"
                rows="2"
                placeholder="e.g. VIP guest, requested front row, needs loaner laptop..."
                class="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800 transition-all placeholder:text-slate-400 font-sans"
              ></textarea>
            </div>

            <div class="flex justify-end pt-1">
              <button
                type="button"
                @click="saveNotesAndTags"
                :disabled="isSavingNotes"
                class="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs shadow-amber-500/20 cursor-pointer disabled:opacity-50 transition-all active:scale-[0.98] flex items-center gap-1.5"
              >
                <span v-if="isSavingNotes" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{{ isSavingNotes ? 'Saving...' : 'Save Notes & Tags' }}</span>
              </button>
            </div>
          </div>

          <!-- Per-Workshop Live Attendance Tracker -->
          <div class="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-4 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider">
                  Workshop Attendance
                </div>
                <div class="text-xs font-semibold text-slate-800 mt-0.5 flex items-center gap-2">
                  <span>{{ attendedCount }} of {{ workshops.length }} Attended</span>
                  <span
                    class="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold"
                    :class="attendedCount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'"
                  >
                    {{ workshops.length ? Math.round((attendedCount / workshops.length) * 100) : 0 }}%
                  </span>
                </div>
              </div>
            </div>

            <!-- Visual Progress Bar -->
            <div class="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
              <div
                class="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                :style="{ width: `${workshops.length ? (attendedCount / workshops.length) * 100 : 0}%` }"
              ></div>
            </div>

            <!-- Dynamic Workshop Checklist (Depends on actual number of workshops) -->
            <div v-if="workshops.length" class="space-y-2 pt-1">
              <div
                v-for="(w, idx) in workshops"
                :key="w.id"
                class="bg-white border rounded-xl p-3 flex items-center justify-between gap-3 transition-colors shadow-2xs"
                :class="isWorkshopCheckedIn(w.id) ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200/80'"
              >
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span
                      class="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded"
                      :class="isWorkshopCheckedIn(w.id) ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'"
                    >
                      #{{ idx + 1 }}
                    </span>
                    <span class="text-xs font-semibold text-slate-900 truncate">
                      {{ w.title }}
                    </span>
                    <span
                      class="text-[9px] font-mono px-1.5 py-0.2 rounded uppercase tracking-wider font-semibold"
                      :class="{
                        'bg-emerald-100 text-emerald-800': w.status === 'live',
                        'bg-blue-50 text-blue-700': w.status === 'upcoming',
                        'bg-slate-100 text-slate-500': w.status === 'completed',
                        'bg-rose-50 text-rose-700': w.status === 'cancelled',
                      }"
                    >
                      {{ w.status }}
                    </span>
                  </div>

                  <div class="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                    <span v-if="w.speaker" class="truncate">{{ w.speaker }}</span>
                    <span v-if="getCheckinTimestamp(w.id)" class="text-emerald-700 font-mono text-[10px] font-medium shrink-0">
                      ✓ Checked in {{ shortDate(getCheckinTimestamp(w.id)) }}
                    </span>
                    <span v-else class="text-slate-400 text-[10px] shrink-0">Not checked in</span>
                  </div>
                </div>

                <button
                  type="button"
                  @click="$emit('toggle-attended', { attendee, workshopId: w.id, targetStatus: !isWorkshopCheckedIn(w.id) })"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 shadow-2xs active:scale-[0.98]"
                  :class="isWorkshopCheckedIn(w.id)
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'"
                >
                  {{ isWorkshopCheckedIn(w.id) ? 'Cancel' : 'Check In' }}
                </button>
              </div>
            </div>
            <div v-else class="text-xs text-slate-400 italic py-2 text-center">
              No workshops published yet.
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
          class="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all shadow-xs shadow-blue-500/20 cursor-pointer disabled:opacity-40 active:scale-[0.98]"
          :class="
            attendee.email_status === 'delivered'
              ? 'bg-blue-600 hover:bg-blue-700'
              : attendee.is_stuck
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-blue-600 hover:bg-blue-700'
          "
        >
          {{ sendingId === attendee.id ? 'Sending…' : attendee.email_status === 'delivered' ? 'Resend Email' : 'Send Email Now' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  attendee: {
    type: Object,
    default: null,
  },
  workshops: {
    type: Array,
    default: () => [],
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

const emit = defineEmits(['close', 'send-one', 'toggle-attended', 'update-notes']);

const presetTags = ['VIP', 'Volunteer', 'Walk-in', 'Speaker Guest', 'Needs Laptop', 'Core Team'];
const localNotes = ref('');
const localTags = ref([]);
const newTagInput = ref('');
const isSavingNotes = ref(false);
const notesSaved = ref(false);

watch(
  () => props.attendee,
  (att) => {
    if (att) {
      localNotes.value = att.admin_notes || '';
      localTags.value = Array.isArray(att.tags) ? [...att.tags] : [];
    } else {
      localNotes.value = '';
      localTags.value = [];
    }
  },
  { immediate: true }
);

const cleanPhone = computed(() => {
  if (!props.attendee?.phone) return null;
  const digits = String(props.attendee.phone).replace(/[^0-9]/g, '');
  return digits.length >= 7 ? digits : null;
});

const addPresetTag = (tag) => {
  if (!localTags.value.includes(tag)) {
    localTags.value.push(tag);
  }
};

const addCustomTag = () => {
  const val = newTagInput.value.trim();
  if (val && !localTags.value.includes(val)) {
    localTags.value.push(val);
    newTagInput.value = '';
  }
};

const removeTag = (idx) => {
  localTags.value.splice(idx, 1);
};

const saveNotesAndTags = async () => {
  if (!props.attendee?.id) return;
  isSavingNotes.value = true;
  try {
    emit('update-notes', {
      id: props.attendee.id,
      admin_notes: localNotes.value,
      tags: localTags.value,
    });
    notesSaved.value = true;
    setTimeout(() => (notesSaved.value = false), 2500);
  } finally {
    isSavingNotes.value = false;
  }
};

const isWorkshopCheckedIn = (workshopId) => {
  if (!props.attendee?.checkins) return false;
  return props.attendee.checkins.some((c) => c.workshop_id === workshopId);
};

const getCheckinTimestamp = (workshopId) => {
  if (!props.attendee?.checkins) return null;
  const match = props.attendee.checkins.find((c) => c.workshop_id === workshopId);
  return match?.checked_in_at || null;
};

const attendedCount = computed(() => {
  if (!props.attendee?.checkins) return 0;
  return props.attendee.checkins.length;
});

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
