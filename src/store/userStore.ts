import {defineStore} from 'pinia'
import {ref} from 'vue'

export const userStore = defineStore('user', () => {
    const user = ref({
        id: '',
        name: '',
        email: '',
        tenantId: '',
    })
    const profile_loaded = ref(false)
    const accounts = ref({})

    function getData() {
        return user.value
    }

    function getAccounts() {
        return accounts.value
    }

    function setUserInfo(data: any) {
        user.value.id = data.id
        user.value.name = data.name
        user.value.email = data.email
        user.value.tenantId = data.tenantId
    }
    function setProfileLoaded(val: boolean) {
        profile_loaded.value = val
    }
    function setUserAccounts(data: any) {
        accounts.value = data
    }

    return {user, accounts, profile_loaded, setProfileLoaded, getData, getAccounts, setUserInfo, setUserAccounts}
})

