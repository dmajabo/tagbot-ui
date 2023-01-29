<template>
    <div>

    </div>
</template>

<script>

import authService from "../services/auth"
import {useToast} from "vue-toastification"
const toast = useToast()

export default {
    data() {
        return {
        }
    },
    computed: {
        pageTitle() {
          return this.$route.meta.title
        },
    },
    methods: {
        goTo(item) {
            this.$router.push({name: item.route})
        },
        signout() {
            authService.logout(this.$pinia)
            this.$router.push({name: 'login'})
        },
    },
    components: {
    },
    created() {
        var self = this
        this.$api.get('me').then((response) => {
            authService.setUser(this.$pinia, response)
            self.$mitt.emit('profile-loaded', {})
        }).catch((error) => {
            console.log(error)
            toast.error(error.response.data.message)
        })
    }
}
</script>

<style lang="scss">
    .slide-fade-enter-active {
        transition: all 0.3s ease-out;
    }

    .slide-fade-leave-active {
        transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-enter-from,
    .slide-fade-leave-to {
        transform: translateX(20px);
        opacity: 0;
    }
</style>
