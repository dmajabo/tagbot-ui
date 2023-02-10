<template>
  <el-dialog v-model="open" :title="type">
    <el-skeleton :rows="5" v-if="loading" />
    <el-table border stripe flexible v-else :data="resources">
      <el-table-column property="account_id" label="Account ID" width="150" />
      <el-table-column property="name" label="Resource Name" width="200" />
      <el-table-column property="resource_id" label="Resource ID" />
      <el-table-column property="region" label="Region" />
    </el-table>
  </el-dialog>
</template>

<script>

export default {
  data() {
    return {
      loading: true,
      open: false,
      type: null,
      tenant: null,
      user: null,
      resources: []
    }
  },
  computed: {

  },
  methods: {
    loadResources() {
      var self = this
      this.$api.post('tenants/' + this.tenant + '/analytics/user-resources-by-type', { userName: this.user, resourceType: this.type }).then((response) => {
        // console.log(response)
        self.resources = response.data
        self.loading = false
      }).catch((error) => {
        this.$toast.error(error.message)
      })
    }
  },
  mounted() {
    var self = this
    this.$mitt.on('open-resource-modal', (evt) => {
      self.tenant = evt.tenant
      self.type = evt.type
      self.user = evt.user
      self.resources = []
      self.loading = true
      // console.log(self.tenant)
      // console.log(self.type)
      self.open = true
      self.loadResources()
    })
  },
  created() {
  },
  components: {
  }
}
</script>
