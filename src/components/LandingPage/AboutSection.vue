<template>
  <section class="w-full bg-[#F8FAFC] py-10 md:py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

      <!-- Mobile: stacked card; Desktop: side-by-side -->
      <div class="bg-white rounded-2xl md:rounded-3xl shadow-md overflow-hidden">
        <div class="flex flex-col md:flex-row">

          <!-- Robot Image Block -->
          <div class="bg-blue-600 flex items-center justify-center p-8 md:p-10 md:w-[280px] lg:w-[340px] flex-shrink-0">
            <img
              src="/logo.png"
              alt="Skill Sprint Robot Mascot"
              class="w-36 sm:w-44 md:w-52 h-auto object-contain"
            />
          </div>

          <!-- Text Block -->
          <div class="flex-1 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
            <div>
              <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                So… What's Skill Sprint?
              </h2>
              <p class="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                Skill Sprint is a
                <span
                  class="text-blue-600 font-extrabold border-b-2 border-blue-500 px-0.5"
                  style="font-family: 'Handlee', cursive;"
                >STUDENT-POWERED</span>
                community that brings learners together to explore new skills, collaborate on sprints,
                and build meaningful projects. Here, learning meets action in a community-driven environment.
              </p>

              <!-- Arrow (desktop only) -->
              <div class="hidden md:flex justify-end mb-2">
                <img src="/arrow.png" alt="" aria-hidden="true" class="w-16 opacity-60 -rotate-12" />
              </div>
            </div>

            <!-- Brand Logos -->
            <div class="border-t border-gray-100 pt-5 mt-4">
              <p class="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center md:text-left">
                Proud Collaborations
              </p>
              <div class="flex flex-wrap items-center gap-4 sm:gap-6 justify-center md:justify-start opacity-60">
                <img v-for="(logo, i) in logos" :key="i" :src="logo.src" :alt="logo.alt"
                     class="h-5 sm:h-6 md:h-7 w-auto object-contain" loading="lazy" />
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
const logos = [
  { src: '/FoF Lhr.png', alt: 'FoF Lahore' },
  { src: '/IxDF.png', alt: 'Interaction Design Foundation' },
  { src: '/GDG Cloud Lhr.jpg.jpeg', alt: 'GDG Cloud Lahore' },
  { src: '/AWS Cloud Clubs.png', alt: 'AWS Cloud Clubs' },
  { src: '/Superior University Logo.svg', alt: 'Superior University' },
]
</script>