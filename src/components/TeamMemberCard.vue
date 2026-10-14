<template>
  <div
    class="group bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-slate-150/80
           transition-all duration-300 hover:shadow-[0_25px_60px_rgba(37,99,235,0.18)] hover:border-blue-300 hover:-translate-y-1.5 cursor-default
           flex flex-col relative overflow-hidden"
    :style="desktopStyle || ''"
  >
    <!-- Background highlight sheen on hover -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-indigo-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

    <!-- Avatar & Status Ring -->
    <div class="flex items-center justify-between mb-5 relative z-10">
      <div v-if="image" class="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md ring-2 ring-blue-100 shrink-0">
        <img :src="image" :alt="name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>
      <div
        v-else
        class="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-md ring-2 ring-blue-50 transition-transform duration-300 group-hover:scale-105"
        :class="avatarClass || 'bg-blue-600 text-white'"
      >
        {{ initials }}
      </div>

      <!-- Live Core Node Beacon -->
      <span class="inline-flex items-center gap-1.5 bg-blue-50/80 text-blue-600 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-blue-150">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:animate-ping"></span>
        CORE
      </span>
    </div>

    <!-- Name & Role -->
    <div class="relative z-10">
      <h3 class="text-xl font-black text-gray-900 tracking-tight mb-1 group-hover:text-blue-600 transition-colors duration-200">
        {{ name }}
      </h3>
      <p class="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-3">
        {{ role }}
      </p>

      <!-- Bio -->
      <p class="text-gray-500 text-sm leading-relaxed mb-6 flex-1 font-normal">
        {{ bio }}
      </p>
    </div>

    <!-- Focus Areas -->
    <div class="flex items-center gap-2 pt-4 border-t border-slate-100 flex-wrap relative z-10 mt-auto">
      <span
        v-for="area in focus"
        :key="area"
        class="bg-slate-50 group-hover:bg-blue-50/80 text-slate-700 group-hover:text-blue-600 text-[11px] font-mono font-bold px-3 py-1 rounded-full border border-slate-200/80 group-hover:border-blue-200 transition-colors duration-200"
      >
        #{{ area }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
  initials: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  focus: { type: Array, default: () => [] },
  avatarClass: { type: String, default: 'bg-blue-600 text-white' },
  desktopStyle: { type: String, default: '' },
  image: { type: String, default: '' }
});
</script>
