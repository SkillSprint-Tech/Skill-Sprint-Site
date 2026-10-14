<template>
  <div
    ref="cardRef"
    class="sprint-card group bg-white rounded-3xl p-7 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-slate-100/90
           transition-all duration-300 hover:shadow-[0_25px_60px_rgba(37,99,235,0.14)] hover:border-blue-200 cursor-default select-none
           flex flex-col justify-between relative overflow-hidden"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <!-- Background subtle gradient shine -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

    <div class="relative z-10">
      <!-- Header: Status badge & Icon -->
      <div class="flex items-center justify-between mb-5">
        <div class="bg-gradient-to-tr from-blue-600 to-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 text-white">
          <span class="text-xl">{{ icon }}</span>
        </div>
        <StatusBadge :status="status" />
      </div>

      <!-- Label -->
      <p class="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-2">{{ label }}</p>

      <!-- Title -->
      <h3 class="text-xl font-extrabold text-gray-900 mb-3 leading-snug tracking-tight group-hover:text-blue-600 transition-colors duration-200">
        {{ title }}
      </h3>

      <!-- Description -->
      <p class="text-gray-500 text-sm leading-relaxed mb-6 font-normal">
        {{ description }}
      </p>
    </div>

    <!-- Duration & Tech -->
    <div class="relative z-10 pt-4 border-t border-slate-100">
      <div v-if="duration" class="text-[11px] font-mono font-bold text-blue-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
        <i class="fa-regular fa-clock text-xs"></i>
        {{ duration }}
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <span
          v-for="tech in techStack"
          :key="tech"
          class="bg-blue-50/80 text-blue-600 text-[11px] font-mono font-bold px-3 py-1 rounded-full border border-blue-100 hover:bg-blue-600 hover:text-white transition-colors"
        >
          {{ tech }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatusBadge from './StatusBadge.vue';
import { hasFinePointer } from '../motion/intro';

defineProps({
  icon: { type: String, default: '🚀' },
  label: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  duration: { type: String, default: '' },
  techStack: { type: Array, default: () => [] }
});

const cardRef = ref(null)

const onPointerMove = (e) => {
  if (!cardRef.value || !hasFinePointer()) return
  const rect = cardRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  cardRef.value.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`
}

const onPointerLeave = () => {
  if (cardRef.value) {
    cardRef.value.style.transform = ''
  }
}
</script>

<style scoped>
.sprint-card {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
  will-change: transform;
}
</style>
