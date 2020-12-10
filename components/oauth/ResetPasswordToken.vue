<template>
  <div class="mt-3">
    <div class="form-login">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        @keydown.native.enter.prevent="submitForm('ruleForm')"
      >
        <el-form-item prop="token" class="hidden">
          <el-input v-model="ruleForm.token" class="input-left" type="hidden" />
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input
            v-model="ruleForm.newPassword"
            class="input-left"
            :placeholder="$t(`New password`)"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item prop="newPasswordConfirm">
          <el-input
            v-model="ruleForm.newPasswordConfirm"
            class="input-left"
            :placeholder="$t(`New password confirm`)"
            type="password"
            autocomplete="off"
          />
        </el-form-item>

        <p class="error">{{ error }}</p>
        <el-button
          type="primary"
          class="btn btn-login meta"
          @click="submitForm('ruleForm')"
        >
          {{ $t('Submit') }}
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import validate from '@/helpers/custom-rules-validate'

export default {
  mixins: [validate],
  props: {
    token: {
      type: String,
      required: true,
    },
  },
  data() {
    const newPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password'))
      } else {
        if (this.ruleForm.newPasswordConfirm !== '') {
          this.$refs.ruleForm.validateField('newPasswordConfirm')
        }
        callback()
      }
    }
    const newPasswordConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password again'))
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error("Two inputs don't match!"))
      } else {
        callback()
      }
    }
    return {
      stringCommon: '',
      error: '',
      rules: {
        newPassword: [
          {
            min: 8,
            max: 20,
            message: this.$t(`Password must be between 8 and 20 number!`),
          },
          { validator: newPassword, trigger: 'blur' },
        ],
        newPasswordConfirm: [
          {
            min: 8,
            max: 20,
            message: this.$t(`Password must be between 8 and 20 number!`),
          },
          { validator: newPasswordConfirm, trigger: 'blur' },
        ],
      },
      ruleForm: {
        newPassword: '',
        newPasswordConfirm: '',
        token: this.token,
      },
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.resetPassword(formName)
        } else {
          this.focusError()
          this.$log.warn('The password is incorrect!')
          return false
        }
      })
    },
    async resetPassword(formName) {
      this.startLoading()
      await this.$services.common.resetPasswordToken(
        this.ruleForm,
        () => {
          this.$notify({
            title: 'Message',
            message: this.$t('Reset password success'),
            type: 'success',
          })
          window.location = this.getRoutePath('login')
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
.el-form-item.hidden {
  display: none;
}
</style>
