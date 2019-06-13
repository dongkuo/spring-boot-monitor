<template>
  <div class="login-wrapper">
    <div class="login">
      <p class="logo-wrapper"><img class="logo" src="../assets/logo.png" alt="Spring Boot Monitor"></p>
      <h1 class="title">Sign in to Spring Boot Monitor</h1>
      <div class="input-wrapper">
        <Input class="input" prefix="ios-contact" placeholder="Input your name" v-model="user.username"/>
        <Input class="input" prefix="ios-lock" type="password" placeholder="Input your password"
               v-model="user.password" @keyup.enter.native="signIn"/>
        <Button type="success" long @click="signIn" :loading="isSigningIn">Sign In</Button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      return {
        isSigningIn: false,
        user: {username: '', password: ''}
      }
    },
    methods: {
      signIn() {
        this.isSigningIn = true
        this.$http.post('/api/login', this.user)
          .then(resp => {
            if (resp.data.code < 0) {
              this.$Message.warning(resp.data.msg)
              return
            }
            this.$Message.success(resp.data.msg)
            this.$router.push('/')
            this.isSigningIn = false
          })
          .catch(err => {
            console.log(err)
            this.isSigningIn = false
          })
      }
    }
  }
</script>

<style scoped>

  .login-wrapper {
    background-color: #f9f9f9;
    height: 100%;
  }

  .login {
    width: 320px;
    margin-left: auto;
    margin-right: auto;
  }

  .logo-wrapper {
    text-align: center;
    padding: 64px 0 8px 0;
  }

  .logo {
    width: 48px;
  }

  .title {
    font-size: 20px;
    font-weight: normal;
    margin: 16px 0;
    text-align: center;
  }

  .input-wrapper {
    border: 1px solid #d8dee2;
    padding: 32px 24px;
    border-radius: 2px;
    margin: 16px 0;
    background-color: #ffffff;
  }

  .input-wrapper .input {
    margin-bottom: 16px;
  }
</style>
