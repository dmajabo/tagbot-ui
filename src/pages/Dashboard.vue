<template>
    <div>
    </div>
</template>

<script>
import {userStore} from "../store/userStore"

export default {
    data() {
        return {

        }
    },
    mounted() {
        const ustore = userStore()
        var self = this
        this.$mitt.on('profile-loaded', (evt) => {
            self.userdata = ustore.user.data
        })
        if(self.userdata == null || self.userdata.data.name === '') {
            self.userdata = ustore.user.data
        }
    },
    components: {
    }
}
</script>
