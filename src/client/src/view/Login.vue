<template>
  <v-row>
    <v-spacer></v-spacer>
    <v-col cols="12" lg="5" md="6" sm="8" xl="3" xxl="2">
      <v-card>
        <v-card-title class="text-center text-h5 font-weight-bold my-6">Login</v-card-title>
        <v-card-text>
          <v-form v-model="isValid" @submit.prevent>
            <v-text-field v-model.trim="email" :rules="[required]" class="mb-6" label="Email"></v-text-field>
            <v-text-field
                v-model.trim="password"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :rules="[required]"
                :type="showPassword ? 'text' : 'password'"
                class="mb-6"
                label="Password"
                @click:append-inner="togglePasswordVisibility"
            />
            <!--            <v-checkbox color="primary" label="Remember me"></v-checkbox>-->
            <v-btn :disabled="!isValid" :loading="loading" block class="mb-2" color="primary" @click="login">Login
            </v-btn>
          </v-form>
        </v-card-text>
        <v-card-subtitle class="mb-6 text-center">
          No account yet?
          <router-link class="text-primary" to="/signup">Register now</router-link>
        </v-card-subtitle>
      </v-card>
    </v-col>
    <v-spacer></v-spacer>
  </v-row>
</template>
<script lang="ts" setup>
import {inject, ref} from "vue";
import {useRouter} from "vue-router";
import {required} from "../utils/validators.ts";
import {useFetch} from "@vueuse/core";
import {useSnackBar} from "../stores/snackBarStore.ts";
import {useAuth} from "../stores/authStore.ts";

const {executeMe} = useAuth();

const router = useRouter();
const isValid = ref<boolean>(false);
const email = ref<string>("");
const password = ref<string>("");
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const url = inject<string>('apiUrl') + "/auth/login"
const {addSnackBar} = useSnackBar();

const {execute: login, isFetching: loading, onFetchResponse} = useFetch(url, {
  headers: {Accept: 'application/json'},
  credentials: 'include'
}, {
  immediate: false,
  updateDataOnError: true,
  onFetchError(e) {
    addSnackBar('error', e.data.message);
    return e;
  }
}).post(() => ({
  email: email.value,
  password: password.value,
})).json();

onFetchResponse((response) => {
  response.json().then((data) => {
    if (data.success) {
      executeMe();
      router.push('/');
    }
  });
});
</script>
