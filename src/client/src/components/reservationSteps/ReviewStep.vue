<template>
  <v-card class="mb-4 pa-2 pa-md-4" flat>
    <v-card-title class="text-h5 text-md-h4">Review Your Reservation</v-card-title>
    <v-card-subtitle class="text-body-2">
      Please review all details before confirming your reservation
    </v-card-subtitle>

    <v-card-text class="pa-2 pa-md-4">
      <div v-if="!submitting">
        <v-card class="mb-4" variant="outlined">
          <v-card-title class="text-subtitle-1 text-md-h6 bg-secondary text-white pa-3">
            <v-icon class="mr-2" size="small">mdi-car</v-icon>
            Vehicle Details
          </v-card-title>
          <v-card-text class="pa-3 pa-md-4">
            <v-row>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <strong class="text-body-2">Vehicle Type:</strong><br>
                  <span class="text-body-2">{{ vehicleDetails.motorcycle ? 'Motorcycle' : 'Car/Van' }}</span>
                </div>
                <div class="mb-3">
                  <strong class="text-body-2">Vehicle Height:</strong><br>
                  <span class="text-body-2">{{ vehicleDetails.height?.label || 'Not specified' }}</span>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <strong class="text-body-2">Vehicle Length:</strong><br>
                  <span class="text-body-2">{{ vehicleDetails.length?.label || 'Not specified' }}</span>
                </div>
                <div v-if="vehicleDetails.trailer.exists" class="mb-3">
                  <strong class="text-body-2">Trailer Length:</strong><br>
                  <span class="text-body-2">{{ vehicleDetails.trailer.length?.label || 'Not specified' }}</span>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mb-4" variant="outlined">
          <v-card-title class="text-subtitle-1 text-md-h6 bg-info text-white pa-3">
            <v-icon class="mr-2" size="small">mdi-account-group</v-icon>
            Travelers ({{ customers.length }})
          </v-card-title>
          <v-card-text class="pa-3 pa-md-4">
            <v-expansion-panels variant="accordion">
              <v-expansion-panel
                  v-for="(customer, index) in customers"
                  :key="index"
                  :title="`${customer.firstname} ${customer.lastname}`"
              >
                <v-expansion-panel-text class="pa-2 pa-md-3">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <div class="mb-2">
                        <strong class="text-body-2">Name:</strong> <span class="text-body-2">{{ customer.firstname }} {{ customer.lastname }}</span>
                      </div>
                      <div class="mb-2">
                        <strong class="text-body-2">Email:</strong> <span class="text-body-2">{{ customer.email }}</span>
                      </div>
                      <div class="mb-2">
                        <strong class="text-body-2">Phone:</strong> <span class="text-body-2">{{ customer.phone_number }}</span>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="mb-2">
                        <strong class="text-body-2">Gender:</strong> <span class="text-body-2">{{ customer.gender }}</span>
                      </div>
                      <div class="mb-2">
                        <strong class="text-body-2">Nationality:</strong> <span class="text-body-2">{{ customer.nationality }}</span>
                      </div>
                      <div class="mb-2">
                        <strong class="text-body-2">Date of Birth:</strong> <span class="text-body-2">{{ formatDate(customer.birthdate) }}</span>
                      </div>
                    </v-col>
                  </v-row>

                  <v-divider class="my-3"></v-divider>

                  <v-row>
                    <v-col cols="12" sm="6">
                      <h4 class="text-subtitle-2 mb-2">Address</h4>
                      <div class="text-body-2">
                        {{ customer.address.street }} {{
                          customer.address.house_number
                        }}{{ customer.address.house_number_addon }}<br>
                        {{ customer.address.postal_code }} {{ customer.address.city }}
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <h4 class="text-subtitle-2 mb-2">Driver's License</h4>
                      <div class="mb-2">
                        <strong class="text-body-2">Country:</strong> <span class="text-body-2">{{ customer.driver_license.country_code }}</span>
                      </div>
                      <div class="mb-2">
                        <strong class="text-body-2">License Number:</strong> <span class="text-body-2">{{ customer.driver_license.license_number }}</span>
                      </div>
                      <div class="mb-2">
                        <strong class="text-body-2">Date of Issue:</strong> <span class="text-body-2">{{ formatDate(customer.driver_license.date_of_issue) }}</span>
                      </div>
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>

        <v-card class="mb-4" variant="outlined">
          <v-card-text class="pa-3 pa-md-4">
            <v-checkbox
                v-model="termsAccepted"
                :rules="[required]"
                color="primary"
                density="compact"
            >
              <template #label>
                <div class="ml-2 text-body-2">
                  I accept the
                  <a class="text-primary">Terms and Conditions</a>
                  and
                  <a class="text-primary">Privacy Policy</a>
                </div>
              </template>
            </v-checkbox>
          </v-card-text>
        </v-card>

        <div class="d-flex flex-column flex-sm-row justify-space-between mt-4 ga-2">
          <v-btn @click="$emit('previous-step')" class="order-2 order-sm-1">
            Back
          </v-btn>
          <v-btn
              :disabled="!termsAccepted"
              color="success"
              size="large"
              @click="confirmReservation"
              class="order-1 order-sm-2"
          >
            <v-icon left size="small">mdi-check-circle</v-icon>
            <span class="d-none d-sm-inline">Confirm Reservation</span>
            <span class="d-sm-none">Confirm</span>
          </v-btn>
        </div>
      </div>

      <v-row v-else class="my-8 my-md-16">
        <v-col class="text-center">
          <v-progress-circular
              color="primary"
              indeterminate
              size="64"
          ></v-progress-circular>
          <div class="mt-4 text-subtitle-1 text-md-h6">Processing your reservation...</div>
          <div class="text-body-2 text-medium-emphasis">Please wait while we confirm your booking</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import {inject, ref} from 'vue';
import {useRouter} from 'vue-router';
import {useFetch} from '@vueuse/core';
import {required} from "../../utils/validators.ts";
import {useSnackBar} from "../../stores/snackBarStore.ts";
import type {CustomerData, VehicleDetails} from "../../utils/Interfaces.ts";

const props = defineProps<{
  tripId: string;
  price: number;
  vehicleDetails: VehicleDetails;
  customers: CustomerData[];
}>();

const router = useRouter();

const termsAccepted = ref<boolean>(false);
const url = inject<string>('apiUrl') + "/reservation";

const {addSnackBar} = useSnackBar();

const {execute, isFetching: submitting, onFetchResponse} = useFetch(url, {
  headers: {Accept: 'application/json'},
  credentials: 'include',
}, {
  immediate: false,
  updateDataOnError: true,
  onFetchError(e) {
    addSnackBar('error', e.data?.message || 'Failed to create reservation');
    return e;
  }
}).post(() => ({
  tripId: props.tripId,
  price: props.price,
  vehicle: {
    motorcycle: props.vehicleDetails.motorcycle,
    height: props.vehicleDetails.height,
    length: props.vehicleDetails.length,
    trailer: props.vehicleDetails.trailer
  },
  customers: props.customers,
  terms_accepted: termsAccepted.value,
  timestamp: new Date().toISOString()
})).json();

onFetchResponse((response) => {
  response.json().then((data) => {
    if (data.success) {
      addSnackBar('success', 'Reservation confirmed successfully!');
      router.push('/');
    } else {
      addSnackBar('error', data.message || 'Failed to create reservation');
    }
  });
});

const formatDate = (dateString: string): string => {
  if (!dateString) return 'Not specified';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
};

const confirmReservation = (): void => {
  if (!termsAccepted.value) return;
  execute();
};
</script>