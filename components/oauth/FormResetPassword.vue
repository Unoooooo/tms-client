<template>
  <div class="mt-3">
    <div class="form-login">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        @keydown.native.enter.prevent="submitForm('ruleForm')"
      >
        <el-form-item prop="email">
          <el-input
            v-model="ruleForm.email"
            class="input-left"
            :placeholder="$t(`email`)"
            type="email"
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
  data() {
    return {
      stringCommon: '',
      error: '',
      rules: {
        email: this.validateEmailAddress(),
      },
      ruleForm: {
        email: '',
      },
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.forgetPassword(formName)
        } else {
          this.focusError()
          this.$log.warn('The email address is incorrect!')
          return false
        }
      })
    },
    async forgetPassword(formName) {
      this.startLoading()
      await this.$services.common.forgetPassword(
        this.ruleForm,
        (res) => {
          this.$notify({
            title: 'Message',
            message: res.message,
            type: 'success',
          })
          this.ruleForm.email = ''
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
