<template>
<div class="contrainer">
 <div class="tms">time management system</div>
  <section class="page-login" >
    <div class="page-login-box">
      <div class="content">
        <h3>{{ $t('Login') }}</h3>
        <form-login @data="getData"></form-login>
      </div>
    </div>
  </section>
  <!-- <div class="design">©2020 time management system | Design by <span>TMS</span></div> -->
  </div>
</template>

<style lang="scss" scoped>
.contrainer{
 background-image: url(~assets/img/login.jpg);
 background-size: cover;
 height: 100vh;

 .tms{
   text-align: center;
   text-transform: uppercase;
   font-size: 60px;
   font-weight: bold;
   color: #fff;
   padding-top: 40px;

 }
 .design{
   text-align: center;
   color: #fff;

 }

.page-login {
// height: 100vh;
//  background-image: url(~assets/img/login.jpg);
//  background-size: cover;


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
        .form-group {
          margin-bottom: 15px;
        }

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
}
</style>

<script>
import FormLogin from '@/components/oauth/FormLogin'
import FrontendBase from '~/components/layouts/FrontendBase'

export default {
  components: {
    FormLogin,
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
