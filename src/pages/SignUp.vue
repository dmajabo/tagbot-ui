<template>
  <div id="root" class="wrapper">
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
              <Form @submit="onSubimt" class="main-form" :validation-schema="schema">
                <div class="block-two-inputs">
                  <div class="field-with-error">
                    <Field
                      type="text"
                      class="input-form"
                      name="name"
                      placeholder="Your name"
                      v-model="name"
                      autocomplete=""
                    />
                    <ErrorMessage class="error" name="name" />
                  </div>
                  <div class="field-with-error">
                    <Field
                      type="text"
                      class="input-form"
                      name="company-name"
                      v-model="company_name"
                      placeholder="Company name"
                      autocomplete=""
                    />
                  </div>
                </div>
                <div class="field-with-error">
                  <Field
                    type="tel"
                    class="input-form"
                    name="phone"
                    placeholder="Phone number"
                    v-model="phone"
                    autocomplete=""
                  />
                  <ErrorMessage class="error" name="phone" />
                </div>
                <div class="field-with-error">
                  <Field
                    type="email"
                    class="input-form"
                    name="email"
                    placeholder="Your email"
                    v-model="email"
                    autocomplete=""
                  />
                  <ErrorMessage class="error" name="email" />
                </div>
                <div class="field-with-error">
                  <div class="block-pswrd">
                    <div class="placeholder-container">
                      <Field
                        :type="isPasswordVisible ? 'text' : 'password'"
                        name="password"
                        class="focus-input"
                        placeholder=""
                        v-model="password"
                        autocomplete=""
                      />
                        <label>{{ $t('common.password') }}</label>
                        <div tabindex="0" @keyup.enter="toggleVisibilityOfPassword" @click="toggleVisibilityOfPassword" :class="['show-password', isPasswordVisible && 'show-password_visible']">
                          <img src="/img/eye.svg" alt="" />
                        </div>
                    </div>
                  </div>
                  <ErrorMessage class="error" name="password" />
                </div>
                <div class="field-with-error">
                  <div class="block-pswrd">
                    <div class="placeholder-container">
                      <Field
                        :type="isConfirmPasswordVisible ? 'text' : 'password'"
                        name="confirmPassword"
                        class="focus-input"
                        placeholder=""
                        value=""
                        v-model="confirmPassword"
                        autocomplete=""
                      />
                        <label>{{ $t('common.confirm_password') }}</label>
                        <div tabindex="0" @keyup.enter="toggleVisibilityOfConfirmPassword" @click="toggleVisibilityOfConfirmPassword" :class="['show-password', isConfirmPasswordVisible && 'show-password_visible']"
                        >
                          <img src="/img/eye.svg" alt="" />
                      </div>
                    </div>
                  </div>
                  <ErrorMessage class="error" name="confirmPassword" />
                </div>
                <div>
                  <button name="submit" class="form-submit modal-toggle">
                    {{ $t('common.signup') }}
                  </button>
                </div>
              </Form>
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
                <span>{{ $t('common.already_have_account') }}</span>
                <router-link class="blue" to="/login">
                  {{ $t('common.sign_in') }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import * as yup from 'yup'

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const schema = yup.object({
  email: yup.string().required().email(),
  name: yup.string().required(),
  phone: yup.string().matches(phoneRegExp, 'phone number is not valid'),
  password: yup.string().required().min(8),
  confirmPassword: yup.string()
     .oneOf([yup.ref('password'), null], 'passwords must match')
})
</script>
<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import authService from "../services/auth"

export default {
  components: {
    Form,
    Field,
    ErrorMessage
  },
  data () {
    return {
      name: '',
      company_name: '',
      phone: '',
      email: '',
      password: '',
      isPasswordVisible: false,
      confirmPassword: '',
      isConfirmPasswordVisible: false,
      loading: false
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
    toggleVisibilityOfConfirmPassword() {
      this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible
    },
    toggleVisibilityOfPassword() {
      this.isPasswordVisible = !this.isPasswordVisible
    },
    onSubimt () {
      this.$api.post('register', {
        'name': this.name,
        'companyName': this.company_name,
        'phone': this.phone,
        'email': this.email,
        'password': this.password
      }).then(res => {
        if (res.status === 200) {
          this.$toast.success('Sign-up successful')
          authService.login(this.$pinia, { data: { token: res.data } })
          this.loadProfile()
          this.$goTo('dashboard')
        }
      }).catch(error => {
        this.$toast.error(error?.message)
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
    }
  }
}
</script>

<style>
.block-two-inputs {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  column-gap: 25px;

  @media screen and (min-width: 768px) {
    flex-direction: row;
  }
}

.field-with-error {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.error {
  font-size: 14px;
  color: lightcoral;
  padding-top: 8px;
}

</style>
