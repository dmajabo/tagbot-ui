// @ts-ignore
import Cookies from 'js-cookie'
import {userStore} from '../store/userStore'

Cookies.defaults = {
    path: '/'
}

const authService = {
    isAuthenticated: function () {
        return Cookies.get('token')
    },

    getToken: function () {
        if (this.isMasqueraded()) {
            return this.getMasqueradedToken()
        }
        return Cookies.get('token')
    },

    login: function (pinia:any, response:any, remember:boolean) {
        // remember for 30 days if wanted, else 1 day
        var options = remember ? { expires: 60 * 60 * 24 * 30 } : { expires: 60 * 60 * 24 }
        Cookies.set('token', response.data.token, options)
        const ustore = userStore(pinia)
        ustore.user = response.data
    },

    setUser: function(pinia:any, response:any) {
        const ustore = userStore(pinia)
        ustore.user = response.data
    },

    logout: function (pinia:any) {
        Cookies.expire('token')
        Cookies.expire('masqueraded')
        window.localStorage.clear()
        const ustore = userStore(pinia)
        ustore.user = {data: {name: '', 'email': '', tenantId: ''}}
    },

    masquerade: function (profile:any) {
        Cookies.set('masqueraded', profile.token)
        window.location.href = '/'
    },

    isMasqueraded: function () {
        return Cookies.get('masqueraded')
    },

    getMasqueradedToken: function () {
        return Cookies.get('masqueraded')
    },

    unmask: function () {
        Cookies.expire('masqueraded')
        window.location.href = '/'
    }
}
export default authService
