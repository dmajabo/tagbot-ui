import { defineStore } from 'pinia'
import {ref} from 'vue'

export const userStore = defineStore('user', () => {
    const user = ref({
        data: {
            name: '',
            email: '',
            tenantId: ''
        }
    })
    return {user}
})

