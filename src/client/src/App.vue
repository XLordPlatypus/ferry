<template>
  <v-app>
    <Header/>
    <v-main class="my-16">
      <v-container>
        <v-layout>
          <router-view/>
        </v-layout>
      </v-container>
    </v-main>
    <CustomSnackBar/>
    <Footer v-if="showFooter"/>
  </v-app>
</template>

<script lang="ts" setup>
import {useRoute} from 'vue-router';
import {computed} from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import CustomSnackBar from "./components/CustomSnackBar.vue";

const route = useRoute();
const showFooter = computed(() => {
  return route.meta.footer !== false;
});
</script>
