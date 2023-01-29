<template>
    <div>
        <router-view v-slot="{ Component, route }">
            <transition>
                <component :is="Component" :key="route.path" />
            </transition>
        </router-view>
    </div>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    methods: {
    },
    computed: {

    },
    components: {
    }
}
</script>

