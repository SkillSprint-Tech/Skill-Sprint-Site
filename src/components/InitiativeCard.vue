<template>
  <div
    class="group bg-white rounded-2xl p-6 shadow-md border border-gray-100
           transition-all duration-300 hover:shadow-xl hover:scale-[1.03] hover:border-blue-100 cursor-default"
  >
    <!-- Header: Tag + Status -->
    <div class="flex items-center justify-between mb-4">
      <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ tag }}</span>
      <StatusBadge :status="status" />
    </div>

    <!-- Title -->
    <h3 class="text-lg sm:text-xl font-extrabold text-gray-900 mb-3 leading-snug tracking-tight group-hover:text-blue-600 transition-colors duration-200">
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="text-gray-500 text-sm leading-relaxed mb-6">
      {{ description }}
    </p>

    <!-- Tech Stack Pills -->
    <div class="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100">
      <span
        v-for="tech in techStack"
        :key="tech"
        class="bg-blue-50 text-blue-600 text-[11px] font-extrabold px-3 py-1 rounded-full border border-blue-100"
      >
        {{ tech }}
      </span>
    </div>
  </div>
</template>

<script setup>
import StatusBadge from './StatusBadge.vue';

defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tag: { type: String, required: true },
  status: { type: String, required: true },
  techStack: { type: Array, default: () => [] }
});
</script>
