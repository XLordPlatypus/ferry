<template>
  <v-footer
      class="pa-4"
      color="surface"
      height="280"
      rounded="0"
  >
    <v-container>
      <v-row align="center" justify="center">
        <v-col class="text-center" cols="12">
          <v-img
              alt="APALA Ferry Logo"
              class="mx-auto mb-2"
              height="48"
              src="/icon-logo.svg"
              width="48"
          ></v-img>
        </v-col>
      </v-row>

      <v-row align="center" justify="center">
        <v-col class="text-center" cols="12">
          <v-tooltip
              v-for="(link, i) in links"
              :key="i"
              :text="link.name"
              location="top"
              open-delay="500"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                  :aria-label="link.name"
                  :href="link.url"
                  class="mx-2"
                  target="_blank"
                  v-bind="props"
                  variant="text"
              >
                <v-icon :icon="link.icon" size="large"></v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </v-col>
      </v-row>

      <v-row align="center" justify="center">
        <v-col class="text-center" cols="12">
          <div class="text-body-2">
            &copy; {{ new Date().getFullYear() }} - APALA Ferry<sup>&reg;</sup>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script lang="ts" setup>
import {ref} from 'vue';

interface Link {
  name: string;
  url: string;
  icon: string;
}

const links = ref<Link[]>([
  {
    name: 'GitHub Francesco070',
    url: 'https://github.com/Francesco070',
    icon: 'mdi-github',
  },
  {
    name: 'GitHub XLordPlatypus',
    url: 'https://github.com/XLordPlatypus',
    icon: 'mdi-github',
  },
  {
    name: 'GitLab Repository (APALA Repo)',
    url: 'https://codevogel.ch/mo-2024/fr25/apala/ferry/-/tree/main?ref_type=heads',
    icon: 'mdi-gitlab',
  },
]);
</script>
