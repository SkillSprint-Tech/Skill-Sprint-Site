<template>
  <div
    class="group bg-white rounded-2xl p-6 sm:p-7 shadow-md border border-gray-100
           transition-all duration-300 hover:shadow-xl hover:scale-[1.03] hover:border-blue-100 cursor-default
           flex flex-col"
    :style="desktopStyle || ''"
  >
    <!-- Avatar -->
    <div v-if="image" class="w-14 h-14 rounded-full overflow-hidden border border-gray-250 shrink-0 mb-4 shadow-sm">
      <img :src="image" :alt="name" class="w-full h-full object-cover animate-fade-in" />
    </div>
    <div
      v-else
      class="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 mb-4"
      :class="avatarClass || 'bg-blue-100 text-blue-600'"
    >
      {{ initials }}
    </div>

    <!-- Name & Role -->
    <h3 class="text-lg font-extrabold text-gray-900 tracking-tight mb-1 group-hover:text-blue-600 transition-colors duration-200">
      {{ name }}
    </h3>
    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
      {{ role }}
    </p>

    <!-- Bio -->
    <p class="text-gray-500 text-sm leading-relaxed mb-5 flex-1">
      {{ bio }}
    </p>

    <!-- Focus Areas -->
    <div class="flex items-center gap-2 pt-4 border-t border-gray-100 flex-wrap">
      <span
        v-for="area in focus"
        :key="area"
        class="bg-blue-50 text-blue-600 text-[11px] font-extrabold px-3 py-1 rounded-full border border-blue-150"
      >
        {{ area }}
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
  avatarClass: { type: String, default: 'bg-blue-100 text-blue-600' },
  desktopStyle: { type: String, default: '' },
  image: { type: String, default: '' }
});
</script>
