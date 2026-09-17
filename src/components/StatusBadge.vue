<template>
  <span
    class="inline-flex items-center gap-1.5 font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full border"
    :class="statusClasses"
  >
    <span v-if="pulses" class="w-1.5 h-1.5 rounded-full animate-pulse" :class="dotClass"></span>
    {{ status }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

// Keyed by the label so existing callers ('Active', 'Completed') keep working, with the
// workshop lifecycle states added for /workshops.
const TONES = {
  Active:      { classes: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', dot: 'bg-emerald-500', pulse: true },
  'Live now':  { classes: 'bg-red-500/10 text-red-500 border-red-500/20',             dot: 'bg-red-500',     pulse: true },
  Upcoming:    { classes: 'bg-blue-500/10 text-blue-600 border-blue-500/20',          dot: 'bg-blue-500',    pulse: false },
  Completed:   { classes: 'bg-slate-500/10 text-slate-400 border-slate-500/20',       dot: 'bg-slate-400',   pulse: false },
  Cancelled:   { classes: 'bg-red-500/10 text-red-400 border-red-500/20',             dot: 'bg-red-400',     pulse: false },
};

const FALLBACK = { classes: 'bg-slate-500/10 text-slate-400 border-slate-500/20', dot: 'bg-slate-400', pulse: false };

const props = defineProps({
  status: {
    type: String,
    required: true,
    // Inlined rather than derived from TONES: defineProps is hoisted out of setup(),
    // so it cannot reference anything declared in this block.
    validator: (value) =>
      ['Active', 'Live now', 'Upcoming', 'Completed', 'Cancelled'].includes(value)
  }
});

const tone = computed(() => TONES[props.status] || FALLBACK);
const statusClasses = computed(() => tone.value.classes);
const dotClass = computed(() => tone.value.dot);
const pulses = computed(() => tone.value.pulse);
</script>
