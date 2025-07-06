<template>
  <v-app-bar class="mt-8" color="transparent" height="80" sticky>
    <v-row no-gutters>
      <v-spacer></v-spacer>
      <v-col cols="12" md="10">
        <v-sheet
            :border="isScrolled ? 'primary lg' : '0'"
            :color="isScrolled ? 'surface' : 'background'"
            class="d-flex align-center px-2"
            style="transition: background-color, border ease-out 0.2s;"
        >
          <!-- Logo -->
          <v-toolbar-title class="flex-shrink-0">
            <router-link style="text-decoration: none" to="/">
              <v-img
                  :src="isDarkMode ? '/dark-mode-logo.png' : '/light-mode-logo.png'"
                  alt="Logo"
                  contain
                  :max-height="$vuetify.display.xs ? '50' : '70'"
                  :max-width="$vuetify.display.xs ? '180' : '250'"
              ></v-img>
            </router-link>
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <!-- Desktop Navigation -->
          <div v-if="$vuetify.display.mdAndUp" class="d-flex align-center">
            <v-btn class="mx-1" to="/trips">Routes</v-btn>
            <v-btn v-if="isAuthenticated" to="/mybookings" class="mx-1">My Bookings</v-btn>

            <v-tooltip v-if="isAuthenticated" location="bottom" open-delay="500">
              <template v-slot:activator="{ props }">
                <v-btn class="mx-1" icon="mdi-cog" v-bind="props" to="/AccountSettings"></v-btn>
              </template>
              <span>Settings</span>
            </v-tooltip>

            <v-tooltip location="bottom" open-delay="500">
              <template v-slot:activator="{ props }">
                <v-btn
                    :icon="isDarkMode ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
                    class="mx-1"
                    v-bind="props"
                    @click="toggleDarkMode"
                ></v-btn>
              </template>
              <span>{{ isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</span>
            </v-tooltip>

            <template v-if="!isAuthenticated">
              <v-btn class="mx-1" color="primary" to="/signup">SIGNUP</v-btn>
              <v-btn class="mx-1" color="primary" to="/login">LOGIN</v-btn>
            </template>
            <template v-else>
              <v-tooltip location="bottom" open-delay="500">
                <template v-slot:activator="{ props }">
                  <v-btn class="mx-1" color="primary" icon="mdi-logout" v-bind="props" @click="logout"></v-btn>
                </template>
                <span>Logout</span>
              </v-tooltip>
            </template>
          </div>

          <!-- Mobile Navigation -->
          <div v-else class="d-flex align-center">
            <!-- Theme Toggle for Mobile -->
            <v-btn
                :icon="isDarkMode ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
                size="small"
                variant="text"
                @click="toggleDarkMode"
            ></v-btn>

            <!-- Mobile Menu -->
            <v-menu location="bottom end" offset="8">
              <template #activator="{ props }">
                <v-btn icon="mdi-menu" v-bind="props" size="small"></v-btn>
              </template>
              <v-list min-width="200">
                <v-list-item to="/trips" prepend-icon="mdi-map-marker-path">
                  <v-list-item-title>Routes</v-list-item-title>
                </v-list-item>

                <v-list-item v-if="isAuthenticated" to="/mybookings" prepend-icon="mdi-bookmark">
                  <v-list-item-title>My Bookings</v-list-item-title>
                </v-list-item>

                <v-list-item to="/AccountSettings" v-if="isAuthenticated" prepend-icon="mdi-cog">
                  <v-list-item-title>Settings</v-list-item-title>
                </v-list-item>

                <v-divider v-if="!isAuthenticated"></v-divider>

                <template v-if="!isAuthenticated">
                  <v-list-item to="/signup" prepend-icon="mdi-account-plus">
                    <v-list-item-title>Sign Up</v-list-item-title>
                  </v-list-item>
                  <v-list-item to="/login" prepend-icon="mdi-login">
                    <v-list-item-title>Login</v-list-item-title>
                  </v-list-item>
                </template>

                <template v-else>
                  <v-divider></v-divider>
                  <v-list-item @click="logout" prepend-icon="mdi-logout">
                    <v-list-item-title>Logout</v-list-item-title>
                  </v-list-item>
                </template>
              </v-list>
            </v-menu>
          </div>
        </v-sheet>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-app-bar>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue';
import {useTheme} from 'vuetify';
import {useScroll} from '@vueuse/core';
import {useAuth} from "../stores/authStore.ts";
import {storeToRefs} from "pinia";
import {useRouter} from 'vue-router';

const theme = useTheme();
const isDarkMode = ref(false);
const router = useRouter();

const {y} = useScroll(window);
const isScrolled = ref(false);

const auth = useAuth();
const {logout: authLogout} = useAuth();
const {isAuthenticated} = storeToRefs(auth);

const logout = async () => {
  try {
    await authLogout();

    await router.push('/');

    window.location.reload();
  } catch (error) {
    await router.push('/');
    window.location.reload();
  }
};

watch(y, (val) => {
  isScrolled.value = val >= 50;
});

onMounted(() => {
  const storedTheme = localStorage.getItem('theme');

  if (storedTheme) {
    isDarkMode.value = storedTheme === 'dark';
  } else {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  theme.global.name.value = isDarkMode.value ? 'dark' : 'light';

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      isDarkMode.value = e.matches;
      theme.global.name.value = isDarkMode.value ? 'dark' : 'light';
    }
  });
});

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  theme.global.name.value = isDarkMode.value ? 'dark' : 'light';

  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};
</script>