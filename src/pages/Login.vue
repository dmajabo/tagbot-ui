<template>
  <div id="root">
    <header class="header-section">
      <div class="content flex-header">
        <div class="left-header"><a class="logotype" href="/dashboard">
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
      <section class="main-section">
        <div class="content flex-main">
          <div><h1 class="title">{{ $t("site.slogan") }}</h1>
            <div class="main-form-block">
              <div class="flex-welcome"><span class="weclome-to">{{ $t("site.welcome") }}</span><a href="#"
                                                                                                   class="logotype">
                <div class="tag-logo">Tag</div>
                <div class="bot-logo">Bot</div>
              </a></div>
              <p class="text-form">{{ $t("site.tagline") }}</p>
              <form autocomplete="off" class="main-form">
                <div><input type="text" class="input-form" name="email" placeholder="Your email" value=""></div>
                <div class="block-pswrd">
                  <div class="placeholder-container"><input type="password" name="password" class="focus-input"
                                                            placeholder=" "
                                                            value=""><label>{{ $t("common.password") }}</label><a
                      href="#"
                      class="show-password"><img
                      src="/img/eye.svg" alt=""></a>
                  </div>
                </div>
                <div class="flex-forgot">
                  <div><input type="checkbox" class="checkbox"></div>
                  <a href="#" class="forgot-password">{{ $t("common.forgot") }}</a></div>
                <div><input type="submit" name="submit" class="form-submit modal-toggle" value="Sign In"></div>
              </form>
              <div class="signin-block">
                <p class="text-form">{{ $t("common.alt_signin") }}</p>
                <a href="#" @click.prevent="loginWithGoogle()" class="signin-with"><img src="/img/google-icon.svg"
                                                                                        class="google-icon" alt="">
                  <span class="google-text">Google</span></a>
              </div>
              <div class="have-acc">
                <span>{{ $t("common.no_account") }}</span>
                <a class="blue" href="/sign-up">{{ $t("common.signup") }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import authService from "../services/auth"
import {useToast} from 'vue-toastification'
import {googleTokenLogin} from "vue3-google-login"

const toast = useToast()

export default {
  data() {
    return {
      email: '',
      password: '',
      remember_me: ''
    }
  },
  methods: {
    loginWithGoogle() {
      googleTokenLogin().then((response) => {
        // console.log("Handle the response", response)
        this.verifyGoogleLogin(response)
      })
    },
    verifyGoogleLogin(response) {
      // For test only!!!
      if(import.meta.env.VITE_SKIP_LOGIN === "true") {
        authService.login(this.$pinia, {data: {token: response.access_token}}, this.remember_me)
        this.$router.push({name: 'dashboard'})
      }
      this.$api.post('auth/token/google', {
        token: response.access_token,
        remember_me: this.remember_me
      }).then((response) => {
        // console.log(response)
        authService.login(this.$pinia, response, this.remember_me)
        // toast.success("Login successful.")
        this.$router.push({name: 'dashboard'})
      }).catch(function (error) {
        console.log(error)
        toast.error(error.response.data.message)
      })
    },
    login() {
      this.$api.post('auth/token', {
        'email': this.email,
        password: this.password,
        remember_me: this.remember_me
      }).then((response) => {
        console.log(response)
        authService.login(this.$pinia, response, this.remember_me)
        // toast.success("Login successful.")
        this.$router.push({name: 'dashboard'})
      }).catch(function (error) {
        console.log(error)
        toast.error(error.response.data.message)
      })
    }
  }
}
</script>
