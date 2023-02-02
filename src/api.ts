import axios from "axios"
import authService from "./services/auth"
import {userStore} from "./store/userStore";

function Api() {
}

Api.prototype = axios

// @ts-ignore
Api.prototype.install = function (app) {
    var self = this
    app.plugin = self
    app.config.globalProperties.$api = self
}

export function createApi(args: any) {
    // @ts-ignore
    const apiBase = import.meta.env.VITE_API_BASE
    args.handler.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    args.handler.defaults.headers.common['Content-Type'] = 'application/json'
    args.handler.defaults.baseURL = `${apiBase}/api${args.namespace}/`

    args.handler.interceptors.request.use(function (config: any) {
        config.headers['Authorization'] = 'Bearer ' + authService.getToken()
        return config
    }, function (error: any) {
        return Promise.reject(error)
    })

    args.handler.interceptors.response.use(
        (response: any) => {
            return response
        },
        (error: any) => {
            switch (error.response.status) {
                case 401:
                    authService.logout(userStore())
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login'
                    }
                    break
            }

            return Promise.reject(error)
        }
    )
    // @ts-ignore
    return new Api()
}
