import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router';
import Home from './view/Home.vue';
import Login from './view/Login.vue';
import Signup from "./view/Signup.vue";
import Trips from "./view/Trips.vue";
import {storeToRefs} from 'pinia';
import {watch} from 'vue';
import {useAuth} from "./stores/authStore.ts";
import BookTrip from "./view/BookTrip.vue";
import AccountSettings from "./view/AccountSettings.vue";
import MyBookings from "./view/MyBookings.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            footer: false,
        }
    },
    {
        path: '/signup',
        name: 'Signup',
        component: Signup,
        meta: {
            footer: false,
        }
    },
    {
        path: '/trips',
        name: 'Trips',
        component: Trips,
    },
    {
        path: '/trips/:tripId',
        name: 'BookTrip',
        component: BookTrip,
        props: true
    },
    {
        path: '/mybookings',
        name: 'MyBookings',
        component: MyBookings,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/accountSettings',
        name: 'AccountSettings',
        component: AccountSettings,
        meta: {
            footer: false,
            requiresAuth: true
        }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, _from, next) => {
    const auth = useAuth();
    const {isAuthenticated, loading} = storeToRefs(auth);

    if (loading.value) {
        await new Promise<void>(resolve => {
            const unwatch = watch(loading, (newLoading) => {
                if (!newLoading) {
                    unwatch();
                    resolve();
                }
            });
        });
    }

    const requiresAuth = to.meta.requiresAuth === true;

    if (requiresAuth && !isAuthenticated.value) {
        next('/login');
        return;
    }

    if (isAuthenticated.value && (to.path === '/login' || to.path === '/signup')) {
        next('/');
        return;
    }

    next();
});

export default router;