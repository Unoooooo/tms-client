export default {
  methods: {
    validatePhoneNumber() {
      return [
        { type: 'string' },
        {
          required: true,
          whitespace: true,
          message: this.$t(`Please input phone number!`),
          trigger: 'change',
        },
        {
          pattern: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/i,
          message: this.$t(`The phone number is incorrect!`),
          trigger: 'change',
        },
      ]
    },
  
    validatePassword() {
      return [
        { type: 'string' },
        {
          required: true,
          whitespace: true,
          message: this.$t(`Please input password!`),
          trigger: 'change',
        },
        {
          min: 8,
          max: 20,
          message: this.$t(`Password must be between 8 and 20 number!`),
          trigger: 'change',
        },
      ]
    },
    validateConfirmPassword() {
      return [
        { type: 'string' },
        {
          required: true,
          whitespace: true,
          message: this.$t(`Please input confirm password!`),
          trigger: 'change',
        },
        {
          min: 6,
          max: 20,
          message: this.$t(`Password must be between 6 and 20 number!`),
          trigger: 'change',
        },
      ]
    },
    validateEmailAddress() {
      return [
        { type: 'string' },
        {
          required: true,
          whitespace: true,
          message: this.$t(`Please input email!`),
          trigger: 'change',
        },
        {
          pattern: /^[-a-z0-9~!$%^&*_=+}{\\'?]+(\.[-a-z0-9~!$%^&*_=+}{\\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
          message: this.$t(`The email address is incorrect!`),
          trigger: 'change',
        },
      ]
    },
    validateUsername() {
      return [
        { type: 'string' },
        {
          required: true,
          whitespace: true,
          message: this.$t(`Please input email!`),
          trigger: 'change',
        },
      ]
    },
    validateRequired(text) {
      return [
        {
          required: true,
          whitespace: true,
          message: this.$t(`Please input ${text}!`),
          trigger: 'change',
        },
      ]
    },
    validateSelected(text) {
      return [
        {
          required: true,
          message: `Please select ${text}`,
          trigger: 'change',
        },
      ]
    },
  },
}
