import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia} from "pinia";
import vuetify from "./vuetify";
import router from "./router";


const pinia = createPinia()

const app = createApp(App);
app.use(vuetify);
app.use(router);
app.use(pinia);

app.provide('apiUrl', 'http://localhost:3000')

app.mount("#app");
