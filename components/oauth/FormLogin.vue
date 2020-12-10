
<template>
  <div class="mt-3">
    <div class="form-login">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        @keydown.native.enter.prevent="submitForm('ruleForm')"
      >
        <el-form-item prop="username">
          <el-input
            v-model="ruleForm.username"
            class="input-left"
            :placeholder="$t(`username or email`)"
            type="text"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            class="input-left"
            :placeholder="$t(`password`)"
            type="password"
            autocomplete="off"
          />
        </el-form-item>

        <p class="error">{{ error }}</p>

        <!-- <el-button type="danger" class="btn btn-login meta">
          {{ $t('Google +') }}
        </el-button> -->

        <el-row>
          <el-button
            type="primary"
            class="btn btn-login meta"
            @click="submitForm('ruleForm')"
          >
            {{ $t('Login') }}
          </el-button>
        </el-row>
      </el-form>
    </div>
    <hr class="my-3" />
    <div class="actions">
      <nuxt-link class="btn-forget mb-3" to="/reset-password">
        {{ $t(`Reset password`) }}
      </nuxt-link>
    </div>
  </div>
</template>


<script>
import validate from '@/helpers/custom-rules-validate'
import LoginSocial from '@/helpers/login-social'
import CheckRole from '@/helpers/check-role.js'

export default {
  mixins: [validate, LoginSocial, CheckRole],
  data() {
    return {
      stringCommon: '',
      error: '',
      rules: {
        username: this.validateRequired('username or email'),
        password: this.validatePassword(),
      },
      ruleForm: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postLogin()
        } else {
          this.focusError()
          this.$log.warn('The usernmae or password is incorrect!')
          return false
        }
      })
    },
    async postLogin() {
      this.startLoading()
      await this.$services.common.login(
        this.ruleForm,
        (response) => {
          const data = response.data
          const role = this.getRoleValue(data.role)
          const user_obj = {
            id: data.id,
            username: data.username,
            email: data.email,
            role,
          }
          this.saveAccessToken(data.token, role)
          this.$authInfo.loginAction(user_obj)
          this.$log.info(this.$authInfo)

          let redirect
          switch (role) {
            case 1:
              redirect = this.getRoutePath('admin')
              break
            case 2:
              redirect = this.getRoutePath('humanresources')
              break
            case 3:
              redirect = this.getRoutePath('manager')
              break
            case 4:
              redirect = this.getRoutePath('staff')
              break
            default:
              redirect = this.getRoutePath('login')
              break
          }
          window.location = redirect
        },
        (err) => {
          this.notifyError(err.error.error)
        }
      )
      this.endLoading()
    },
  },
}
</script>

<style lang="scss" scoped>
.error {
  color: red;
}

.btn-login {
  width: 100%;
  margin-top: 10px;
}
</style>
