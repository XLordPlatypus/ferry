import {createVuetify} from 'vuetify'
import * as components from "vuetify/components";
import {VDateInput} from 'vuetify/labs/VDateInput'
import * as directives from "vuetify/directives";
import 'vuetify/styles/main.css';
import '@mdi/font/css/materialdesignicons.css';

export default createVuetify({
    defaults: {
        global: {
            rounded: 'lg',
            elevation: 0,
            border: 0,
        },
        VTextField: {
            variant: 'solo-filled',
            color: 'primary'
        },
        VBtn: {
            variant: 'flat'
        },
        VDateInput: {
            variant: 'solo-filled',
            color: 'primary'
        },
        VSelect: {
            variant: 'solo-filled',
            color: 'primary'
        },
        VCombobox: {
            variant: 'solo-filled',
            color: 'primary'
        },
        VSlider: {
            color: 'primary'
        }
    },
    theme: {
        defaultTheme: 'dark', // Standard: Darkmode
        themes: {
            dark: {
                dark: true, // Darkmode
                colors: {
                    primary: '#cba6f7',
                    secondary: '#a6f7cb',
                    background: '#000000',
                    surface: '#151515',
                    error: '#f38ba8',
                    info: '#89dceb',
                    success: '#a6e3a1',
                    warning: '#f9e2af',
                },
            },
            light: {
                dark: false, // Lightmode
                colors: {
                    primary: '#cba6f7',
                    secondary: '#84ddac',
                    background: '#FFFFFF',
                    surface: '#ecebf3',
                    error: '#f38ba8',
                    info: '#89dceb',
                    success: '#a6e3a1',
                    warning: '#f9e2af',
                },
            },
        },
    },
    components: {
        ...components,
        VDateInput,
    },
    directives,
})