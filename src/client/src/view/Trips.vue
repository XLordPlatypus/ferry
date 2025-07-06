<template>
  <v-row>
    <v-col class="pb-10">
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="12" xl="10" xxl="8">
          <h1 :class="$vuetify.display.mobile ? 'text-h4 text-center mb-4' : ''">Find Your Route</h1>
          <v-card :class="$vuetify.display.mobile ? 'mt-6' : 'mt-10'">
            <v-card-text :class="$vuetify.display.mobile ? 'px-4' : ''">
              <v-row>
                <v-col cols="12" :md="$vuetify.display.mobile ? 12 : 4">
                  <v-text-field
                      v-model="searchQuery"
                      clearable
                      label="Search destinations"
                      prepend-inner-icon="mdi-magnify"
                      :density="$vuetify.display.mobile ? 'comfortable' : 'default'"
                      @input="filterTrips"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" :md="$vuetify.display.mobile ? 12 : 4">
                  <v-text-field
                      v-model="startDate"
                      clearable
                      label="From date"
                      prepend-inner-icon="mdi-calendar-start"
                      type="date"
                      :density="$vuetify.display.mobile ? 'comfortable' : 'default'"
                      @input="filterTrips"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" :md="$vuetify.display.mobile ? 12 : 4">
                  <v-select
                      v-model="selectedRoute"
                      :items="availableRoutes"
                      clearable
                      label="Route"
                      prepend-inner-icon="mdi-map-marker-path"
                      :density="$vuetify.display.mobile ? 'comfortable' : 'default'"
                      @update:model-value="filterTrips"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" :md="$vuetify.display.mobile ? 12 : 6">
                  <v-slider
                      v-model="priceRange"
                      :max="maxPrice"
                      :min="0"
                      :step="10"
                      label="Price range (€)"
                      thumb-label="always"
                      @update:model-value="filterTrips"
                  >
                    <template v-slot:append>
                      <div :class="$vuetify.display.mobile ? 'text-caption ml-2' : 'text-caption'">Up to {{ priceRange }}€</div>
                    </template>
                  </v-slider>
                </v-col>

                <v-col cols="12" :md="$vuetify.display.mobile ? 12 : 6">
                  <v-slider
                      v-model="maxDuration"
                      :max="48"
                      :min="1"
                      :step="1"
                      label="Max duration (hours)"
                      thumb-label="always"
                      @update:model-value="filterTrips"
                  >
                    <template v-slot:append>
                      <div :class="$vuetify.display.mobile ? 'text-caption ml-2' : 'text-caption'">{{ maxDuration }} hours</div>
                    </template>
                  </v-slider>
                </v-col>
              </v-row>

              <v-row>
                <v-col :class="$vuetify.display.mobile ? 'd-flex flex-column gap-2' : 'd-flex justify-end'">
                  <v-btn
                      :class="$vuetify.display.mobile ? 'mb-2' : 'mr-2'"
                      color="secondary"
                      variant="outlined"
                      :block="$vuetify.display.mobile"
                      @click="resetFilters"
                  >
                    Reset Filters
                  </v-btn>
                  <v-btn
                      color="primary"
                      :block="$vuetify.display.mobile"
                      @click="filterTrips"
                  >
                    Apply Filters
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>

      <v-row v-if="loading" :class="$vuetify.display.mobile ? 'mt-8' : 'mt-16'">
        <v-col class="text-center">
          <v-progress-circular
              color="primary"
              indeterminate
          ></v-progress-circular>
        </v-col>
      </v-row>

      <!-- No results message -->
      <v-row v-if="!loading && filteredTrips.length === 0" :class="$vuetify.display.mobile ? 'mt-8' : 'mt-16'">
        <v-col class="text-center">
          <v-alert class="mx-auto" :max-width="$vuetify.display.mobile ? '100%' : '500'" type="info">
            No trips found matching your search criteria. Try adjusting your filters.
          </v-alert>
        </v-col>
      </v-row>

      <v-row v-for="trip in filteredTrips" :key="trip._id" :class="$vuetify.display.mobile ? 'mt-6' : 'mt-10'">
        <v-spacer v-if="!$vuetify.display.mobile"></v-spacer>
        <v-col :class="$vuetify.display.mobile ? 'px-4' : 'px-12'" cols="12" xl="10" xxl="8">
          <v-card class="hover-shadow">
            <v-row :no-gutters="$vuetify.display.mobile">
              <v-col cols="12" :lg="$vuetify.display.mobile ? 12 : 4">
                <v-img :src="getImage(trip.route.to_destination)" cover :height="$vuetify.display.mobile ? '150px' : '200px'"
                       rounded="0"/>
              </v-col>
              <v-col cols="12" :lg="$vuetify.display.mobile ? 12 : 4" :sm="$vuetify.display.mobile ? 12 : 6">
                <v-card-text :class="$vuetify.display.mobile ? 'pb-2' : ''">
                  <div :class="$vuetify.display.mobile ? 'text-subtitle-1 font-weight-bold' : 'text-h6 font-weight-bold'">
                    {{ trip.route.from_destination }}
                    <v-icon :class="$vuetify.display.mobile ? 'mx-1' : 'mx-2'" :size="$vuetify.display.mobile ? 'small' : 'default'">mdi-arrow-right</v-icon>
                    {{ trip.route.to_destination }}
                  </div>
                  <p :class="$vuetify.display.mobile ? 'font-weight-light text-body-2 mb-2' : 'font-weight-light'">{{ trip.route.subtitle }}</p>
                  <p :class="$vuetify.display.mobile ? 'text-primary mt-2 text-body-2' : 'text-primary mt-4'">
                    <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                    {{ formatDate(trip.departure_time) + " - " + formatDate(trip.arrival_time) }}
                  </p>
                </v-card-text>
              </v-col>
              <v-col :class="$vuetify.display.mobile ? 'text-start' : 'text-end'" cols="12" :lg="$vuetify.display.mobile ? 12 : 4" :sm="$vuetify.display.mobile ? 12 : 6">
                <v-card-text :class="$vuetify.display.mobile ? 'text-primary pt-2' : 'text-primary'">
                  <div :class="$vuetify.display.mobile ? 'text-subtitle-1 font-weight-bold' : 'text-h6 font-weight-bold'">
                    {{ "From " + trip.minPrice + "€" }}
                  </div>
                </v-card-text>
                <v-card-subtitle :class="$vuetify.display.mobile ? 'text-body-2' : ''">
                  <v-icon size="small" class="mr-1">mdi-clock</v-icon>
                  {{
                    calculateDuration(trip.departure_time, trip.arrival_time)
                  }}
                </v-card-subtitle>
                <v-card-text :class="$vuetify.display.mobile ? 'pt-2' : ''">
                  <v-btn
                      :to="'/trips/' + trip._id"
                      color="primary"
                      :block="$vuetify.display.mobile"
                      :size="$vuetify.display.mobile ? 'default' : 'default'"
                  >
                    Book Now
                  </v-btn>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-spacer v-if="!$vuetify.display.mobile"></v-spacer>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import {computed, inject, ref, watch} from "vue";
import {useFetch} from "@vueuse/core";
import type {Trip} from "../utils/Interfaces.ts";

const url = inject<string>('apiUrl') + "/trip";
const {isFetching: loading, data: rawData} = useFetch<Trip[]>(url, {immediate: true}).get().json();

const searchQuery = ref<string>('');
const startDate = ref<string>('');
const selectedRoute = ref<string | null>(null);
const priceRange = ref<number>(1000);
const maxDuration = ref<number>(24);
const filteredTrips = ref<Trip[]>([]);

const availableRoutes = computed<string[]>(() => {
  if (!rawData.value) return [];

  const routes = new Set<string>();
  rawData.value.forEach((trip: Trip) => {
    routes.add(`${trip.route.from_destination} to ${trip.route.to_destination}`);
  });

  return Array.from(routes);
});

const maxPrice = computed<number>(() => {
  if (!rawData.value) return 1000;

  let max = 0;
  rawData.value.forEach((trip: Trip) => {
    if (trip.minPrice > max) max = trip.minPrice;
  });

  return Math.ceil(max / 100) * 100;
});

watch(rawData, () => {
  if (rawData.value) {
    filteredTrips.value = [...rawData.value];
    priceRange.value = maxPrice.value;
  }
}, {immediate: true});

function formatDate(dateStr: string): string {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  return date.toLocaleString('de-CH', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function calculateDuration(startStr: string, endStr: string): string {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;
  return `${hours}h ${minutes}min`;
}

function getTripDurationHours(startStr: string, endStr: string): number {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diffMs = end.getTime() - start.getTime();
  return diffMs / (1000 * 60 * 60);
}

const getImage = (destination: string): string => {
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

function resetFilters(): void {
  searchQuery.value = '';
  startDate.value = '';
  selectedRoute.value = null;
  priceRange.value = maxPrice.value;
  maxDuration.value = 24;

  if (rawData.value) {
    filteredTrips.value = [...rawData.value];
  }
}

function filterTrips(): void {
  if (!rawData.value) return;

  filteredTrips.value = rawData.value.filter((trip: Trip) => {
    // Suchfilter
    const searchText = searchQuery.value.toLowerCase();
    const fromDest = trip.route.from_destination.toLowerCase();
    const toDest = trip.route.to_destination.toLowerCase();
    const subtitle = trip.route.subtitle.toLowerCase();
    const ferryName = trip.ferry?.name?.toLowerCase() || '';

    const matchesSearch = searchText === '' ||
        fromDest.includes(searchText) ||
        toDest.includes(searchText) ||
        subtitle.includes(searchText) ||
        ferryName.includes(searchText);

    // Routenfilter
    const routeString = `${trip.route.from_destination} to ${trip.route.to_destination}`;
    const matchesRoute = !selectedRoute.value || selectedRoute.value === routeString;

    // Preisfilter
    const matchesPrice = trip.minPrice <= priceRange.value;

    // Dauerfilter
    const tripDuration = getTripDurationHours(trip.departure_time, trip.arrival_time);
    const matchesDuration = tripDuration <= maxDuration.value;

    // Datumsfilter
    let matchesDate = true;
    if (startDate.value) {
      const tripDeparture = new Date(trip.departure_time);

      if (startDate.value) {
        const start = new Date(startDate.value);
        start.setHours(0, 0, 0, 0);
        if (tripDeparture < start) matchesDate = false;
      }
    }

    return matchesSearch && matchesRoute && matchesPrice && matchesDuration && matchesDate;
  });
}
</script>

<style scoped>
.hover-shadow:hover {
  box-shadow: 2px 0 40px 7px rgba(203, 166, 247, 0.74) !important;
}

@media (max-width: 960px) {
  .gap-2 > * + * {
    margin-top: 8px;
  }
}
</style>