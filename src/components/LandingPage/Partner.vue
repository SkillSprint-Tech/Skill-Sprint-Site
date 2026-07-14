<template>
  <!-- Partner CTA — matches Figma gradient + robot overlap -->
  <section class="relative w-full bg-gradient-to-b from-[#F8FAFC] via-[#dceeff] to-[#b8d4f0] py-16 sm:py-20 overflow-hidden">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">

      <!-- Card -->
      <div class="relative bg-white rounded-3xl shadow-lg px-6 sm:px-10 py-12 sm:py-16 text-center overflow-hidden">

        <!-- Robot image — right side, partially clipped on mobile -->
        <div class="absolute right-0 bottom-0 pointer-events-none select-none" aria-hidden="true">
          <img
            src="/sidelogo.png"
            alt=""
            class="w-32 sm:w-48 md:w-64 h-auto object-contain opacity-90"
            style="transform: rotate(-15deg) translate(20%, 15%);"
          />
        </div>

        <!-- Content -->
        <div class="relative z-10">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug">
            Partner with
            <span class="text-blue-600 relative inline-block ml-1">
              Skill Sprint
              <span class="absolute left-0 -bottom-1 w-full h-[2px] bg-blue-500 rotate-[-2deg]"></span>
              <span class="absolute left-0 -bottom-[6px] w-[85%] h-[2px] bg-blue-400 rotate-[-2deg]"></span>
            </span>
          </h2>

          <p class="text-gray-500 mt-3 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
            Collaborate with us to empower students globally.
          </p>

          <div class="flex flex-wrap gap-3 sm:gap-4 justify-center items-center">
            <button
              class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold
                     px-8 py-3 rounded-full text-sm transition-all duration-200 shadow-md shadow-blue-200"
              aria-label="Join the Sprint"
            >
              Join the Sprint
            </button>
            <button
              class="w-full sm:w-auto bg-white border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600
                     text-gray-700 font-semibold px-8 py-3 rounded-full text-sm transition-all duration-200"
              aria-label="Contact us"
            >
              Contact us
            </button>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>