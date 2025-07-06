<template>
  <v-container fluid class="pa-2 pa-sm-4">
    <v-stepper v-model="currentStep" elevation="0" flat>
      <v-card v-if="!tripLoading && trip" class="hover-shadow mb-4">
        <v-row no-gutters>
          <v-col cols="12">
            <v-img :src="getImage(trip.route.to_destination)" cover height="250" class="d-sm-none"/>
            <v-img :src="getImage(trip.route.to_destination)" cover height="400" class="d-none d-sm-block"/>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" sm="6">
            <v-card-text class="pa-3 pa-sm-4">
              <div class="text-subtitle-1 text-sm-h6 font-weight-bold">
                {{ trip.route.from_destination }}
                <v-icon class="mx-1 mx-sm-2" size="small">mdi-arrow-right</v-icon>
                {{ trip.route.to_destination }}
              </div>
              <p class="font-weight-light text-body-2 text-sm-body-1 mb-2">{{ trip.route.subtitle }}</p>
              <p class="text-primary mt-2 mt-sm-4 text-body-2 text-sm-body-1">
                <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                {{ formatDate(trip.departure_time) + " - " + formatDate(trip.arrival_time) }}
              </p>
            </v-card-text>
          </v-col>
          <v-col class="text-end" cols="12" sm="6">
            <v-card-text class="text-primary pa-3 pa-sm-4">
              <div class="text-subtitle-1 text-sm-h6 font-weight-bold">
                {{ "From " + trip.minPrice + "€" }}
              </div>
            </v-card-text>
            <v-card-subtitle class="text-body-2 text-sm-subtitle-2 pb-3 pb-sm-4">
              <v-icon size="small" class="mr-1">mdi-clock</v-icon>
              {{
                calculateDuration(trip.departure_time, trip.arrival_time)
              }}
            </v-card-subtitle>
          </v-col>
        </v-row>
      </v-card>
      <v-card v-else class="mb-4">
        <v-row class="my-8 my-sm-16">
          <v-col class="text-center">
            <v-progress-circular
                color="primary"
                indeterminate
            ></v-progress-circular>
          </v-col>
        </v-row>
      </v-card>
      <v-divider class="mx-2 mx-sm-6 mb-4"></v-divider>
      <v-stepper-header style="box-shadow: none" class="px-2 px-sm-0">
        <v-stepper-item :complete="Number(currentStep) > 1" color="primary" value="1">
          <span class="d-none d-sm-inline">Vehicle Details</span>
          <span class="d-sm-none">Vehicle</span>
        </v-stepper-item>
        <v-divider/>
        <v-stepper-item :complete="Number(currentStep) > 2" color="primary" value="2">
          Travelers
        </v-stepper-item>
        <v-divider/>
        <v-stepper-item color="primary" value="3">
          <span class="d-none d-sm-inline">Review & Payment</span>
          <span class="d-sm-none">Review</span>
        </v-stepper-item>
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-window-item value="1">
          <VehicleDetailsStep
              :trip-id="tripId"
              v-model:valid="vehicleFormValid"
              :vehicle-details="vehicleDetails"
              @next-step="goToStep('2')"
          />
        </v-stepper-window-item>

        <v-stepper-window-item value="2">
          <TravelersStep
              :customers="customers"
              v-model:forms-valid="customerFormsValid"
              :is-logged-in="isLoggedIn"
              @previous-step="goToStep('1')"
              @next-step="goToStep('3')"
          />
        </v-stepper-window-item>

        <v-stepper-window-item value="3">
          <ReviewStep
              :price="trip.minPrice"
              :customers="customers"
              :trip-id="tripId"
              :vehicle-details="vehicleDetails"
              @previous-step="goToStep('2')"
          />
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>
  </v-container>
</template>

<script lang="ts" setup>
import {inject, reactive, ref, watch} from 'vue';
import {useFetch} from "@vueuse/core";
import type {CustomerData, Trip} from "../utils/Interfaces.ts";
import {storeToRefs} from "pinia";
import {useAuth} from "../stores/authStore.ts";
import VehicleDetailsStep from "../components/reservationSteps/VehicleDetailsStep.vue";
import TravelersStep from "../components/reservationSteps/TravelersStep.vue";
import ReviewStep from "../components/reservationSteps/ReviewStep.vue";

const props = defineProps<{
  tripId: string;
}>();

const auth = useAuth();
const {isAuthenticated} = storeToRefs(auth);

const tripUrl = inject<string>('apiUrl') + "/trip/" + props.tripId;
const {isFetching: tripLoading, data: trip} = useFetch<Trip>(tripUrl, {immediate: true}).get().json();

const url = inject<string>('apiUrl') + "/customer";
const {isFetching: customerLoading, data: customer} = useFetch(url, {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  },
}, {
  immediate: true
}).get().json();

const currentStep = ref<string>('1');
const isLoggedIn = ref<boolean>(false);

const vehicleFormValid = ref<boolean>(false);
const customerFormsValid = ref<boolean[]>([false]);

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

const vehicleDetails = reactive({
  motorcycle: false,
  height: null,
  length: null,
  trailer: {
    exists: false,
    length: null
  }
});

const customers = ref<CustomerData[]>([
  {
    firstname: '',
    lastname: '',
    birthdate: '',
    gender: 'MALE',
    email: '',
    phone_number: '',
    nationality: '',
    driver_license: {
      country_code: '',
      license_number: '',
      date_of_issue: ''
    },
    address: {
      city: '',
      postal_code: '',
      house_number: '',
      house_number_addon: '',
      street: ''
    }
  }
]);

watch([isAuthenticated, customerLoading, customer], () => {
  if (isAuthenticated.value && !customerLoading.value && customer.value) {
    isLoggedIn.value = true;
    customers.value = [
      {
        _id: customer.value._id,
        firstname: customer.value.firstname,
        lastname: customer.value.lastname,
        birthdate: customer.value.birthdate,
        gender: customer.value.gender,
        email: customer.value.email,
        phone_number: customer.value.phone_number,
        nationality: customer.value.nationality,
        driver_license: {
          country_code: customer.value.driver_license.country_code,
          license_number: customer.value.driver_license.license_number,
          date_of_issue: customer.value.driver_license.date_of_issue
        },
        address: {
          city: customer.value.address.city,
          postal_code: customer.value.address.postal_code,
          house_number: customer.value.address.house_number,
          house_number_addon: customer.value.address.house_number_addon,
          street: customer.value.address.street
        }
      }
    ];
    customerFormsValid.value = [true];
  }
}, {immediate: true});


const goToStep = (step: string) => {
  currentStep.value = step;
};
</script>