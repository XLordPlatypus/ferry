<template>
  <v-card class="mb-4 pa-2 pa-md-4" flat>
    <v-card-title class="text-h5 text-md-h4">Vehicle Details</v-card-title>
    <v-card-subtitle class="text-body-2">Please enter the details of your vehicle</v-card-subtitle>

    <v-card-text class="pa-2 pa-md-4">
      <v-form v-if="!loading && sizes" v-model="formValid" @submit.prevent>
        <v-switch
            v-model="vehicleDetails.motorcycle"
            class="mb-4"
            color="primary"
            hide-details
            label="Motorcycle"
            density="compact"
        ></v-switch>

        <v-select
            v-model="vehicleDetails.height"
            :items="sizes.vehicleHeight"
            :rules="[required]"
            :loading="capacityCheckStatus === 'checking'"
            class="mb-4"
            item-title="label"
            item-value="_id"
            label="Vehicle Height"
            return-object
            density="compact"
        ></v-select>

        <v-select
            v-model="vehicleDetails.length"
            :items="sizes.vehicleLength"
            :rules="[required]"
            :loading="capacityCheckStatus === 'checking'"
            class="mb-4"
            item-title="label"
            item-value="_id"
            label="Vehicle Length"
            return-object
            density="compact"
        ></v-select>

        <v-switch
            v-model="vehicleDetails.trailer.exists"
            class="mb-4"
            color="primary"
            hide-details
            label="With Trailer"
            density="compact"
        ></v-switch>

        <div v-if="vehicleDetails.trailer.exists">
          <v-select
              v-model="vehicleDetails.trailer.length"
              :items="sizes.trailerLength"
              :rules="[required]"
              :loading="capacityCheckStatus === 'checking'"
              class="mb-4"
              item-title="label"
              item-value="_id"
              label="Trailer Length"
              return-object
              density="compact"
          ></v-select>
        </div>

        <!-- Capacity Check Status Indicator -->
        <div v-if="capacityCheckStatus === 'checking'" class="d-flex align-center mb-4">
          <v-progress-circular
              size="20"
              width="2"
              color="primary"
              indeterminate
              class="mr-2"
          ></v-progress-circular>
          <span class="text-body-2">Checking vehicle capacity...</span>
        </div>

        <v-btn
            :disabled="!isFormCompletelyValid || submitLoading"
            :loading="submitLoading"
            class="mt-4 w-100 w-sm-auto"
            color="primary"
            @click="handleNext"
        >
          Next
        </v-btn>
      </v-form>

      <v-row v-else class="my-8 my-md-16">
        <v-col class="text-center">
          <v-progress-circular
              color="primary"
              indeterminate
              size="48"
          ></v-progress-circular>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import {computed, defineEmits, inject, ref, watch} from 'vue';
import {required} from "../../utils/validators.ts";
import {useFetch} from "@vueuse/core";
import type {VehicleDetails, VehicleSizes} from "../../utils/Interfaces.ts";
import {useSnackBar} from "../../stores/snackBarStore.ts";

const props = defineProps<{
  vehicleDetails: VehicleDetails;
  valid: boolean | null;
  tripId: string;
}>();

const emit = defineEmits<{
  'update:valid': [value: boolean];
  'next-step': [];
}>();

const url = inject<string>('apiUrl') + "/vehicleSize";
const {isFetching: loading, data: sizes} = useFetch<VehicleSizes>(url, {immediate: true}).get().json();

const formValid = ref<boolean>(props.valid != null ? props.valid : false);
const submitLoading = ref<boolean>(false);
const capacityCheckStatus = ref<'idle' | 'checking' | 'success' | 'error'>('idle');
const capacityErrorMessage = ref<string>('');
const lastCheckedVehicleData = ref<string>('');

// Check if all required fields are filled
const isFormDataComplete = computed((): boolean => {
  const hasRequiredFields = !!(props.vehicleDetails.height && props.vehicleDetails.length);
  const hasTrailerLength = props.vehicleDetails.trailer.exists ? !!props.vehicleDetails.trailer.length : true;
  return hasRequiredFields && hasTrailerLength;
});

const isFormCompletelyValid = computed((): boolean => {
  return formValid.value && capacityCheckStatus.value === 'success';
});

const getCurrentVehicleDataString = (): string => {
  return JSON.stringify({
    motorcycle: props.vehicleDetails.motorcycle,
    height: props.vehicleDetails.height?._id || props.vehicleDetails.height,
    length: props.vehicleDetails.length?._id || props.vehicleDetails.length,
    trailerExists: props.vehicleDetails.trailer.exists,
    trailerLength: props.vehicleDetails.trailer.length?._id || props.vehicleDetails.trailer.length
  });
};

const urlCheckCapacity = inject<string>('apiUrl') + "/trip/" + props.tripId + "/hasVehicleCapacity";
const {execute: executeCapacityCheck} = useFetch(urlCheckCapacity, {
  headers: {Accept: 'application/json'},
}, {
  immediate: false,
  updateDataOnError: true,
  onFetchError(e) {
    capacityErrorMessage.value = e?.data?.message || 'Vehicle capacity check failed - no space available for your vehicle on this trip';
    capacityCheckStatus.value = 'error';
    return e;
  }
}).post(() => ({
  isMotorcycle: props.vehicleDetails.motorcycle,
  height: props.vehicleDetails.height,
  length: props.vehicleDetails.length,
  isTrailer: props.vehicleDetails.trailer.exists,
  trailerLength: props.vehicleDetails.trailer.length
})).json();

const performCapacityCheck = async (): Promise<void> => {
  if (!isFormDataComplete.value) {
    capacityCheckStatus.value = 'idle';
    return;
  }

  const currentDataString = getCurrentVehicleDataString();

  if (lastCheckedVehicleData.value === currentDataString && capacityCheckStatus.value === 'success') {
    return;
  }

  capacityCheckStatus.value = 'checking';
  capacityErrorMessage.value = '';

  try {
    await executeCapacityCheck();
    capacityCheckStatus.value = 'success';
    lastCheckedVehicleData.value = currentDataString;
  } catch (error) {
    lastCheckedVehicleData.value = '';
  }
};

watch(formValid, async (newValue: boolean) => {
  emit('update:valid', isFormCompletelyValid.value);

  if (newValue && isFormDataComplete.value) {
    await performCapacityCheck();
  } else {
    capacityCheckStatus.value = 'idle';
    lastCheckedVehicleData.value = '';
  }
});

watch(() => props.vehicleDetails, async () => {
  const currentDataString = getCurrentVehicleDataString();
  if (lastCheckedVehicleData.value !== currentDataString) {
    capacityCheckStatus.value = 'idle';
    lastCheckedVehicleData.value = '';

    if (formValid.value && isFormDataComplete.value) {
      await performCapacityCheck();
    }
  }
}, {deep: true});

watch(capacityCheckStatus, () => {
  emit('update:valid', isFormCompletelyValid.value);
});

const handleNext = (): void => {
  if (isFormCompletelyValid.value && !submitLoading.value) {
    emit('next-step');
  }
};

const {addSnackBar} = useSnackBar();
watch(capacityCheckStatus, () => {
  if (capacityCheckStatus.value === 'error') {
    addSnackBar('success', capacityErrorMessage.value);
  } else {
    addSnackBar('success', "Vehicle capacity confirmed - space available for your trip!");
  }
})
</script>