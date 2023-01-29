import App from './layouts/App.vue'
import Auth from './layouts/Auth.vue'

import Dashboard from './pages/Dashboard.vue'
import Login from './pages/Login.vue'

export const routes = [
    {
        path: '/',
        component: App,
        meta: {title: 'Dashboard', description: 'Dashboard', requiresAuth: true},
        children: [
            {
                path: '',
                name: 'dashboard',
                component: Dashboard,
                meta: {title: 'Dashboard', description: 'Dashboard', requiresAuth: true},
            },
            {
                path: '/dashboard',
                name: 'dashboard',
                component: Dashboard,
                meta: {title: 'Dashboard', description: 'Dashboard', requiresAuth: true},
            },
        ],
    },
    {
        path: '/auth',
        component: Auth,
        children: [
            {
                path: '/login',
                name: 'login',
                component: Login,
                meta: {title: 'Login', description: 'Reports', requiresAuth: false},
            },
        ],
    },
]

