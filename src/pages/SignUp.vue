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
              <form autocomplete="off" class="main-form">
                <div class="block-two-inputs">
                  <input
                    type="text"
                    class="input-form"
                    name="name"
                    placeholder="Your name"
                    value=""
                    autocomplete=""
                  />
                  <input
                    type="text"
                    class="input-form"
                    name="company-name"
                    placeholder="Company name"
                    value=""
                    autocomplete=""
                  />
                </div>
                <input
                  type="tel"
                  class="input-form"
                  name="tel"
                  placeholder="Phone number"
                  value=""
                  autocomplete=""
                />
                <input
                  type="email"
                  class="input-form"
                  name="email"
                  placeholder="Your email"
                  value=""
                  autocomplete=""
                />
                <div class="block-pswrd">
                  <div class="placeholder-container">
                    <input
                      type="password"
                      name="password"
                      class="focus-input"
                      placeholder=""
                      value=""
                      autocomplete=""
                    /><label>{{ $t('common.password') }}</label
                    ><a href="#" class="show-password"
                      ><img src="/img/eye.svg" alt=""
                    /></a>
                  </div>
                </div>
                <div class="block-pswrd">
                  <div class="placeholder-container">
                    <input
                      type="password"
                      name="confirm-password"
                      class="focus-input"
                      placeholder=""
                      value=""
                      autocomplete=""
                    /><label>{{ $t('common.confirm_password') }}</label
                    ><a href="#" class="show-password"
                      ><img src="/img/eye.svg" alt=""
                    /></a>
                  </div>
                </div>
                <div>
                  <input
                    type="submit"
                    name="submit"
                    class="form-submit modal-toggle"
                    :value="$t('common.signup')"
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
                <span>{{ $t('common.already_have_account') }}</span>
                <router-link class="blue" to="/login">
                  {{ $t("common.sign_in") }}
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
export default {
  data() {
    return {
      name: '',
      company_name: '',
      phone: '',
      email: '',
      password: '',
      loading: false
    }
  },
  methods: {
    loginWithGoogle() {
      var self = this
      self.loading = true
      googleTokenLogin().then((response) => {
        // console.log("Handle the response", response)
        self.verifyGoogleLogin(response)
      })
    },
    verifyGoogleLogin(response) {
      var self = this
      var u = userStore()
      this.$api.post('login/google', {
        token: response.access_token
      }).then((response) => {
        // console.log(response)
        authService.login(self.$pinia, response, this.remember_me)
        self.loadProfile(u)
        self.loading = false
        self.$goTo('dashboard')
      }).catch(function (error) {
        // console.log(error)
        self.loading = false
        self.$toast.error(error.response.data)
      })
    },
    login() {
      var self = this
      self.loading = true
      this.$api.post('auth/token', {
        'email': this.email,
        password: this.password,
        remember_me: this.remember_me
      }).then((response) => {
        // console.log(response)
        authService.login(this.$pinia, response, this.remember_me)
        // toast.success("Login successful.")
        self.loadProfile()
        self.loading = false
        self.$goTo('dashboard')
      }).catch(function (error) {
        // console.log(error)
        self.loading = false
        self.$toast.error(error.response.data)
      })
    },
    loadProfile(ustore) {
      var self = this
      var u = ustore
      this.$api.get('profile').then((response) => {
        u.setUser(response.data)
        self.loadAccounts(u)
        self.$mitt.emit('profile-loaded', {})
      }).catch((error) => {
        // console.log(error)
        self.$toast.error(error.response.data)
      })
    },
    loadAccounts(ustore) {
      var u = ustore
      console.log("Loading accounts now...")
      this.$api.get('users/' + ustore.getData().id + '/accounts').then((response) => {
        u.setAccounts(response.data)
      }).catch((error) => {
      })
    },
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
</style>
