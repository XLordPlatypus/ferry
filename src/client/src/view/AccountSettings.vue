<template>
  <v-row>
    <v-spacer></v-spacer>
    <v-col cols="12" lg="7" md="8" sm="10" xl="5" xxl="4">
      <v-card>
        <v-card-title class="text-center text-h5 font-weight-bold my-6">Update Account Information</v-card-title>
        <v-card-text>
          <v-form v-model="isValid" class="mb-5 pa-3" @submit.prevent>

            <v-text-field v-model="firstname" :rules="[required]" class="mb-5" label="Firstname"></v-text-field>
            <v-text-field v-model="lastname" :rules="[required]" class="mb-5" label="Lastname"></v-text-field>
            <v-select v-model="gender" :items="genders" :rules="[required]" class="mb-5" label="Gender"></v-select>
            <v-text-field v-model="birthdate" :rules="[required]" class="mb-5" label="Birthdate"
                          type="date"></v-text-field>

            <v-row>
              <v-col cols="6">
                <v-text-field v-model="phoneNumber" :rules="[required, phone]" label="Phone number"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="nationality" :rules="[required]" label="Nationality"></v-text-field>
              </v-col>
            </v-row>

            <v-card-title class="text-center text-h5 font-weight-bold my-6">Address</v-card-title>

            <v-row>
              <v-col cols="6">
                <v-text-field v-model="city" :rules="[required]" label="City"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="postalCode" :rules="[required]" label="Postal code"></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-text-field v-model="street" :rules="[required]" label="Street"></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="6">
                <v-text-field v-model="houseNumber" :rules="[required]" label="House Nr."></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="houseNumberAddon" label="House Nr. Addon"></v-text-field>
              </v-col>
            </v-row>

            <v-card-title class="text-center text-h5 font-weight-bold my-6">Login information</v-card-title>

            <v-row>
              <v-col cols="12">
                <v-text-field v-model="email" :rules="[required, mail]" label="Email"></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-text-field
                    v-model.trim="passwordValue"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    :rules="[password]"
                    :type="showPassword ? 'text' : 'password'"
                    label="Password"
                    @click:append-inner="togglePasswordVisibility"
                />
              </v-col>
            </v-row>

            <v-card-title class="text-center text-h5 font-weight-bold my-6">Driver's license (optional)</v-card-title>

            <v-row>
              <v-col cols="12">
                <v-checkbox v-model="driversLicense" label="I have a driver's license"></v-checkbox>
              </v-col>
            </v-row>

            <v-row v-if="driversLicense">
              <v-col cols="12" md="6">
                <v-text-field v-model="driverLicenseCountryCode" :rules="[countryCode, required]"
                              label="Country Code"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="driverLicenseNumber" :rules="[required]" label="License Number"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="driverLicenseDateOfIssue" :rules="[required]" class="mb-5" label="Date of Issue"
                              type="date"></v-text-field>
              </v-col>
            </v-row>

            <v-btn :disabled="!isValid" :loading="getDataLoading" block class="mt-8" color="primary" @click="execute">
              Update
            </v-btn>

          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
    <v-spacer></v-spacer>
  </v-row>
</template>


<script lang="ts" setup>
import {inject, ref, watchEffect} from "vue";
import { useFetch } from "@vueuse/core";
import { countryCode, mail, password, phone, required } from "../utils/validators.ts";
import { useSnackBar } from "../stores/snackBarStore.ts";
import { useRouter } from "vue-router";

const { addSnackBar } = useSnackBar();
const router = useRouter();

const showPassword = ref(false);
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const isValid = ref(false);
const url = inject<string>('apiUrl') + "/customer";

const { isFetching: getDataLoading, onFetchResponse, data } = useFetch(url, {
  headers: { Accept: 'application/json' },
  credentials: 'include',
}, {
  immediate: true,
  updateDataOnError: true,
  onFetchError(e) {
    addSnackBar('error', e.data.message);
    return e;
  }
}).get().json();

const genders = ref(["FEMALE", "MALE", "OTHER"]);

const firstname = ref('');
const lastname = ref('');
const birthdate = ref<Date>();
const gender = ref('');
const email = ref('');
const phoneNumber = ref('');
const nationality = ref('');

const city = ref('');
const postalCode = ref('');
const houseNumber = ref('');
const houseNumberAddon = ref('');
const street = ref('');

const driversLicense = ref(false);
const driverLicenseCountryCode = ref('');
const driverLicenseNumber = ref('');
const driverLicenseDateOfIssue = ref('');

const passwordValue = ref('');

watchEffect(() => {
  if (!data.value) return;

  firstname.value = data.value.firstname ?? '';
  lastname.value = data.value.lastname ?? '';
  birthdate.value = data.value.birthdate ? data.value.birthdate.substring(0, 10) : ""
  gender.value = data.value.gender ?? '';
  email.value = data.value.email ?? '';
  phoneNumber.value = data.value.phone_number ?? '';
  nationality.value = data.value.nationality ?? '';

  const address = data.value.address || {};
  city.value = address.city ?? '';
  postalCode.value = address.postal_code ?? '';
  houseNumber.value = address.house_number ?? '';
  houseNumberAddon.value = address.house_number_addon ?? '';
  street.value = address.street ?? '';

  driversLicense.value = data.value.drivers_license !== null;
  const license = data.value.driver_license || {};
  driverLicenseCountryCode.value = license.country_code ?? '';
  driverLicenseNumber.value = license.license_number ?? '';
  driverLicenseDateOfIssue.value = license.date_of_issue ? data.value.birthdate.substring(0, 10) : "";
});

const { execute } = useFetch(url, {
  headers: { Accept: 'application/json' },
  credentials: 'include',
}, {
  immediate: false,
  updateDataOnError: false,
  onFetchError(e) {
    addSnackBar('error', e.data.message);
    return e;
  }
}).put(() => ({
  firstname: firstname.value,
  lastname: lastname.value,
  birthdate: birthdate.value,
  gender: gender.value,
  email: email.value,
  password: passwordValue.value,
  phone_number: phoneNumber.value,
  nationality: nationality.value,
  driver_license: driversLicense.value ? {
    country_code: driverLicenseCountryCode.value,
    license_number: driverLicenseNumber.value,
    date_of_issue: driverLicenseDateOfIssue.value
  } : {},
  address: {
    city: city.value,
    postal_code: postalCode.value,
    house_number: houseNumber.value,
    house_number_addon: houseNumberAddon.value,
    street: street.value
  }
})).json();

onFetchResponse((response) => {
  response.json().then((data) => {
    if (data.success) {
      router.push('/');
    }
  });
});
</script>
