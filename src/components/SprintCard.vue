<template>
  <div
    class="group bg-white rounded-2xl p-6 shadow-md border border-gray-100
           transition-all duration-300 hover:shadow-xl hover:scale-[1.03] hover:border-blue-100 cursor-default
           flex flex-col"
  >
    <!-- Header: Status badge -->
    <div class="flex items-center justify-between mb-4">
      <div class="bg-blue-600 w-11 h-11 rounded-xl flex items-center justify-center shadow-md">
        <span class="text-lg brightness-[6] grayscale contrast-[0.9] sepia-[2]">{{ icon }}</span>
      </div>
      <StatusBadge :status="status" />
    </div>

    <!-- Label -->
    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{{ label }}</p>

    <!-- Title -->
    <h3 class="text-lg sm:text-xl font-extrabold text-gray-900 mb-3 leading-snug tracking-tight group-hover:text-blue-600 transition-colors duration-200">
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="text-gray-500 text-sm leading-relaxed mb-5 flex-1">
      {{ description }}
    </p>

    <!-- Duration & Tech -->
    <div class="pt-4 border-t border-gray-100">
      <div v-if="duration" class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
        {{ duration }}
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <span
          v-for="tech in techStack"
          :key="tech"
          class="bg-blue-50 text-blue-600 text-[11px] font-extrabold px-3 py-1 rounded-full border border-blue-100"
        >
          {{ tech }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import StatusBadge from './StatusBadge.vue';

defineProps({
  icon: { type: String, default: '🚀' },
  label: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  duration: { type: String, default: '' },
  techStack: { type: Array, default: () => [] }
});
</script>
