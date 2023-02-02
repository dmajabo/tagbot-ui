// @ts-ignore
import Cookies from 'js-cookie'
import {userStore} from '../store/userStore'

Cookies.defaults = {
    path: '/'
}

const authService = {
    isAuthenticated: function () {
        return Cookies.get('token') !== undefined
    },
    getToken: function () {
        return Cookies.get('token')
    },
    login: function (pinia: any, response: any, remember: boolean) {
        var options = remember ? {expires: 60 * 60 * 24 * 30} : {expires: 60 * 60 * 24}
        Cookies.set('token', response.data.token, options)
    },
    logout: function (userStore: any) {
        Cookies.remove('token')
        Cookies.remove('masqueraded')
        window.localStorage.clear()
    },
    masquerade: function (profile: any) {
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
