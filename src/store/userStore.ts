import {defineStore} from 'pinia'
import {ref} from 'vue'

export const userStore = defineStore('user', () => {
    let user = ref({
        id: '',
        name: '',
        email: '',
        tenantId: '',
    })
    let accounts = ref({})
    let profile_loaded = ref(false)
    let accounts_loaded = ref(false)


    function getData() {
        return user.value
    }

    function getAccounts() {
        return accounts.value
    }

    function setAccounts(data: any) {
        accounts.value = data
        accounts_loaded.value = true
    }

    function setUser(data: any) {
        user.value.id = data.id
        user.value.name = data.name
        user.value.email = data.email
        user.value.tenantId = data.tenantId
        profile_loaded.value = true
    }
    function setProfileloaded(val: boolean) {
        profile_loaded.value = val
    }

    return {user, accounts, profile_loaded, accounts_loaded, getData, getAccounts, setUser, setAccounts}
})

