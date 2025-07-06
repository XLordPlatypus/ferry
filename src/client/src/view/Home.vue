<template>
  <v-row>
    <v-col>
      <v-row class="mb-8 scroll-fade">
        <v-spacer v-if="!$vuetify.display.mobile"></v-spacer>
        <v-col cols="12" sm="12" lg="10" xl="9">
          <v-card
              :image="getBackground"
              :style="{ transform: `translateY(${y * 0.3}px)` }"
              class="parallax-card position-relative"
              :min-height="$vuetify.display.mobile ? '500px' : '700px'"
          >
            <div class="overlay"></div>
            <div class="hero-content-wrapper">
              <div class="text-center">
                <v-card-title :class="$vuetify.display.mobile ? 'text-h4 font-weight-bold text-wrap text-center text-light' : 'text-h2 font-weight-bold text-wrap text-center text-light'">
                  Apala Luxury Sea Travel
                </v-card-title>
                <v-card-title :class="$vuetify.display.mobile ? 'text-body-1 text-wrap text-center text-light px-4' : 'text-h6 text-wrap text-center text-light'">
                  Schnell, sicher, überall – Experience a completely new dimension of
                  water transportation with our extraordinary ferry.
                </v-card-title>
                <v-card-text class="text-center">
                  <v-btn class="my-10 pt-6 pb-9" color="primary" elevation="4" size="large" to="/trips">Book Your
                    Journey
                  </v-btn>
                </v-card-text>
              </div>
            </div>

            <div class="scroll-indicator">
              <v-icon class="animate-bounce" color="white" :size="$vuetify.display.mobile ? 'default' : 'large'">mdi-chevron-down</v-icon>
            </div>
          </v-card>
        </v-col>
        <v-spacer v-if="!$vuetify.display.mobile"></v-spacer>
      </v-row>

      <v-row class="scroll-fade">
        <v-col>
          <v-card :class="$vuetify.display.mobile ? 'px-2 pb-6' : 'px-6 pb-8'">
            <v-card-title :class="$vuetify.display.mobile ? 'text-h4 text-center mb-6' : 'text-h3 text-center mb-8'">Why Choose US</v-card-title>
            <v-row>
              <v-col v-for="item in whyCooseUS" :key="item.title" class="scroll-fade" cols="12" sm="6" md="4">
                <v-card :class="$vuetify.display.mobile ? 'py-6' : 'py-10'" class="hover-shadow" color="background" :height="$vuetify.display.mobile ? '200px' : '250px'">
                  <v-card-title>
                    <v-icon color="primary">{{ item.icon }}</v-icon>
                  </v-card-title>
                  <v-card-title :class="$vuetify.display.mobile ? 'text-subtitle-1 font-weight-bold mb-2' : 'text-h6 font-weight-bold mb-4'">{{ item.title }}</v-card-title>
                  <v-card-text :class="$vuetify.display.mobile ? 'text-body-2' : 'text-wrap'">{{ item.text }}</v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="scroll-fade">
        <v-col>
          <v-card :class="$vuetify.display.mobile ? 'px-2 pb-8' : 'px-6 pb-16'" color="background">
            <v-card-title :class="$vuetify.display.mobile ? 'text-h4 text-center mb-6' : 'text-h3 text-center mb-8'">Popular Routes</v-card-title>

            <v-row>
              <template v-if="loading || limitedTopRoutes.length === 0">
                <v-col
                    v-for="n in 3"
                    :key="'skeleton-' + n"
                    class="scroll-fade"
                    cols="12"
                    sm="6"
                    md="4"
                >
                  <v-card :class="$vuetify.display.mobile ? 'pb-4 hover-shadow' : 'pb-6 mx-lg-4 hover-shadow'" color="surface" :height="$vuetify.display.mobile ? '350px' : '400px'">
                    <v-skeleton-loader
                        :type="['image', 'heading', 'text', 'text']"
                        class="h-100"
                    />
                  </v-card>
                </v-col>
              </template>

              <template v-else>
                <v-col
                    v-for="item in limitedTopRoutes"
                    cols="12"
                    sm="6"
                    md="4"
                >
                  <v-card :to="'/trips/' + item._id" :class="$vuetify.display.mobile ? 'pb-4 hover-shadow' : 'pb-6 mx-lg-4 hover-shadow'" color="surface" :height="$vuetify.display.mobile ? '350px' : '400px'">
                    <v-img :src="getImage(item.route.to_destination)" class="mb-4" cover :height="$vuetify.display.mobile ? '150px' : '200px'"
                           rounded="0"/>

                    <v-card-title :class="$vuetify.display.mobile ? 'text-subtitle-1 font-weight-bold text-wrap px-2' : 'text-h6 font-weight-bold text-wrap'">
                      {{ item.route.from_destination + " → " + item.route.to_destination }}
                    </v-card-title>

                    <v-card-subtitle :class="$vuetify.display.mobile ? 'text-wrap mb-2 px-2' : 'text-wrap mb-4'">{{ item.route.subtitle }}</v-card-subtitle>

                    <v-card-text :class="$vuetify.display.mobile ? 'text-subtitle-1 font-weight-bold text-primary px-2' : 'text-wrap text-h6 font-weight-bold text-primary'">
                      {{ "From " + item.minPrice + "€" }}
                    </v-card-text>
                  </v-card>
                </v-col>
              </template>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import {computed, inject, onMounted, ref} from 'vue';
import {useFetch, useScroll} from '@vueuse/core';

// const theme = useTheme();
// const isDarkMode = computed(() => theme.global.name.value === 'dark');

const whyCooseUS = ref([
  {
    icon: 'mdi-ship-wheel',
    title: 'Premium Fleet',
    text: 'Modern vessels equipped with all amenities for a comfortable journey across the seas.',
  },
  {
    icon: 'mdi-map-marker-path',
    title: 'Strategic Routes',
    text: 'Connecting major European cities with efficient and direct sea routes.',
  },
  {
    icon: 'mdi-headset',
    title: '24/7 Support',
    text: 'Round-the-clock customer service to assist you with any queries or concerns.',
  },
]);

const {y} = useScroll(window);
const revealElements = ref<NodeListOf<Element>>();

onMounted(() => {
  revealElements.value = document.querySelectorAll('.scroll-fade');
  handleScrollFade();
  window.addEventListener('scroll', handleScrollFade);
});

function handleScrollFade() {
  if (!revealElements.value) return;

  revealElements.value.forEach((el) => {
    const top = (el as HTMLElement).getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (top < windowHeight * 0.85) {
      (el as HTMLElement).classList.add('visible');
    }
  });
}

const url = inject<string>('apiUrl') + "/trip"
const {isFetching: loading, data: topRoutes} = useFetch(url, {immediate: true}).get().json();
const limitedTopRoutes = computed(() => topRoutes?.value?.slice(0, 3) ?? []);

const getImage = (destination: string) => {
  switch (destination) {
    case 'Hirtshals':
      return '/destinations/Hirtshals.png';
    case 'Kristiansand':
      return '/destinations/Kristiansand.png';
    case 'Lavrik':
      return '/destinations/Lavrik.png';
    default:
      return 'https://placehold.co/600x400';
  }
}

const getBackground = computed(() => {
  const images = [
    '/hintergrund-ferry-original.png',
    '/hintergrund-ferry-wald.png',
    '/hintergrund-ferry-wueste.png',
    '/hintergrund-ferry-wueste-darkmode.png',
  ];

  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
});
</script>

<style scoped>
.scroll-fade {
  opacity: 0;
  transform: translateY(60px);
  transition: opacity 0.9s ease, transform 0.9s ease;
}

.scroll-fade.visible {
  opacity: 1;
  transform: translateY(0);
}

.parallax-card {
  transition: transform 0.2s ease-out;
  overflow: hidden;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.hover-shadow {
  transition: box-shadow 0.5s ease, transform 0.3s ease;
}

.hover-shadow:hover {
  box-shadow: 2px 0 40px 7px rgba(203, 166, 247, 0.74) !important;
  transform: scale(1.03);
}

.hero-content-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  padding: 1rem;
  position: relative;
  z-index: 2;
}

@media (min-width: 960px) {
  .hero-content-wrapper {
    min-height: 700px;
    padding: 2rem;
  }
}

.text-light {
  color: white !important;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
}

.scroll-indicator {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0.7;
  z-index: 5;
}

@media (min-width: 960px) {
  .scroll-indicator {
    bottom: 30px;
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}
</style>