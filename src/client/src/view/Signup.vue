<template>
  <v-row>
    <v-spacer></v-spacer>
    <v-col cols="12" lg="7" md="8" sm="10" xl="5" xxl="4">
      <v-card>
        <v-card-title :class="$vuetify.display.xs ? 'text-h6' : 'text-h5'" class="text-center font-weight-bold my-6">Register</v-card-title>
        <v-card-text>
          <v-stepper v-model="currentStep" :items="stepperItems" style="box-shadow: none">
            <template v-slot:item.1>
              <v-form v-model="isPersonalInfoValid" @submit.prevent>
                <v-text-field v-model="firstname" :rules="[required]" class="mb-5" label="Firstname"></v-text-field>
                <v-text-field v-model="lastname" :rules="[required]" class="mb-5" label="Lastname"></v-text-field>
                <v-select v-model="gender" :items="genders" :rules="[required]" class="mb-5" label="Gender"></v-select>
                <v-text-field v-model="birthdate" :rules="[required]" class="mb-5" label="Birthdate" type="date"></v-text-field>

                <v-row>
                  <v-col :cols="$vuetify.display.xs ? '12' : '6'">
                    <v-text-field v-model="phoneNumber" :rules="[required, phone]" label="Phone number"></v-text-field>
                  </v-col>
                  <v-col :cols="$vuetify.display.xs ? '12' : '6'">
                    <v-text-field v-model="nationality" :rules="[required]" label="Nationality"></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </template>

            <template v-slot:item.2>
              <v-form v-model="isAddressValid" @submit.prevent>
                <v-row>
                  <v-col :cols="$vuetify.display.xs ? '12' : '6'">
                    <v-text-field v-model="city" :rules="[required]" label="City"></v-text-field>
                  </v-col>
                  <v-col :cols="$vuetify.display.xs ? '12' : '6'">
                    <v-text-field v-model="postalCode" :rules="[required]" label="Postal code"></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="street" :rules="[required]" label="Street"></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col :cols="$vuetify.display.xs ? '12' : '6'">
                    <v-text-field v-model="houseNumber" :rules="[required]" label="House Nr."></v-text-field>
                  </v-col>
                  <v-col :cols="$vuetify.display.xs ? '12' : '6'">
                    <v-text-field v-model="houseNumberAddon" label="House Nr. Addon"></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </template>

            <template v-slot:item.3>
              <v-form v-model="isLoginInfoValid" @submit.prevent>
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
                        :rules="[required, password]"
                        :type="showPassword ? 'text' : 'password'"
                        label="Password"
                        @click:append-inner="togglePasswordVisibility"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </template>

            <template v-slot:item.4>
              <v-form v-model="isDriverLicenseValid" @submit.prevent>
                <v-row>
                  <v-col cols="12" :md="$vuetify.display.xs ? '12' : '6'">
                    <v-text-field v-model="driverLicenseCountryCode" :rules="[countryCode, required]" label="Country Code"></v-text-field>
                  </v-col>
                  <v-col cols="12" :md="$vuetify.display.xs ? '12' : '6'">
                    <v-text-field v-model="driverLicenseNumber" :rules="[required]" label="License Number"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="driverLicenseDateOfIssue" :rules="[required]" class="mb-5" label="Date of Issue" type="date"></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </template>

            <template v-slot:actions>
              <v-row>
                <v-col v-if="currentStep > 1">
                  <v-btn
                      @click="previousStep"
                      variant="outlined"
                      block
                  >
                    Previous
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn
                      v-if="currentStep < 4"
                      @click="nextStep"
                      :disabled="!isCurrentStepValid"
                      color="primary"
                      block
                  >
                    Next
                  </v-btn>
                  <v-btn
                      v-else
                      :disabled="!isValid"
                      :loading="loading"
                      color="primary"
                      block
                      @click="execute"
                  >
                    Signup
                  </v-btn>
                </v-col>
              </v-row>
            </template>
          </v-stepper>
        </v-card-text>

        <v-card-subtitle :class="$vuetify.display.xs ? 'mb-4 text-center text-body-2' : 'mb-6 text-center'">
          Have an account already?
          <router-link class="text-primary" to="/login">Login</router-link>
        </v-card-subtitle>
      </v-card>
    </v-col>
    <v-spacer></v-spacer>
  </v-row>
</template>

<script lang="ts" setup>

import {inject, ref, computed} from "vue";
import {useFetch} from "@vueuse/core";
import {countryCode, mail, password, phone, required} from "../utils/validators.ts";
import {useSnackBar} from "../stores/snackBarStore.ts";
import {useRouter} from "vue-router";

const {addSnackBar} = useSnackBar();
const router = useRouter();

const showPassword = ref(false);
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const currentStep = ref(1);
const isPersonalInfoValid = ref<boolean>(false);
const isAddressValid = ref<boolean>(false);
const isLoginInfoValid = ref<boolean>(false);
const isDriverLicenseValid = ref<boolean>(false);

const stepperItems = [
  { title: 'Personal Information', value: 1 },
  { title: 'Address', value: 2 },
  { title: 'Login Information', value: 3 },
  { title: 'Driver\'s License', value: 4 }
];

const isCurrentStepValid = computed(() => {
  switch (currentStep.value) {
    case 1: return isPersonalInfoValid.value;
    case 2: return isAddressValid.value;
    case 3: return isLoginInfoValid.value;
    case 4: return isDriverLicenseValid.value;
    default: return false;
  }
});

const isValid = computed(() => {
  return isPersonalInfoValid.value && isAddressValid.value && isLoginInfoValid.value && isDriverLicenseValid.value;
});

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const url = inject<string>('apiUrl') + "/auth/signup"

const genders = ref<string[]>(["FEMALE", "MALE", "OTHER"])

const firstname = ref<string>("");
const lastname = ref<string>("");
const birthdate = ref<string>();
const gender = ref<string>("");
const email = ref<string>("");
const passwordValue = ref<string>("");
const phoneNumber = ref<string>("");
const nationality = ref<string>("");

const city = ref<string>("");
const postalCode = ref<string>("");
const houseNumber = ref<number>();
const houseNumberAddon = ref<string>("");
const street = ref<string>("");

const driverLicenseCountryCode = ref<string>("");
const driverLicenseNumber = ref<string>("");
const driverLicenseDateOfIssue = ref<string>();

const {execute, isFetching: loading, onFetchResponse} = useFetch(url, {
  headers: {Accept: 'application/json'},
  credentials: 'include',
}, {
  immediate: false,
  updateDataOnError: true,
  onFetchError(e) {
    addSnackBar('error', e.data.message);
    return e;
  }
}).post(() => ({
  firstname: firstname.value,
  lastname: lastname.value,
  birthdate: birthdate.value,
  gender: gender.value,
  email: email.value,
  password: passwordValue.value,
  phone_number: phoneNumber.value,
  nationality: nationality.value,
  driver_license: {
    country_code: driverLicenseCountryCode.value,
    license_number: driverLicenseNumber.value,
    date_of_issue: driverLicenseDateOfIssue.value
  },
  address: {
    city: city.value,
    postal_code: postalCode.value,
    house_number: houseNumber.value,
    house_number_addon: houseNumberAddon.value,
    street: street.value
  }
})).json()

onFetchResponse((response) => {
  response.json().then((data) => {
    if (data.success) {
      router.push('/');
      window.location.reload();
    }
  });
});
</script>