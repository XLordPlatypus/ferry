<template>
  <v-row>
    <v-col class="pb-10">
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="12" xl="10" xxl="8">
          <h1 :class="$vuetify.display.mobile ? 'text-h4 text-center mb-4' : ''">My Bookings</h1>

          <!-- Filter Card -->
          <v-card :class="$vuetify.display.mobile ? 'mt-6' : 'mt-10'">
            <v-card-text :class="$vuetify.display.mobile ? 'px-4' : ''">
              <v-row>
                <v-col cols="12" :md="$vuetify.display.mobile ? 12 : 6">
                  <v-select
                      v-model="statusFilter"
                      :items="['All', 'CONFIRMED', 'CANCELLED']"
                      label="Filter by Status"
                      prepend-inner-icon="mdi-filter"
                      :density="$vuetify.display.mobile ? 'comfortable' : 'default'"
                      @update:model-value="filterBookings"
                  ></v-select>
                </v-col>
                <v-col cols="12" :md="$vuetify.display.mobile ? 12 : 6">
                  <v-text-field
                      v-model="searchQuery"
                      clearable
                      label="Search bookings"
                      prepend-inner-icon="mdi-magnify"
                      :density="$vuetify.display.mobile ? 'comfortable' : 'default'"
                      @input="filterBookings"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>

      <!-- Loading State -->
      <v-row v-if="loading" :class="$vuetify.display.mobile ? 'mt-8' : 'mt-16'">
        <v-col class="text-center">
          <v-progress-circular
              color="primary"
              indeterminate
          ></v-progress-circular>
        </v-col>
      </v-row>

      <!-- No bookings message -->
      <v-row v-if="!loading && filteredBookings.length === 0" :class="$vuetify.display.mobile ? 'mt-8' : 'mt-16'">
        <v-col class="text-center">
          <v-alert class="mx-auto" :max-width="$vuetify.display.mobile ? '100%' : '500'" type="info">
            {{ (bookings && bookings.length === 0) ? 'You have no bookings yet.' : 'No bookings found matching your search criteria.' }}
          </v-alert>
        </v-col>
      </v-row>

      <!-- Bookings List -->
      <v-row v-for="booking in filteredBookings" :key="booking._id" :class="$vuetify.display.mobile ? 'mt-6' : 'mt-10'">
        <v-spacer v-if="!$vuetify.display.mobile"></v-spacer>
        <v-col :class="$vuetify.display.mobile ? 'px-4' : 'px-12'" cols="12" xl="10" xxl="8">
          <v-card class="hover-shadow" :style="getBorderStyle(booking.status)">
            <v-row :no-gutters="false" class="pt-4 px-6">
              <!-- Trip Details -->
              <v-col cols="12" sm="6">
                <v-card-text :class="$vuetify.display.mobile ? 'pb-2 pt-0' : ''">
                  <div :class="$vuetify.display.mobile ? 'text-subtitle-1 font-weight-bold' : 'text-h6 font-weight-bold'">
                    {{ booking.trip.route.from_destination }}
                    <v-icon :class="$vuetify.display.mobile ? 'mx-1' : 'mx-2'" :size="$vuetify.display.mobile ? 'small' : 'default'">mdi-arrow-right</v-icon>
                    {{ booking.trip.route.to_destination }}
                  </div>
                  <p :class="$vuetify.display.mobile ? 'font-weight-light text-body-2 mb-2' : 'font-weight-light'">
                    {{ booking.trip.route.subtitle }}
                  </p>
                  <p :class="$vuetify.display.mobile ? 'text-primary mt-2 text-body-2' : 'text-primary mt-4'">
                    <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                    {{ formatDate(booking.trip.departure_time) }}
                  </p>
                  <p :class="$vuetify.display.mobile ? 'text-body-2' : ''">
                    <v-icon size="small" class="mr-1">mdi-ferry</v-icon>
                    Ferry: {{ booking.trip.ferry.name }}
                  </p>
                  <p :class="$vuetify.display.mobile ? 'text-body-2' : ''">
                    <v-icon size="small" class="mr-1">mdi-clock</v-icon>
                    Duration: {{ calculateDuration(booking.trip.departure_time, booking.trip.arrival_time) }}
                  </p>
                </v-card-text>
              </v-col>

              <!-- Vehicle & Price Details -->
              <v-col cols="12" sm="6">
                <v-card-text class="d-flex flex-column h-100">
                  <!-- Price Section -->
                  <div :class="$vuetify.display.mobile ? 'text-center mb-3' : 'text-end mb-3'">
                    <div :class="$vuetify.display.mobile ? 'text-h6 font-weight-bold text-primary' : 'text-h5 font-weight-bold text-primary'">
                      {{ booking.price }}€
                    </div>
                  </div>

                  <!-- Vehicle Details -->
                  <div :class="$vuetify.display.mobile ? 'mb-4' : 'mb-4'" style="flex-grow: 1;">
                    <div class="mb-2">
                      <v-icon size="small" class="mr-1">{{ booking.vehicle.motorcycle ? 'mdi-motorbike' : 'mdi-car' }}</v-icon>
                      <span :class="$vuetify.display.mobile ? 'text-body-2' : ''">
                        {{ booking.vehicle.motorcycle ? 'Motorcycle' : 'Vehicle' }}
                      </span>
                    </div>
                    <div class="mb-2">
                      <span :class="$vuetify.display.mobile ? 'text-body-2' : ''">
                        Size: {{ booking.vehicle.length.label }} × {{ booking.vehicle.height.label }}
                      </span>
                    </div>
                    <div v-if="booking.vehicle.trailer.exists" class="mb-2">
                      <v-icon size="small" class="mr-1">mdi-truck-trailer</v-icon>
                      <span :class="$vuetify.display.mobile ? 'text-body-2' : ''">
                        Trailer: {{ booking.vehicle.trailer.length.label }}
                      </span>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div :class="$vuetify.display.mobile ? 'd-flex flex-row gap-2' : 'text-end'">
                    <v-btn
                        v-if="booking.status === 'CONFIRMED'"
                        color="error"
                        variant="outlined"
                        :size="$vuetify.display.mobile ? 'small' : 'default'"
                        :loading="cancelingBookingId === booking._id"
                        @click="cancelBooking(booking._id)"
                        :class="$vuetify.display.mobile ? 'flex-shrink-0' : ''"
                    >
                      <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                    <v-btn
                        color="primary"
                        variant="outlined"
                        :size="$vuetify.display.mobile ? 'small' : 'default'"
                        @click="showBookingDetails(booking)"
                        :class="$vuetify.display.mobile ? 'flex-grow-1' : ''"
                    >
                      <v-icon start>mdi-eye</v-icon>
                      View Details
                    </v-btn>
                  </div>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-spacer v-if="!$vuetify.display.mobile"></v-spacer>
      </v-row>

      <!-- Booking Details Dialog -->
      <v-dialog v-model="detailsDialog" :max-width="$vuetify.display.mobile ? '95%' : '800'">
        <v-card v-if="selectedBooking">
          <v-card-title>
            <span class="text-h5">Booking Details</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <h3>Trip Information</h3>
                <p><strong>Route:</strong> {{ selectedBooking.trip.route.from_destination }} → {{ selectedBooking.trip.route.to_destination }}</p>
                <p><strong>Departure:</strong> {{ formatDate(selectedBooking.trip.departure_time) }}</p>
                <p><strong>Arrival:</strong> {{ formatDate(selectedBooking.trip.arrival_time) }}</p>
                <p><strong>Ferry:</strong> {{ selectedBooking.trip.ferry.name }}</p>
                <p><strong>Status:</strong>
                  <v-chip :color="getStatusColor(selectedBooking.status)" size="small">
                    {{ selectedBooking.status }}
                  </v-chip>
                </p>
              </v-col>
              <v-col cols="12" md="6">
                <h3>Customer Information</h3>
                <div v-for="customer in selectedBooking.customers" :key="customer._id">
                  <p><strong>Name:</strong> {{ customer.firstname }} {{ customer.lastname }}</p>
                  <p><strong>Email:</strong> {{ customer.email }}</p>
                  <p><strong>Phone:</strong> {{ customer.phone_number }}</p>
                  <p><strong>License:</strong> {{ customer.driver_license.license_number }} ({{ customer.driver_license.country_code }})</p>
                </div>
              </v-col>
            </v-row>
            <v-divider class="my-4"></v-divider>
            <v-row>
              <v-col cols="12">
                <h3>Vehicle Information</h3>
                <p><strong>Type:</strong> {{ selectedBooking.vehicle.motorcycle ? 'Motorcycle' : 'Vehicle' }}</p>
                <p><strong>Dimensions:</strong> {{ selectedBooking.vehicle.length.label }} × {{ selectedBooking.vehicle.height.label }}</p>
                <p v-if="selectedBooking.vehicle.trailer.exists"><strong>Trailer:</strong> {{ selectedBooking.vehicle.trailer.length.label }}</p>
                <p><strong>Total Price:</strong> <span class="text-h6 text-primary">{{ selectedBooking.price }}€</span></p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- Cancel Confirmation Dialog -->
      <v-dialog v-model="cancelDialog" max-width="500">
        <v-card>
          <v-card-title>
            <span class="text-h5">Confirm Cancellation</span>
          </v-card-title>
          <v-card-text>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="cancelDialog = false">
              No
            </v-btn>
            <v-btn color="error" variant="text" :loading="cancelingBookingId !== null" @click="confirmCancelBooking">
              Yes, Cancel Booking
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import {computed, inject, ref} from "vue";
import {useFetch} from "@vueuse/core";
import type {Booking} from "../utils/Interfaces.ts";
import {useSnackBar} from "../stores/snackBarStore.ts";
import {useTheme} from "vuetify";

const {addSnackBar} = useSnackBar();
const apiUrl = inject<string>('apiUrl');
const url = apiUrl + "/myBookings";

const {isFetching: loading, data: bookings, execute: refetchBookings} = useFetch<Booking[]>(url, {
  headers: {Accept: 'application/json'},
  credentials: 'include',
}, {immediate: true}).get().json();

const searchQuery = ref<string>('');
const statusFilter = ref<string>('All');
const detailsDialog = ref<boolean>(false);
const selectedBooking = ref<Booking | null>(null);
const cancelDialog = ref<boolean>(false);
const cancelingBookingId = ref<string | null>(null);
const bookingToCancel = ref<string | null>(null);

const filteredBookings = computed<Booking[]>(() => {
  if (!bookings.value || !Array.isArray(bookings.value)) return [];

  return bookings.value.filter((booking: Booking) => {
    // Status filter
    const matchesStatus = statusFilter.value === 'All' || booking.status === statusFilter.value;

    // Search filter
    const searchText = searchQuery.value.toLowerCase();
    const matchesSearch = searchText === '' ||
        booking.trip.route.from_destination.toLowerCase().includes(searchText) ||
        booking.trip.route.to_destination.toLowerCase().includes(searchText) ||
        booking.trip.ferry.name.toLowerCase().includes(searchText) ||
        booking.customers.some(customer =>
            customer.firstname.toLowerCase().includes(searchText) ||
            customer.lastname.toLowerCase().includes(searchText)
        );

    return matchesStatus && matchesSearch;
  });
});

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

function getStatusColor(status: string): string {
  switch (status) {
    case 'CONFIRMED':
      return 'success';
    case 'CANCELLED':
      return 'error';
    default:
      return 'grey';
  }
}

function filterBookings(): void {
  // Reactive computed property handles filtering automatically
}

function showBookingDetails(booking: Booking): void {
  selectedBooking.value = booking;
  detailsDialog.value = true;
}

function cancelBooking(bookingId: string): void {
  bookingToCancel.value = bookingId;
  cancelDialog.value = true;
}

async function confirmCancelBooking(): Promise<void> {
  if (!bookingToCancel.value || !apiUrl) return;

  cancelingBookingId.value = bookingToCancel.value;

  try {
    const response = await fetch(`${apiUrl}/myBookings/cancel/${bookingToCancel.value}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });

    if (response.ok) {
      addSnackBar('success', 'Booking cancelled successfully');
      await refetchBookings();
    } else {
      const errorData = await response.json();
      addSnackBar('error', errorData.message || 'Failed to cancel booking');
    }
  } catch (error) {
    addSnackBar('error', 'Network error occurred while cancelling booking');
  } finally {
    cancelingBookingId.value = null;
    bookingToCancel.value = null;
    cancelDialog.value = false;
  }
}

const theme = useTheme();
function getBorderStyle(status: string): string {
  if (status === 'CONFIRMED') {
    return `border: 2px solid ${theme.current.value.colors.success} !important;`;
  }
  if (status === 'CANCELLED') {
    return `border: 2px solid ${theme.current.value.colors.error} !important;`;
  }
  return '';
}

</script>

<style scoped>
.hover-shadow:hover {
  box-shadow: 2px 0 40px 7px rgba(203, 166, 247, 0.74) !important;
}

.d-flex.flex-column.ga-2 > * + * {
  margin-top: 8px;
}

@media (max-width: 960px) {
  .d-flex.flex-column.ga-2 > * + * {
    margin-top: 8px;
  }

  .gap-2 > * + * {
    margin-left: 8px;
  }
}
</style>