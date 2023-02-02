<template>
  <div class="content" style="margin: 0px;">
    <div class="flex-title">
      <h1 class="title-dashboard">{{ $t('common.cloud_accounts') }}</h1>
      <span @click.prevent="showOnboardingModal()" class="add-user-button cloud-button" style="cursor: pointer;"><img src="/img/plus.svg" alt="">
        <span>{{ $t('common.add_account') }}</span>
      </span>
    </div>

    <div class="table-block">
      <table class="main-table" cellspacing="5">
        <tbody>
        <tr class="title-row">
          <td>{{ $t('common.account_id') }}</td>
          <td>{{ $t('common.status') }}</td>
          <td style="width: 100px;"></td>
        </tr>
        <tr v-for="account in accounts" class="text-row">
          <td>{{ account.accountNumber }}</td>
          <td>
            <span class="ant-tag ant-tag-has-color css-k83k30" :style="'background-color: rgb(' + getStatus(account.onboarded).color + ');'">{{ getStatus(account.onboarded).text }}</span>
          </td>
          <td>
            <div style="display: flex; flex-direction: row; justify-content: flex-end;">
              <button type="button" class="ant-btn css-k83k30 ant-btn-primary ant-btn-icon-only ant-btn-loading" v-if="account.onboarded===false">
                <span class="ant-btn-loading-icon">
                <span role="img" aria-label="loading" class="anticon anticon-loading anticon-spin">
                  <svg viewBox="0 0 1024 1024" focusable="false" data-icon="loading" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                    <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
                  </svg>
                </span>
                </span>
              </button>
              <button type="button" class="ant-btn css-k83k30 ant-btn-default ant-btn-icon-only ant-btn-dangerous" style="margin-left: 16px;" @click.prevent="deleteAccount(item)">
                <span role="img" aria-label="delete" class="anticon anticon-delete">
                <svg
                  viewBox="64 64 896 896" focusable="false" data-icon="delete" width="1em" height="1em"
                  fill="currentColor" aria-hidden="true"><path
                  d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path></svg></span>
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <a-modal v-model:visible="onboardingModal" title="Onboard a new account." @ok="onboardAccount" :confirmLoading="onboardLoading">
      <a-input v-model:value="onboardAccountId" placeholder="Account ID" />
    </a-modal>
  </div>
</template>

<script>
import {userStore} from "../store/userStore";

export default {
  data() {
    return {
      user: {},
      accounts: [],
      polling: null,
      polling_onboarded: null,
      stop_polling_onboarded: 0,
      onboardAccountId: null,
      onboardingModal: false,
      onboardLoading: false,
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
      return this.onboardAccountId !== null && this.onboardAccountId !== '' && this.onboardAccountId.length === 12
    },
    stopPollingOnboarded() {
      this.stop_polling_onboarded = this.stop_polling_onboarded + 1
      clearInterval(this.polling_onboarded)
      if(this.stop_polling_onboarded === 1) {
        this.triggerCollection()
      }
    },
    pollVerify () {
      const userData = userStore().getData()
      var self = this
      var success = 0
      this.polling_onboarded = setInterval(() => {
        this.$api.get('tenants/' + userData.tenantId + '/accounts/' + this.onboardAccountId + '/verifyOnboard').then((response) => {
          success = success + 1
          if(success === 1) {
            self.$toast.success("Account onboarded!")
          }
          self.stopPollingOnboarded()
        }).catch((error) => {
          console.log("Verification unsuccessful.")
          self.$toast.error("Account cannot be onboarded.")
          self.finishOnboarding()
          self.stopPollingOnboarded()
        })
      }, 3000)
    },
    finishOnboarding() {
      this.onboardingModal = false
      this.onboardLoading = false
      this.onboardAccountId = null
      this.polling_onboarded = null
      this.stop_polling_onboarded = 0
      this.loadAccounts()
    },
    createAccount() {
      var self = this
      const userData = userStore().getData()
      this.$api.post('users/' + userData.id + '/accounts/create', {accountNumber: this.onboardAccountId}).then((response) => {
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
      this.$api.post('tenants/' + userData.tenantId + '/accounts/' + this.onboardAccountId + '/collect', {accountNumber: this.onboardAccountId}).then((response) => {
        console.log('collection triggered.')
        this.finishOnboarding()
      }).catch((error) => {
        console.log(error)
        this.finishOnboarding()
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
        return {color: "12 179 78", text: "Onboarded"}
      }
      return {color: "230, 173, 41", text: "Onboarding"}
    },
    loadAccounts() {
      console.log("Loading accounts...")
      var self = this
      this.$api.get('users/' + this.user.id + '/accounts').then((response) => {
        // console.log(response)
        self.accounts = response.data
      }).catch((error) => {
        // console.log(error)
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
    this.pollProfileReady()
  },
  components: {
  }
}
</script>

<style lang="css">
.cloud-button {
  -webkit-text-size-adjust: 100%;
  align-items: center;
  border-radius: 6px;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  font-family: Montserrat,sans-serif;
  line-height: 1;
  margin: 0;
  text-decoration: none;
}
</style>
