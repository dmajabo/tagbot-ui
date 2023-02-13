<template>
  <div class="content" style="margin: 0px;">
    <div class="flex-title">
      <h1 class="title-dashboard">{{ $t('common.cloud_accounts') }}</h1>
      <span @click.prevent="showOnboardingModal()" class="add-user-button cloud-button" style="cursor: pointer;"><img src="/img/plus.svg" alt="">
        <span>{{ $t('common.add_account') }}</span>
      </span>
    </div>

    <div class="table-block">
      <table class="main-table" v-if="accounts.length > 0">
        <tbody v-if="!loading">
        <tr class="title-row">
          <td>{{ $t('common.account_id') }}</td>
          <td>{{ $t('common.status') }}</td>
          <td style="width: 100px;"></td>
        </tr>

        <tr v-for="account in accounts" class="text-row">
          <td>{{ account.accountNumber }}</td>
          <td>
            <el-tag
                :type="getStatus(account.onboarded).type"
                class="mx-1"
                effect="dark"
            >{{ getStatus(account.onboarded).text }}</el-tag>
          </td>
          <td>
            <div style="display: flex; flex-direction: row; justify-content: flex-end;">
              <el-button type="warning" :icon="starIcon" v-if="account.onboarded === false" circle />
              <el-button type="danger" :icon="deleteIcon" circle @click.prevent="deleteAccount(account)" />
            </div>
          </td>
        </tr>


        </tbody>
      </table>

      <el-skeleton v-if="loading" :rows="5" animated />

      <Empty
          v-if="accounts.length === 0 && !loading"
          :title="$t('common.no_accounts')"
          :detail="$t('common.start_onboarding')"
          button_link="get-started"
          :button_text="$t('common.get_started')"
      ></Empty>
    </div>

    <el-dialog v-model="onboardingModal" title="Onboard an Account" width="30%" center>
      <el-form :model="onboardingForm">
        <el-form-item label="Valid Account ID">
          <el-input v-model="onboardingForm.onboardAccountId" autocomplete="off" :disabled="onboardLoading" />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="onboardingModal = false" :disabled="onboardLoading">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click.prevent="onboardAccount()" :loading="onboardLoading" :disabled="onboardLoading">
          {{ $t('common.onboard') }}
        </el-button>
      </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import {userStore} from "../store/userStore"
import Empty from "../components/common/Empty.vue";
import {
  Delete,
  Star
} from '@element-plus/icons-vue'

export default {
  data() {
    return {
      user: {},
      accounts: [],
      polling: null,
      polling_onboarded: null,
      stop_polling_onboarded: 0,
      onboardingModal: false,
      onboardLoading: false,
      loading: true,
      onboardingForm: {
        onboardAccountId: null,
      }
    }
  },
  computed: {
    deleteIcon() {
      return Delete
    },
    starIcon() {
      return Star
    }
  },
  methods: {
    showOnboardingModal() {
      this.onboardingModal = !this.onboardingModal
    },
    generateUUIDv4() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    },
    awsAccountIsValid() {
      return this.onboardingForm.onboardAccountId !== null && this.onboardingForm.onboardAccountId !== '' && this.onboardingForm.onboardAccountId.length === 12
    },
    stopPollingOnboarded() {
      this.stop_polling_onboarded = this.stop_polling_onboarded + 1
      clearInterval(this.polling_onboarded)
    },
    pollVerify () {
      const userData = userStore().getData()
      var self = this
      var success = 0
      var retries = 20
      this.polling_onboarded = setInterval(() => {
        retries = retries - 1
        if(retries === 0 || success === 1) {
          self.stopPollingOnboarded()
          return false
        }
        this.$api.get('tenants/' + userData.tenantId + '/accounts/' + this.onboardingForm.onboardAccountId + '/verify-onboard').then((response) => {
          success = success + 1
          if(success === 1) {
            self.$toast.success("Account onboarded!")
            self.stopPollingOnboarded()
            self.finishOnboarding()
          }
        }).catch((error) => {
          console.log("Not onboarded yet...")
        })
      }, 5000)
    },
    finishOnboarding() {
      this.onboardingModal = false
      this.onboardLoading = false
      this.polling_onboarded = null
      this.stop_polling_onboarded = 0
      this.loadAccounts()
      this.triggerCollection()
      this.onboardingForm.onboardAccountId = null
    },
    createAccount() {
      var self = this
      const userData = userStore().getData()
      this.$api.post('users/' + userData.id + '/accounts/create', {accountNumber: this.onboardingForm.onboardAccountId}).then((response) => {
        self.$toast.success("Account registered.")
        self.pollVerify()
      }).catch((error) => {
        // console.log(error)
        if(error.response.status === 409) {
          self.has_conflict = true
          console.log("Conflict, but trying to verify.")
          self.pollVerify()
        }
        this.$toast.error(error.response.data)
      })
    },
    triggerCollection() {
      var self = this
      const userData = userStore().getData()
      this.$api.post('tenants/' + userData.tenantId + '/accounts/' + this.onboardingForm.onboardAccountId + '/collect', {accountNumber: this.onboardingForm.onboardAccountId}).then((response) => {
        console.log('collection triggered.')
      }).catch((error) => {
        console.log(error)
      })
    },
    onboardAccount() {
      if(this.awsAccountIsValid()) {
        this.onboardLoading = true
        let uuid = this.generateUUIDv4()
        const stackName = 'Tagbot-prod-' + uuid
        const cfTemplateUrl = import.meta.env.VITE_CF_TEMPLATE
        const awsCloudFormationUrl = 'https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?stackName=' + stackName + '&templateURL=' + cfTemplateUrl
        window.open(awsCloudFormationUrl)
        this.createAccount()
      } else {
        this.$toast.error(this.$t('onboard.account_invalid'))
      }
    },
    deleteAccount(item) {
      // silence
    },
    getStatus(status) {
      if (status === true) {
        return {'type': 'success', 'text': 'Onboarded'}
      }
      return {'type': 'warning', 'text': 'Pending'}
    },
    loadAccounts() {
      console.log("Loading accounts...")
      var self = this
      self.loading = true
      this.$api.get('users/' + this.user.id + '/accounts').then((response) => {
        // console.log(response)
        self.accounts = response.data
        self.loading = false
      }).catch((error) => {
        // console.log(error)
        self.loading = false
        this.$toast.error(error.message)
      })
    },
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
        }
      }, 3000)
    },
  },
  mounted() {
    this.loading = true
    this.pollProfileReady()
  },
  components: {
    Empty,
    Delete,
    Star
  }
}
</script>

<style lang="css" scoped>
.cloud-button {
  -webkit-text-size-adjust: 100%;
  align-items: center;
  border-radius: 6px;
  box-sizing: border-box;
  cursor: pointer;
  display: flex !important;
  font-family: Montserrat,sans-serif;
  line-height: 1;
  margin: 0;
  text-decoration: none;
}

.el-skeleton {
 padding-left: 0;
 padding-right: 0;
}
</style>
