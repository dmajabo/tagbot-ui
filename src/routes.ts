import App from './layouts/App.vue'
import Auth from './layouts/Auth.vue'

import Dashboard from './pages/Dashboard.vue'
import Login from './pages/Login.vue'
import Start from "./pages/Start.vue";
import PageNotFound from "./pages/PageNotFound.vue";
import Statistics from "./pages/Statistics.vue";
import Top10 from "./components/statistics/Top10.vue";
import Resources from "./components/statistics/Resources.vue";
import Coverage from "./components/statistics/Coverage.vue";
import TagManager from "./pages/TagManager.vue";
import CloudAccounts from "./pages/CloudAccounts.vue";
import Settings from "./pages/Settings.vue";
import {Connect} from "vite";
import Connections from './pages/Connections.vue';
import Users from './pages/Users.vue'
import SignUp from './pages/SignUp.vue';

export const routes = [
    {
        path: '/',
        component: App,
        name: 'root',
        meta: {title: 'Dashboard', description: 'Dashboard', requiresAuth: true},
        children: [
            {
                path: '',
                name: 'dashboard',
                component: Dashboard,
                meta: {title: 'Dashboard', description: 'Dashboard', requiresAuth: true},
            },
            {
                path: 'tag-manager',
                name: 'tag-manager',
                component: TagManager,
                meta: {title: 'Tag Manager', description: 'Tag Manager', requiresAuth: true},
            },
            {
                path: 'cloud-accounts',
                name: 'cloud-accounts',
                component: CloudAccounts,
                meta: {title: 'Cloud Accounts', description: 'Cloud Accounts', requiresAuth: true},
            },
            {
                path: 'settings',
                name: 'settings',
                component: Settings,
                meta: {title: 'Settings', description: 'Settings', requiresAuth: true},
            },
            {
                path: 'connections',
                name: 'connections',
                component: Connections,
                meta: {title: 'Connections', description: 'Connections', requiresAuth: true},
            },
            {
                path: '/statistics',
                component: Statistics,
                meta: {title: 'Statistics', description: 'Statistics', requiresAuth: true},
                children: [
                    {
                        path: '',
                        name: 'statistics',
                        component: Top10,
                        meta: {title: 'Top 10 Tags', description: 'Statistics', requiresAuth: true},
                    },
                    {
                        path: 'statistics/resources',
                        name: 'resources',
                        component: Resources,
                        meta: {title: 'Resources', description: 'Statistics', requiresAuth: true},
                    },
                    {
                        path: 'statistics/coverage',
                        name: 'coverage',
                        component: Coverage,
                        meta: {title: 'Tag Coverage', description: 'Statistics', requiresAuth: true},
                    }
                ]
            },
            {
              path: 'user-view',
              name: 'user-view',
              component: Users,
              meta: {title: 'User view', description: 'User view', requiresAuth: true},
          }
        ],
    },
    {
        path: '/get-started',
        component: Start,
        name: 'get-started',
        meta: {title: 'Onboard', description: 'Onboard your first account.', requiresAuth: true},
    },
    {
        path: '/auth',
        component: Auth,
        name: 'auth',
        children: [
            {
                path: '/login',
                name: 'login',
                component: Login,
                meta: {title: 'Login', description: 'Login', requiresAuth: false},
            },
            {
              path: '/sign-up',
              name: 'sign-up',
              component: SignUp,
              meta: {title: 'Sign-up', description: 'Sign-up', requiresAuth: false},
            },
        ],
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFound },
]

