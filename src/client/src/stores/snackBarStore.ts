import {computed, ref} from 'vue';
import {defineStore} from 'pinia';

type SnackBarType = 'error' | 'success' | 'warning';

interface SnackBarItem {
    type: SnackBarType;
    message: string;
    show: boolean;
}

interface ResponseMessage {
    success: boolean;
    data: object;
    message: string;
}

export const useSnackBar = defineStore('snackBar', () => {
    const snackbar = ref<SnackBarItem | null>(null);

    function addSnackBar(type: SnackBarType, message: string) {
        snackbar.value = {type, message, show: true};

        setTimeout(() => {
            removeSnackBar();
        }, 5000);
    }

    function removeSnackBar() {
        if (snackbar.value) {
            snackbar.value.show = false;
            setTimeout(() => {
                snackbar.value = null;
            }, 300);
        }
    }

    function handleResponse(response: ResponseMessage) {
        if (response.success) {
            addSnackBar('success', response.message);
        } else {
            addSnackBar('error', response.message);
        }
    }

    const getSnackBar = computed(() => snackbar.value);

    return {
        getSnackBar,
        addSnackBar,
        removeSnackBar,
        handleResponse,
    };
});
