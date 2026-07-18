<template>
  <span 
    class="inline-flex items-center gap-1.5 font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full border"
    :class="statusClasses"
  >
    <span v-if="status === 'Active'" class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
    {{ status }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['Active', 'Completed'].includes(value)
  }
});

const statusClasses = computed(() => {
  return props.status === 'Active'
    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    : 'bg-slate-500/10 text-slate-400 border-slate-500/20';
});
</script>
