<template>
  <div id="root">
    <header class="header-section">
      <div class="content flex-header">
        <div class="left-header"><a class="logotype" href="#" @click.prevent="goto('dashboard')">
          <div class="tag-logo">Tag</div>
          <div class="bot-logo">Bot</div>
        </a></div>
        <div class="burger-menu">
          <div class="bar"><span class="bar-1"></span><span class="bar-2"></span><span class="bar-3"></span></div>
        </div>
        <div class="right-header">
          <div></div>
        </div>
      </div>
    </header>
    <main>
      <section class="step-section flex-step">
        <div class="left-step">
          <div class="ls-content">
            <div class="title-ls">{{ $t('onboard.title') }}</div>
            <div class="steps-block">
              <div :class="getStepContentClass(1)">
                <div><input type="checkbox" readonly v-model="stepOneChecked" class="step-checkbox"></div>
                <div>
                  <div class="number-step">{{ $t('onboard.step_1') }}</div>
                  <div class="ask-step">{{ $t('onboard.choose_cloud') }}</div>
                </div>
              </div>
              <div :class="getStepContentClass(2)">
                <div><input type="checkbox" readonly v-model="stepTwoChecked" class="step-checkbox"></div>
                <div>
                  <div class="number-step">{{ $t('onboard.step_2') }}</div>
                  <div class="ask-step">{{ $t('onboard.onboard_cloud') }}</div>
                </div>
              </div>
              <div :class="getStepContentClass(3)">
                <div><input type="checkbox" readonly v-model="stepThreeChecked" class="step-checkbox"></div>
                <div>
                  <div class="number-step">{{ $t('onboard.step_3') }}</div>
                  <div class="ask-step">{{ $t('onboard.choose_tags') }}</div>
                </div>
              </div>
              <div :class="getStepContentClass(4)">
                <div><input type="checkbox" v-model="stepFourChecked" class="step-checkbox"></div>
                <div>
                  <div class="number-step">{{ $t('onboard.step_4') }}</div>
                  <div class="ask-step">{{ $t('onboard.connect_chat') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right-step">
          <div class="rs-content">
            <form action="#">
              <div class="step-1" :style="getStepStyle(1)">
                <div class="step-content active mobile-step">
                  <div><input type="checkbox" class="step-checkbox"></div>
                  <div>
                    <div class="number-step">{{ $t('onboard.step_1') }}</div>
                    <div class="ask-step">{{ $t('onboard.choose_cloud') }}</div>
                  </div>
                </div>
                <div>
                  <div class="step-radio-block">
                    <input v-model="cloud" value="aws" id="aws" type="radio" name="radio-group">
                    <label for="aws" class="step-label">
                      <div class="step-label-img"><img
                          src="/img/aws-logo.svg"
                          class="aws" alt="">
                      </div>
                    </label>
                  </div>
                  <div class="step-radio-block">
                    <input id="azure" type="radio" name="radio-group" v-model="cloud" value="azure">
                    <label for="azure" class="step-label">
                      <div class="step-label-img"><img
                          src="/img/azure-logo.svg"
                          class="azure" alt="">
                      </div>
                    </label></div>
                  <div class="step-radio-block">
                    <input id="gcloud" type="radio" name="radio-group" v-model="cloud" value="gcloud">
                    <label for="gcloud" class="step-label">
                      <div class="step-label-img">
                        <img
                            src="/img/gcloud-logo.svg"
                            class="gcloud" alt="">
                      </div>
                    </label>
                  </div>
                </div>
                <div>
                  <button class="step-submit" @click.prevent="submitStepOne()">{{ $t('onboard.next_step') }}</button>
                </div>
              </div>
              <div class="step-2" :style="getStepStyle(2)">
                <div :class="getStepContentClassMulti(2)">
                  <div><input readonly="" type="checkbox" class="step-checkbox"></div>
                  <div>
                    <div class="number-step">{{ $t('onboard.step_2') }}</div>
                    <div class="ask-step">{{ $t('onboard.onboard_cloud') }}</div>
                  </div>
                </div>
                <div class="step-bg">
                  <div class="flex-welcome"><span class="weclome-to">{{ $t('onboard.onboard_your_cloud') }}</span></div>
                  <p class="text-form">{{ $t('onboard.onboard_guide') }}</p>
                  <div>
                    <div style="margin-top: 16px; margin-bottom: 16px; display: flex; align-items: center;"><span
                        style="flex: 1 1 0%; margin-top: 24px;">{{ $t('onboard.account_number') }}</span>
                      <input type="text" class="input-form" name="aws-account-number" v-model="account_id"
                             style="flex: 1 1 0%;">
                    </div>
                    <div><span class="span-error">{{ accountNumberPromptText }}</span></div>
                  </div>
                  <el-button class="onboard-button" @click.prevent="onboardAccount()" :loading="loading" type="primary">
                    {{ $t('onboard.login') }}
                  </el-button>
                  <p class="text-form">{{ $t('onboard.no_access') }} <span class="bold">{{
                      $t("onboard.aws_account")
                    }}?</span></p>
                  <p class="text-form">{{ $t("onboard.try") }} <span class="bold">TagBot</span>
                    {{ $t('onboard.any_account') }}.</p>
                  <div class="flex-sbs"><a href="#!">{{ $t('onboard.step_guide') }} </a><a
                      href="#!">{{ $t('onboard.template_explain') }}</a>
                  </div>
                </div>
                <div></div>
              </div>
              <div class="step-3_1" :style="getStepStyle(31)">
                <div :class="getStepContentClassMulti(31)">
                  <div><input readonly="" type="checkbox" class="step-checkbox"></div>
                  <div>
                    <div class="number-step">{{ $t('onboard.step_3') }}</div>
                    <div class="ask-step">{{ $t('onboard.choose_tags') }}</div>
                  </div>
                </div>
                <div class="step-bg">
                  <div class="flex-welcome"><span class="weclome-to">{{ $t('onboard.choose_tags') }}</span></div>
                  <div class="have-standart">{{ $t("onboard.have_tag_standards") }}</div>
                  <div class="flex-radio"><p>
                    <input type="radio" id="yes" v-model="has_tag_standard" value="true" name="radio-group">
                    <label for="yes">{{ $t('common.yes') }}</label></p>
                    <p><input type="radio" id="no" name="radio-group" v-model="has_tag_standard" value="false">
                      <label for="no">{{ $t('common.no') }}</label></p></div>
                </div>
                <div>
                  <button class="step-submit" @click.prevent="tagStep()">{{ $t('onboard.next_step') }}</button>
                </div>
              </div>
            </form>
            <div class="step-3_2" :style="getStepStyle(32)">
              <div :class="getStepContentClassMulti(32)">
                <div><input type="checkbox" class="step-checkbox" readonly=""></div>
                <div>
                  <div class="number-step">{{ $t('onboard.step_3') }}</div>
                  <div class="ask-step">{{ $t('onboard.choose_tags') }}</div>
                </div>
              </div>
              <div class="step-bg">
                <div class="flex-welcome"><span class="weclome-to">{{ $t('onboard.choose_tags') }}</span></div>
                <form action="#">
                  <div class="have-standart">{{ $t('onboard.have_tag_standards') }}</div>
                  <div class="flex-radio"><p><input type="radio" id="yes32" name="radio-group32" value="true"
                                                    v-model="has_tag_standard"><label
                      for="yes32">{{ $t('common.yes') }}</label></p>
                    <p><input type="radio" id="no32" name="radio-group32" value="false"
                              v-model="has_tag_standard"><label for="no32">{{ $t('common.no') }}</label></p></div>
                </form>
                <div class="key-block"><p class="text-form">{{ $t('onboard.we_provide_tags') }}</p>
                  <div class="flex-key"><a href="#!"><img
                      src="/img/edit.svg" alt=""></a>
                    <div class="tag">component_name</div>
                  </div>
                  <div class="flex-key"><a href="#!"><img
                      src="/img/edit.svg" alt=""></a>
                    <div class="tag">Name</div>
                  </div>
                  <div class="flex-key"><a href="#!"><img
                      src="/img/edit.svg" alt=""></a>
                    <div class="tag">creator</div>
                  </div>
                </div>
              </div>
              <div>
                <button class="step-submit" @click.prevent="goToStepChat()">Next step</button>
              </div>
            </div>
            <div class="step-3_3" :style="getStepStyle(33)">
              <div :class="getStepContentClassMulti(33)">
                <div><input readonly="" type="checkbox" class="step-checkbox"></div>
                <div>
                  <div class="number-step">Step 3</div>
                  <div class="ask-step">Choose your tags</div>
                </div>
              </div>
              <div class="step-bg">
                <div class="flex-welcome"><span class="weclome-to">{{ $t('onboard.choose_tags') }}</span></div>
                <form action="#">
                  <div class="have-standart">{{ $t('onboard.have_tag_standards') }}</div>
                  <div class="flex-radio"><p><input type="radio" id="yes33" name="radio-group33" value="true"
                                                    v-model="has_tag_standard"><label
                      for="yes33">{{ $t('common.yes') }}</label></p>
                    <p><input type="radio" id="no33" name="radio-group33" value="false"
                              v-model="has_tag_standard"><label for="no33">{{ $t('common.no') }}</label></p>
                  </div>
                </form>
                <div class="key-block">
                  <div class="flex-key-value">
                    <div class="block-pswrd">
                      <div class="placeholder-container"><input id="input-0" type="text" class="focus-input"
                                                                placeholder=" " value=""><label>{{
                          $t('onboard.enter_key')
                        }} </label><span
                          class="show-password" style="cursor: pointer;"><img
                          src="/img/close.svg"
                          alt=""></span></div>
                    </div>
                    <span style="cursor: pointer;"><img
                        src="/img/delete.svg"
                        alt=""></span></div>
                  <span class="new-tag" style="cursor: pointer;"><img
                      src="/img/plus.svg" alt=""><span>{{ $t('onboard.new_tag') }}</span></span>
                </div>
              </div>
              <div>
                <button class="step-submit" @click.prevent="goToStepChat()">{{ $t('onboard.next_step') }}</button>
              </div>
            </div>
            <div class="step-4" :style="getStepStyle(4)">
              <div :class="getStepContentClassMulti(4)">
                <div><input type="checkbox" class="step-checkbox"></div>
                <div>
                  <div class="number-step">{{ $t('onboard.step_4') }}</div>
                  <div class="ask-step">{{ $t('onboard.connect_chat') }}</div>
                </div>
              </div>
              <div>
                <div class="step-radio-block"><input type="radio" id="step4-1" name="radio-group"><label for="step4-1"
                                                                                                         class="step4-label">
                  <div class="step-label-img"><img
                      src="/img/slack-step.svg" alt="">
                  </div>
                </label></div>
                <div class="step-radio-block"><input type="radio" id="step4-2" name="radio-group"><label for="step4-2"
                                                                                                         class="step4-label">
                  <div class="step-label-img"><img
                      src="/img/google-step.svg" alt="">
                  </div>
                </label></div>
                <div class="step-radio-block"><input type="radio" id="step4-3" name="radio-group">
                  <label for="step4-3" class="step4-label">
                    <div class="step-label-img"><img
                        src="/img/gitlab-step.svg" alt="">
                    </div>
                  </label></div>
                <div class="step-radio-block">
                  <input type="radio" id="step4-4" name="radio-group">
                  <label for="step4-4" class="step4-label">
                    <div class="step-label-img"><img
                        src="/img/github-step.svg" alt="">
                    </div>
                  </label></div>
                <div class="step-radio-block">
                  <input type="radio" id="step4-5" name="radio-group">
                  <label for="step4-5" class="step4-label">
                    <div class="step-label-img"><img
                        src="/img/microsoft-step.svg"
                        alt=""></div>
                  </label></div>
              </div>
              <div>
                <button class="step-submit" @click.prevent="goto('cloud-accounts')">{{ $t('onboard.finish') }}</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
<script>
import {userStore} from "../store/userStore";

export default {
  data() {
    return {
      major_step: 1,
      minor_step: 1,
      cloud: undefined,
      account_id: undefined,
      has_tag_standard: true,
      polling: null,
      stop_polling: 0,
      has_conflict: false,
      tags: [],
      loading: false,
      stepOneChecked: false,
      stepTwoChecked: false,
      stepThreeChecked: false,
      stepFourChecked: false,
    }
  },
  computed: {
    accountNumberPromptText() {
      if (!this.awsAccountIsValid()) {
        return this.$t('onboard.account_invalid')
      }
      return ""
    }
  },

  methods: {
    submitStepOne() {
      if (this.cloud === undefined) {
        this.$toast.error(this.$t('onboard.must_choose_cloud'))
        return
      }
      if (this.cloud !== 'aws') {
        this.$toast.error(this.$t('onboard.aws_only'))
        return
      }
      this.major_step = 2
      var self = this
      this.$nextTick(function () {
        self.stepOneChecked = true
      })
      return true
    },
    generateUUIDv4() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    },
    onboardAccount() {
      if (this.awsAccountIsValid()) {
        let uuid = this.generateUUIDv4()
        const stackName = 'Tagbot-prod-' + uuid
        const cfTemplateUrl = import.meta.env.VITE_CF_TEMPLATE
        const awsCloudFormationUrl = 'https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?stackName=' + stackName + '&templateURL=' + cfTemplateUrl
        window.open(awsCloudFormationUrl)
        this.loading = true
        this.createAccount()
      } else {
        this.$toast.error(this.$t('onboard.account_invalid'))
      }
    },
    tagStep() {
      if (this.has_tag_standard === "true") {
        this.major_step = 33
      } else {
        this.major_step = 32
      }
    },
    goToStepChat() {
      this.stepThreeChecked = true
      this.major_step = 4
    },
    createAccount() {
      console.log("Loading accounts...")
      var self = this
      const userData = userStore().getData()
      this.$api.post('users/' + userData.id + '/accounts/create', {accountNumber: this.account_id}).then((response) => {
        self.$toast.success("Account registered.")
        self.pollVerify()
      }).catch((error) => {
        // console.log(error)
        if (error.response.status === 409) {
          self.has_conflict = true
          console.log("Conflict, but trying to verify.")
          self.pollVerify()
        }
        this.$toast.error(error.response.data)
      })
    },
    triggerCollection() {
      const userData = userStore().getData()
      this.$api.post('tenants/' + userData.tenantId + '/accounts/' + this.account_id + '/collect', {accountNumber: this.account_id}).then((response) => {
        console.log('collection triggered.')
      }).catch((error) => {
        console.log(error)
      })
    },
    stopPolling(success = true) {
      this.stop_polling = this.stop_polling + 1
      clearInterval(this.polling)
      this.loading = false
      if (this.stop_polling === 1 && success === true) {
        this.stepTwoChecked = true
        this.triggerCollection()
      }
    },
    pollVerify() {
      const userData = userStore().getData()
      var self = this
      var success = 0
      var retries = 20
      this.polling = setInterval(() => {
        retries = retries - 1
        if (retries === 0 || success === 1) {
          self.stopPolling()
          return false
        }
        this.$api.get('tenants/' + userData.tenantId + '/accounts/' + this.account_id + '/verify-onboard').then((response) => {
          success = success + 1
          if (success === 1) {
            self.$toast.success("Account onboarded!")
          }
          self.stopPolling()
          self.major_step = 31
        }).catch((error) => {
          self.stopPolling(false)
          console.log("Verification unsuccessful.")
          self.$toast.error("You are not authorized to onboard this account. Please try another account.")
        })
      }, 3000)
    },
    getStepContentClass(step) {
      let major_step = this.major_step
      if (major_step === 3 || major_step === 31 || major_step === 32 || major_step === 33) {
        major_step = 3
      }
      if (step === major_step) {
        return 'step-content active'
      }
      return 'step-content disabled'
    },
    getStepContentClassMulti(step) {
      if (step === this.major_step) {
        return 'step-content active mobile-step'
      }
      return 'step-content disabled mobile-step'
    },
    getStepStyle(step) {
      if (step === this.major_step) {
        return 'display: block; opacity: 1;'
      }
      return 'display: none; opacity: 1;'
    },
    awsAccountIsValid() {
      return this.account_id !== undefined && this.account_id !== '' && this.account_id.length === 12
    },
    goto(route) {
      this.$goTo(route)
    }
  }
}
</script>

<style scoped lang="css">
.span-error {
  color: red;
  font-size: .8em;
}
</style>