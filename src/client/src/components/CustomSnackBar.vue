<template>
  <v-snackbar
      v-if="getSnackBar !== null"
      v-model="getSnackBar.show"
      :color="getColor(getSnackBar.type)"
      :timeout="5000"
      class="mb-2"
      location="bottom"
  >
    {{ getSnackBar?.message }}
    <template v-slot:actions>
      <v-btn
          icon="mdi-close"
          variant="text"
          @click="removeSnackBar"
      ></v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
import {useSnackBar} from "../stores/snackBarStore";
import {storeToRefs} from "pinia";

const snackBarStore = useSnackBar()
const {getSnackBar} = storeToRefs(snackBarStore)
const {removeSnackBar} = snackBarStore

function getColor(type: 'error' | 'success' | 'warning'): string {
  switch (type) {
    case "error":
      return "error";
    case "success":
      return "success";
    case "warning":
      return "warning";
    default:
      return "info";
  }
}
</script>