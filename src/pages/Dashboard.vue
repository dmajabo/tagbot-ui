<template>
  <div class="content-right">
    <!-- {{ resources }} -->
    <div class="title-block">
      <h1 class="page-title">Dashboard</h1>
      <div class="title-buttons">
        <a href="#" class="refresh-button">
          <img src="/img/Icon/download-icon.svg" alt="">
          <span>Download all</span>
        </a>
        <a href="#" class="refresh-button">
          <img src="/img/Icon/refresh-icon.svg" alt="">
          <span>Refresh</span>
        </a>
      </div>
    </div>
    <div class="main-dashboard">
      <div class="dropdown-blocks">
        <div class="flex-dropdown">
          <div class='select-accounts-layout'>
            <span class='dropdown-acc'>Accounts</span>
            <select class="checkbox-dropdown">
              <option value="default" hidden class='default-user-dropdown'>
                All accounts
              </option>
            </select>
          </div>
          <div class='select-accounts-layout'>
            <span class='dropdown-acc'>Users</span>
            <div class="checkbox-dropdown">
              All users
            </div>
          </div>
          <a href="#" class="apply">Apply</a>
        </div>
        <div class='sort-dropdown-block'>
          <select class="sort-dropdown" >
            <option class="dropdown-all-acc">Sort: A - Z</option>
            <option class="dropdown-all-acc">Sort: Z - A</option>
          </select>
        </div>
      </div>
      <div class="main-info">
        <div class="info-block">
          <div class="content-info-block">
            <div class="info-email">alma.lawson@example.com</div>
            <div class="info-services">
              <div class="service-block modal-toggle tooltip bottom" tooltip-text="CloudWatch">
                <img src="/img/card/service-1.svg" alt="">
                <span>11</span>
              </div>
            </div>
            <a href="#" class="add-more">and 5 more...</a>
          </div>
          <div class="button-info-block">
            <a href="#" class="download-info">
              <img src="/img/Icon/download-info.svg" alt="">
            </a>
            <a href="#" class="open-info">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.6485 0.751479C11.1799 0.282849 10.4201 0.282849 9.95147 0.751478L6 4.70295L2.04853 0.751477C1.5799 0.282848 0.820101 0.282848 0.351473 0.751477C-0.117157 1.22011 -0.117157 1.9799 0.351472 2.44853L5.15147 7.24853C5.6201 7.71716 6.3799 7.71716 6.84853 7.24853L11.6485 2.44853C12.1172 1.97991 12.1172 1.22011 11.6485 0.751479Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div class="pagination-block">
        <a href="#" class="prev-button">
          <img src="/img/Icon/prev-button.svg" alt="">
          <span class="pagination-button">Previous</span>
        </a>
        <a href="#" class="pagination-number">1 2 3 4 5 6</a>
        <a href="#" class="next-button">
          <span class="pagination-button">Next</span>
          <img src="/img/Icon/next-button.svg" alt="">
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import {userStore} from "../store/userStore"

export default {
  data() {
    return {
      accounts: {},
      resources: [],
      polling: null
    }
  },
  methods: {
    stopPolling() {
      clearInterval(this.polling)
    },
    pollProfileReady () {
      const userData = userStore()
      var self = this
      this.polling = setInterval(() => {
        if(userData.profile_loaded===true){
          self.stopPolling()
          console.log("Profile ready.")
          self.user = userData.getData()
          self.loadAccounts()
          self.loadResources()
        }
      }, 3000)
    },
    loadAccounts() {
      console.log("Loading accounts...")
      var self = this
      const ustore = userStore()
      const userData = ustore.getData()
      this.$api.get('users/' + userData.id + '/accounts').then((response) => {
        ustore.setUserAccounts(response.data)
        self.$mitt.emit('accounts-loaded', {})
      }).catch((error) => {
        // console.log(error)
        this.$toast.error(error.message)
      })
    },
    loadResources() {
      var self = this
      const ustore = userStore()
      const userData = ustore.getData()
      this.$api.post('tenants/' + userData.tenantId + '/analytics/resourcesPerUser').then((response) => {
        console.log(response)
        self.resources = response.data
      }).catch((error) => {
        this.$toast.error(error.message)
      })
    }
  },
  created() {
    this.pollProfileReady()
  },
  components: {}
}
</script>
