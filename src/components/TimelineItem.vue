<template>
  <div class="timeline-item relative flex gap-6 pb-12 last:pb-0">
    <!-- Dot + Line -->
    <div class="flex flex-col items-center flex-shrink-0">
      <div
        class="w-4 h-4 rounded-full border-[3px] border-blue-600 bg-white z-10 timeline-dot"
      ></div>
      <div v-if="!isLast" class="w-0.5 flex-1 bg-gray-200 mt-1 timeline-line"></div>
    </div>

    <!-- Content Card -->
    <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-gray-100 flex-1 -mt-1
                transition-all duration-300 hover:shadow-xl hover:border-blue-100">
      <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">{{ year }}</span>
      <h3 class="text-lg font-extrabold text-gray-900 tracking-tight mt-1 mb-2">{{ title }}</h3>
      <p class="text-gray-500 text-sm leading-relaxed">{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  isLast: { type: Boolean, default: false }
});
</script>
