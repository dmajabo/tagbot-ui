<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-10" @close="open = false">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full w-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-2 sm:w-full sm:p-6">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Account ID</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Resource Name</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Resource ID</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Region</th>
                </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white" v-if="!loading">
                  <tr v-for="item in resources" :key="item.resource_id">
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ item.account_id }}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ item.name }}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ item.resource_id }}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ item.region }}</td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <BulletListLoader></BulletListLoader>
                </tbody>
              </table>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
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
      this.$api.post('tenants/' + this.tenant + '/analytics/resourceTypePerUser', { userName: this.user, resourceType: this.type }).then((response) => {
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
      console.log(self.tenant)
      console.log(self.type)
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
