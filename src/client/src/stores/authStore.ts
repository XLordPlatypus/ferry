import {computed, inject} from 'vue';
import {defineStore} from 'pinia';
import {useFetch} from "@vueuse/core";
import router from "../router.ts";

export const useAuth = defineStore('auth', () => {
    const url = inject<string>('apiUrl') + "/auth";

    const {data, isFetching: loading, execute: executeMe} = useFetch(url + "/me",
        {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
        }).get().json();

    const {execute: logout, onFetchResponse} = useFetch(
        url + "/logout",
        {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        },
        {
            immediate: false
        }
    ).post();

    onFetchResponse((response) => {
        response.json().then((data) => {
            if (data.success) {
                executeMe();
                router.push('/');
            }
        });
    });

    const isAuthenticated = computed(() => data.value ? data.value?.success : false);

    return {
        data,
        isAuthenticated,
        loading,
        executeMe,
        logout
    };
});
