<template>
  <section class="page-login">
    <div class="page-login-box">
      <div class="content">
        <h3>{{ $t('Reset Password') }}</h3>
        <form-reset-password @data="getData"></form-reset-password>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.page-login {
  height: 100vh;
  background-image: url(~assets/img/login.jpg);
  background-size: cover;
 
  &-box {
    position: absolute;
    width: 100%;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);

    .content {
      background: #fff;
      border-radius: 6px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
      margin: 0 auto;
      position: relative;
      max-width: 450px;
      padding: 1.5rem;

      h3 {
        text-align: center;
      }

      .form-login,
      .form-register {
        // .form-group {
        //   margin-bottom: 15px;
        // }

        .help-block {
          color: red !important;
        }
      }

      .actions {
        color: #525252;
        text-align: left;
        border-top: 1px solid #eee;
        padding: 16px 0;
      }
    }

    .brand {
      color: #00b900;
      margin-bottom: 1.5rem;
      font-weight: bold;
    }
  }
}
</style>

<script>
import FormResetPassword from '@/components/oauth/FormResetPassword'
import FrontendBase from '~/components/layouts/FrontendBase'

export default {
  components: {
    FormResetPassword,
  },
  extends: FrontendBase,
  layout: 'default',
  middleware: 'guest',
  data() {
    return {
      stringCommon: '',
    }
  },
  methods: {
    getData(data) {
      console.log(data)
    },
  },
}
</script>
