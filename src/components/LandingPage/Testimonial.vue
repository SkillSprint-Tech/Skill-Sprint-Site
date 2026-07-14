<template>
  <section class="bg-[#F8FAFC] py-16 sm:py-20 md:py-28 px-4 sm:px-6 overflow-hidden">

    <!-- Heading -->
    <div class="max-w-3xl mx-auto text-center mb-12 md:mb-20 relative">
      <h2 class="text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3">
        Student Receipts
      </h2>
      <p class="text-gray-500 text-base sm:text-lg font-medium">
        Students said this. We didn't make it up.
      </p>
      <!-- Arrow decoration (md+) -->
      <img
        src="/rightarrow.png"
        alt=""
        aria-hidden="true"
        class="hidden md:block absolute left-[20%] top-[80%] w-24 opacity-80 -rotate-12 pointer-events-none"
      />
    </div>

    <!-- Mobile: simple card list -->
    <div class="flex flex-col gap-4 max-w-sm mx-auto md:hidden w-full px-4">
      <div
        v-for="(t, i) in testimonials"
        :key="i"
        class="bg-white border border-gray-100 shadow-md p-6 rounded-2xl w-full"
      >
        <p class="text-gray-600 text-[15px] leading-relaxed mb-5 italic">
          "{{ t.quote }}"
        </p>
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
            :class="t.avatarClass"
          >
            {{ t.initials }}
          </div>
          <span class="text-sm font-bold text-gray-900">{{ t.name }}</span>
        </div>
      </div>
    </div>

    <!-- Tablet/Desktop: scattered/fanned layout -->
    <div class="hidden md:block relative max-w-4xl mx-auto h-[580px] lg:h-[520px]">
      <div
        v-for="(t, i) in testimonials"
        :key="i"
        class="absolute bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.07)] p-7 rounded-[1.75rem]
               transition-all duration-300 hover:scale-105 hover:z-50 hover:shadow-xl cursor-default"
        :style="t.desktopStyle"
      >
        <p class="text-gray-600 text-[14px] leading-relaxed mb-5 italic">
          "{{ t.quote }}"
        </p>
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
            :class="t.avatarClass"
          >
            {{ t.initials }}
          </div>
          <span class="text-sm font-bold text-gray-900">{{ t.name }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  {
    quote: 'This course made consistency feel realistic. Instead of guessing every time, I now follow a process that actually fits my routine.',
    name: 'Jordan P.',
    initials: 'JP',
    avatarClass: 'bg-blue-100 text-blue-600',
    desktopStyle: 'width:280px; top:30px; left:0; z-index:20; transform:rotate(-6deg);',
  },
  {
    quote: 'I finally understand what to post and why it works. Tokko gave me structure without making content feel forced or overwhelming.',
    name: 'Alex R.',
    initials: 'AR',
    avatarClass: 'bg-indigo-100 text-indigo-600',
    desktopStyle: 'width:310px; top:0; left:280px; z-index:30; transform:rotate(2deg);',
  },
  {
    quote: 'They helped me stop overthinking content and start posting with confidence. Everything feels simpler and easier to stick with.',
    name: 'Sofia K.',
    initials: 'SK',
    avatarClass: 'bg-pink-100 text-pink-600',
    desktopStyle: 'width:280px; top:25px; right:0; z-index:20; transform:rotate(6deg);',
  },
  {
    quote: 'Tokko gave me clarity. I don\'t waste time guessing what to post anymore, and that alone made a huge difference for me.',
    name: 'Lena M.',
    initials: 'LM',
    avatarClass: 'bg-green-100 text-green-600',
    desktopStyle: 'width:285px; bottom:20px; left:50px; z-index:15; transform:rotate(-3deg);',
  },
  {
    quote: 'The biggest change for me was confidence. I know what I\'m doing now, and my content reflects that in a much more consistent way.',
    name: 'Emily T.',
    initials: 'ET',
    avatarClass: 'bg-orange-100 text-orange-600',
    desktopStyle: 'width:285px; bottom:20px; right:60px; z-index:15; transform:rotate(3deg);',
  },
]
</script>