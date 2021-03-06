<template>
  <div class="mt-3">
    <div class="form-login">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        label-width="140px"
        :rules="rules"
        label-position="left"
        :hide-required-asterisk="true"
        @keydown.native.enter.prevent="submitForm('ruleForm')"
      >
        <el-form-item label="Current Password" prop="oldPassword">
          <el-input
            v-model="ruleForm.oldPassword"
            class="input-left"
            :placeholder="$t(`current password`)"
            type="password"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item label="New Password" prop="newPassword">
          <el-input
            v-model="ruleForm.newPassword"
            class="input-left"
            :placeholder="$t(`new password`)"
            type="password"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input
            v-model="ruleForm.confirmPassword"
            class="input-left"
            :placeholder="$t(`confirm password`)"
            type="password"
            autocomplete="off"
          />
        </el-form-item>

        <p class="error">{{ error }}</p>
        <el-row :gutter="20" class="mt-30">
          <el-col :span="12" :offset="8" style="margin-left: 200px">
           
            <nuxt-link class="mb-3" to="/">
              <el-button>
                {{ $t('Cancel') }}
              </el-button>
            </nuxt-link>
             <el-button type="primary" @click="submitForm('ruleForm')">
              {{ $t('Submit') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import validate from '@/helpers/custom-rules-validate'

export default {
  mixins: [validate],
  data() {
    const newPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the new password'))
      } else {
        if (this.ruleForm.confirmPassword !== '') {
          this.$refs.ruleForm.validateField('confirmPassword')
        }
        callback()
      }
    }
    const confirmPassword = (rule, value, callback) => {
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
        oldPassword: this.validatePassword(),
        newPassword: [
          {
            min: 8,
            max: 20,
            message: this.$t(`Password must be between 8 and 20 number!`),
          },
          { validator: newPassword, trigger: 'blur' },
        ],
        confirmPassword: [
          {
            min: 8,
            max: 20,
            message: this.$t(`Password must be between 8 and 20 number!`),
          },
          { validator: confirmPassword, trigger: 'blur' },
        ],
      },
      ruleForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.changePassword()
        } else {
          this.focusError()
          this.$log.warn('The email address or password is incorrect!')
          return false
        }
      })
    },
    async changePassword() {
      this.startLoading()
      await this.$services.common.changePassword(
        this.ruleForm,
        (res) => {
          this.$notify({
            title: 'Message',
            message: res.message,
            type: 'success',
          })
          window.location = this.getRoutePath('user-profile')
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

label {
  margin-bottom: 0;
}
</style>
