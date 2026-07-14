<template>
  <section class="bg-[#0B101B] py-16 sm:py-20 md:py-28 px-4 sm:px-6 overflow-hidden">

    <!-- Heading -->
    <div class="max-w-3xl mx-auto text-center mb-14 md:mb-20 reveal-hidden">
      <h2 class="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3">
        Why Skill Sprint Exists?
      </h2>
      <p class="text-gray-400 text-base sm:text-lg font-medium">
        Students said this. We didn't make it up.
      </p>
    </div>

    <!-- Cards – fanned on desktop, stacked on mobile -->
    <div class="relative max-w-4xl mx-auto">

      <!-- Mobile: simple vertical stack -->
      <div class="flex flex-col gap-5 md:hidden w-full break-words whitespace-normal">
        <div
          v-for="(card, i) in cards"
          :key="card.label"
          class="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm mx-auto reveal-hidden"
          :class="[`reveal-delay-${i + 1}`]"
        >
          <div class="bg-blue-600 w-11 h-11 rounded-xl flex items-center justify-center mb-5 shadow-md">
            <span class="text-lg brightness-[6] grayscale contrast-[0.9] sepia-[2]">{{ card.icon }}</span>
          </div>
          <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">{{ card.label }}</p>
          <h3 class="text-lg font-bold text-gray-900 mb-4 leading-snug">{{ card.heading }}</h3>
          <span class="inline-block bg-blue-50 text-blue-600 text-xs font-extrabold px-3 py-1.5 rounded-full border border-blue-100">
            {{ card.tag }}
          </span>
        </div>
      </div>

      <!-- Desktop: fanned/overlapping layout -->
      <div class="hidden md:flex justify-center items-end gap-0 h-[380px] relative">
        <div
          v-for="(card, i) in cards"
          :key="card.label"
          class="absolute bg-white rounded-2xl p-6 shadow-2xl flex flex-col transition-all duration-500 hover:z-30 hover:scale-105 reveal-hidden"
          :class="[`reveal-delay-${i + 1}`]"
          :style="card.desktopStyle"
        >
          <div class="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-lg">
            <span class="text-xl brightness-[6] grayscale contrast-[0.9] sepia-[2]">{{ card.icon }}</span>
          </div>
          <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">{{ card.label }}</p>
          <h3 class="text-xl font-bold text-gray-900 mb-auto leading-snug">{{ card.heading }}</h3>
          <span class="mt-5 inline-block bg-blue-50 text-blue-600 text-sm font-extrabold px-4 py-1.5 rounded-full border border-blue-100">
            {{ card.tag }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const cards = [
  {
    icon: '👥',
    label: 'Community-driven learning',
    heading: 'You learn with people who are also confused but motivated.',
    tag: 'No solo grind',
    desktopStyle: 'width:260px; min-height:300px; top:20px; left:50%; transform:translateX(-430px) rotate(5deg); z-index:10;',
  },
  {
    icon: '🧩',
    label: 'Multi-disciplinary sprints',
    heading: 'Tech. Marketing. Business. Design.',
    tag: 'Mix skills, make magic',
    desktopStyle: 'width:280px; min-height:280px; top:0; left:50%; transform:translateX(-50%) rotate(-4deg); z-index:20;',
  },
  {
    icon: '🤝',
    label: 'Free & Open',
    heading: 'No paywalls. No secret handshakes.',
    tag: 'yes, actually free',
    desktopStyle: 'width:260px; min-height:270px; top:30px; left:50%; transform:translateX(110px) rotate(5deg); z-index:10;',
  },
]
</script>