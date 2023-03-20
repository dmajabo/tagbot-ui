<template>
  <div id="root">
    <header class="header-section">
      <div class="content flex-header">
        <div class="left-header">
          <a href="#" class="logotype">
            <div class="tag-logo">Tag</div>
            <div class="bot-logo">[Bot]</div>
          </a>
        </div>
        <div class="burger-menu">
          <div class="bar">
            <span class="bar-1"></span><span class="bar-2"></span
            ><span class="bar-3"></span>
          </div>
        </div>
        <div class="right-header">
          <div></div>
        </div>
      </div>
    </header>
    <main>
      <section class="main-section">
        <div class="content flex-main">
          <div>
            <h1 class="title">{{ $t('site.slogan') }}</h1>
            <div class="main-form-block">
              <div class="flex-welcome">
                <span class="weclome-to">{{ $t('site.welcome') }}</span
                ><a href="#" class="logotype">
                  <div class="tag-logo">Tag</div>
                  <div class="bot-logo">Bot</div>
                </a>
              </div>
              <p class="text-form">{{ $t('site.tagline') }}</p>
              <form autocomplete="off" class="main-form">
                <div>
                  <input
                    type="text"
                    class="input-form"
                    name="email"
                    placeholder="Your email"
                    value=""
                    autocomplete=""
                  />
                </div>

                <div class="block-pswrd">
                  <div class="placeholder-container">
                    <input
                      name="password"
                      :type="isPasswordVisible ? 'text' : 'password'"
                      class="focus-input"
                      placeholder=" "
                      value=""
                      autocomplete=""
                    />
                      <label>{{ $t('common.password') }}</label>
                      <div tabindex="0" @keyup.enter="toggleVisibilityOfPassword" @click="toggleVisibilityOfPassword" :class="['show-password', isPasswordVisible && 'show-password_visible']">
                        <img src="/img/eye.svg" alt="" />
                      </div>
                  </div>
                </div>
                <div class="flex-forgot">
                  <div><input type="checkbox" class="checkbox" /></div>
                  <a href="#" class="forgot-password">{{
                    $t('common.forgot')
                  }}</a>
                </div>
                <div>
                  <input
                    type="submit"
                    name="submit"
                    class="form-submit modal-toggle"
                    value="Sign In"
                  />
                </div>
              </form>
              <div class="signin-block">
                <p class="text-form">{{ $t('common.alt_signin') }}</p>
                <el-button
                  @click.prevent="loginWithGoogle()"
                  class="signin-with"
                  :loading="loading"
                >
                  <img src="/img/google-icon.svg" class="google-icon" alt="" />
                  <span class="google-text">Google</span></el-button
                >
              </div>
              <div class="have-acc">
                <span>{{ $t('common.no_account') }}</span>
                <router-link class="blue" to="/sign-up">
                  {{ $t('common.signup') }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import authService from '../services/auth'
import { googleTokenLogin } from 'vue3-google-login'
import { userStore } from '../store/userStore'

export default {
  data () {
    return {
      email: '',
      password: '',
      remember_me: '',
      loading: false,
      isPasswordVisible: false
    }
  },
  methods: {
    loginWithGoogle () {
      var self = this
      self.loading = true
      googleTokenLogin().then(response => {
        // console.log("Handle the response", response)
        self.verifyGoogleLogin(response)
      })
    },
    verifyGoogleLogin (response) {
      var self = this
      var u = userStore()
      this.$api
        .post('login/google', {
          token: response.access_token
        })
        .then(response => {
          // console.log(response)
          authService.login(self.$pinia, response, this.remember_me)
          self.loadProfile(u)
          self.loading = false
          self.$goTo('dashboard')
        })
        .catch(function (error) {
          // console.log(error)
          self.loading = false
          self.$toast.error(error.response.data)
        })
    },
    login () {
      var self = this
      self.loading = true
      this.$api
        .post('auth/token', {
          email: this.email,
          password: this.password,
          remember_me: this.remember_me
        })
        .then(response => {
          // console.log(response)
          authService.login(this.$pinia, response, this.remember_me)
          // toast.success("Login successful.")
          self.loadProfile()
          self.loading = false
          self.$goTo('dashboard')
        })
        .catch(function (error) {
          // console.log(error)
          self.loading = false
          self.$toast.error(error.response.data)
        })
    },
    loadProfile (ustore) {
      var self = this
      var u = ustore
      this.$api
        .get('profile')
        .then(response => {
          u.setUser(response.data)
          self.loadAccounts(u)
          self.$mitt.emit('profile-loaded', {})
        })
        .catch(error => {
          // console.log(error)
          self.$toast.error(error.response.data)
        })
    },
    loadAccounts (ustore) {
      var u = ustore
      console.log('Loading accounts now...')
      this.$api
        .get('users/' + ustore.getData().id + '/accounts')
        .then(response => {
          u.setAccounts(response.data)
        })
        .catch(error => {})
    },
    toggleVisibilityOfPassword() {
      this.isPasswordVisible = !this.isPasswordVisible
    }
  }
}
</script>

<style lang="css">
.form-submit {
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  color: #ffffff;
  background: #4876eb !important;
  border: none;
  width: 100%;
  margin-top: 40px;
  padding: 14px;
  cursor: pointer;
}
</style>
