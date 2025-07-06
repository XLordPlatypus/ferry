<template>
  <v-card class="mb-4 pa-2 pa-md-4" flat>
    <v-card-title class="text-h5 text-md-h4">Traveler Information</v-card-title>
    <v-card-subtitle v-if="isLoggedIn" class="text-body-2">
      Some of your data has already been filled in. Please verify it.
    </v-card-subtitle>
    <v-card-subtitle v-else class="text-body-2">
      Please enter information about the travelers
    </v-card-subtitle>

    <v-expand-transition>
      <div>
        <div class="d-flex justify-end mb-4">
          <v-btn
              color="secondary"
              prepend-icon="mdi-plus"
              size="small"
              @click="addCustomer"
          >
            <span class="d-none d-sm-inline">Add Traveler</span>
            <span class="d-sm-none">Add</span>
          </v-btn>
        </div>

        <v-sheet v-for="(customer, index) in customers" :key="`customer-${index}`" class="mb-4 mb-md-6 pa-2 pa-md-4 rounded">
          <div class="d-flex justify-space-between align-center mb-4">
            <h3 class="text-subtitle-1 text-md-h6">Traveler {{ index + 1 }}</h3>
            <v-btn
                v-if="index > 0 || !isLoggedIn"
                color="error"
                icon="mdi-delete"
                size="small"
                variant="text"
                @click="removeCustomer(index)"
            ></v-btn>
          </div>

          <v-form :key="`form-${index}-${formKey}`" v-model="customerFormValidArray[index]" @submit.prevent>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="customer.firstname"
                    :readonly="isLoggedIn && index === 0"
                    :rules="[required]"
                    label="First Name"
                    required
                    density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="customer.lastname"
                    :readonly="isLoggedIn && index === 0"
                    :rules="[required]"
                    label="Last Name"
                    required
                    density="compact"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="customer.email"
                    :readonly="isLoggedIn && index === 0"
                    :rules="[required, mail]"
                    label="Email"
                    required
                    type="email"
                    density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="customer.phone_number"
                    :readonly="isLoggedIn && index === 0"
                    :rules="[required, phone]"
                    label="Phone Number"
                    required
                    density="compact"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                    v-model="customer.gender"
                    :items="genderOptions"
                    :readonly="isLoggedIn && index === 0"
                    :rules="[required]"
                    label="Gender"
                    required
                    density="compact"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="customer.nationality"
                    :readonly="isLoggedIn && index === 0"
                    :rules="[required]"
                    label="Nationality"
                    required
                    density="compact"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-text-field
                    :model-value="formatDateForInput(customer.birthdate)"
                    :readonly="isLoggedIn && index === 0"
                    :rules="[required]"
                    label="Date of Birth"
                    required
                    type="date"
                    density="compact"
                    @update:model-value="customer.birthdate = $event"
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- Hidden validation fields for address -->
            <div style="display: none;">
              <v-text-field
                  v-model="customer.address.street"
                  :rules="[required]"
                  density="compact"
              ></v-text-field>
              <v-text-field
                  v-model="customer.address.house_number"
                  :rules="[required]"
                  density="compact"
              ></v-text-field>
              <v-text-field
                  v-model="customer.address.postal_code"
                  :rules="[required]"
                  density="compact"
              ></v-text-field>
              <v-text-field
                  v-model="customer.address.city"
                  :rules="[required]"
                  density="compact"
              ></v-text-field>
            </div>

            <v-expansion-panels class="mt-4" variant="accordion">
              <v-expansion-panel :title="`Address ${getAddressValidationIcon(customer.address)}`">
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="12" sm="8">
                      <v-text-field
                          v-model="customer.address.street"
                          :readonly="isLoggedIn && index === 0"
                          :rules="[required]"
                          label="Street"
                          required
                          density="compact"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="2">
                      <v-text-field
                          v-model="customer.address.house_number"
                          :readonly="isLoggedIn && index === 0"
                          :rules="[required]"
                          label="House No."
                          required
                          density="compact"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="2">
                      <v-text-field
                          v-model="customer.address.house_number_addon"
                          :readonly="isLoggedIn && index === 0"
                          label="Addition"
                          density="compact"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="4">
                      <v-text-field
                          v-model="customer.address.postal_code"
                          :readonly="isLoggedIn && index === 0"
                          :rules="[required]"
                          label="Postal Code"
                          required
                          density="compact"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="8">
                      <v-text-field
                          v-model="customer.address.city"
                          :readonly="isLoggedIn && index === 0"
                          :rules="[required]"
                          label="City"
                          required
                          density="compact"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel :title="`Driver's License Data ${getDriverLicenseValidationIcon(customer.driver_license)}`">
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                          v-model="customer.driver_license.country_code"
                          :readonly="isLoggedIn && index === 0"
                          :rules="[required, countryCode]"
                          label="Country Code"
                          required
                          density="compact"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                          v-model="customer.driver_license.license_number"
                          :readonly="isLoggedIn && index === 0"
                          :rules="[required]"
                          label="License Number"
                          required
                          density="compact"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                          :model-value="formatDateForInput(customer.driver_license.date_of_issue)"
                          :readonly="isLoggedIn && index === 0"
                          :rules="[required]"
                          label="Date of Issue"
                          required
                          type="date"
                          density="compact"
                          @update:model-value="customer.driver_license.date_of_issue = $event"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-form>
        </v-sheet>
      </div>
    </v-expand-transition>

    <div class="d-flex flex-column flex-sm-row justify-space-between mt-4 ga-2">
      <v-btn @click="$emit('previous-step')" class="order-2 order-sm-1">Back</v-btn>
      <v-btn :disabled="!allFormsValid || !hasAtLeastOneDriverLicense" color="primary" @click="$emit('next-step')" class="order-1 order-sm-2">Next</v-btn>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import {computed, nextTick, ref, watch} from 'vue';
import {countryCode, mail, phone, required} from "../../utils/validators.ts";
import type {CustomerData} from "../../utils/Interfaces.ts";

const props = defineProps<{
  customers: CustomerData[];
  isLoggedIn: boolean;
  formsValid: boolean[];
}>();

const emit = defineEmits<{
  'previous-step': [];
  'next-step': [];
  'update:forms-valid': [value: boolean[]];
}>();

const customerFormValidArray = ref<boolean[]>([]);
const formKey = ref<number>(0);

// Check if address is complete
const isAddressComplete = (address: any): boolean => {
  return !!(address.street && address.house_number && address.postal_code && address.city);
};

// Check if driver license is complete
const isDriverLicenseComplete = (license: any): boolean => {
  return !!(license.country_code && license.license_number && license.date_of_issue);
};

// Check if at least one customer has complete driver license
const hasAtLeastOneDriverLicense = computed((): boolean => {
  return props.customers.some(customer => isDriverLicenseComplete(customer.driver_license));
});

// Get validation icon for address
const getAddressValidationIcon = (address: any): string => {
  return isAddressComplete(address) ? '✓' : '⚠️';
};

// Get validation icon for driver license
const getDriverLicenseValidationIcon = (license: any): string => {
  return isDriverLicenseComplete(license) ? '✓' : '';
};

const allFormsValid = computed((): boolean => {
  const basicFormValid = customerFormValidArray.value.length > 0 && customerFormValidArray.value.every(isValid => isValid);
  const allAddressesComplete = props.customers.every(customer => isAddressComplete(customer.address));

  return basicFormValid && allAddressesComplete && hasAtLeastOneDriverLicense.value;
});

const initializeValidationArray = (): void => {
  customerFormValidArray.value = Array(props.customers.length).fill(false);
  if (props.isLoggedIn && props.customers.length > 0) {
    customerFormValidArray.value[0] = true;
  }
  formKey.value++;
};

watch(() => props.customers.length, () => {
  initializeValidationArray();
}, {immediate: true});

watch(customerFormValidArray, (newValue: boolean[]) => {
  emit('update:forms-valid', newValue);
}, {deep: true});

// Watch for changes in customer data to trigger validation updates
watch(() => props.customers, () => {
  // Force reactivity update for validation
}, {deep: true});

const genderOptions: string[] = ['MALE', 'FEMALE', 'OTHER'];

const formatDateForInput = (isoDateString: string): string => {
  if (!isoDateString) return '';
  try {
    const date = new Date(isoDateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    return '';
  }
};

const addCustomer = async (): Promise<void> => {
  props.customers.push({
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
  });

  await nextTick();
  initializeValidationArray();
};

const removeCustomer = async (index: number): Promise<void> => {
  if (props.customers.length > 1) {
    props.customers.splice(index, 1);
    await nextTick();
    initializeValidationArray();
  }
};
</script>