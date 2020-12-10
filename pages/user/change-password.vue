<template>
  <section-block title="Change password">
    <section class="page-content">
      <div class="content">
        <form-change-password />
      </div>
    </section>
  </section-block>
</template>

<style lang="scss" scoped>
.page-content {
  .content {
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
    margin: 50px auto;
    position: relative;
    max-width: 650px;
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
</style>

<script>
import FormChangePassword from '@/components/oauth/FormChangePassword'
import FrontendBase from '~/components/layouts/FrontendBase'

export default {
  components: {
    FormChangePassword,
  },
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'auth',
  data() {
    return {}
  },
}
</script>
