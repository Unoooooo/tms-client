import Vue from 'vue'
import moment from 'moment'
import Cookies from 'js-cookie'

const nuxtConfig = {}
Vue.mixin({
  data() {
    return {
      moment,
      sendingFlag: false,
    }
  },
  computed: {
    config() {
      return this.storeGetData('session', 'config')
    },
    checkSendingFlag() {
      return this.sendingFlag
    },
    getTitle() {
      const result = this.storeGetData('meta', 'title')
      if (this.isEmpty(result)) {
        return ''
      }
      return result
    },
  },

  created() {
    this.popupEnv = process.env.popupEnv
    const envMode = this.isEmpty(process.env.ENV) ? 'dev' : process.env.ENV
    // eslint-disable-next-line eqeqeq
    this.isDev = envMode == 'dev'
    this.env = process.env
    this.sendingFlag = false
  },

  methods: {
    setSendingFlag(bool) {
      this.sendingFlag = bool
      return this.sendingFlag
    },
    objectEmpty(obj) {
      if (this.isEmpty(obj)) {
        return true
      }
      this.$log.debug('obj', obj)
      const keys = Object.keys(obj)
      // eslint-disable-next-line eqeqeq
      if (keys.length == 0) {
        return true
      }

      let status = true
      keys.forEach((item) => {
        if (!this.isEmpty(obj[item])) {
          status = false
        }
      })

      return status
    },
    // https://webbjocke.com/javascript-check-data-types/
    isEmpty(value) {
      // Array
      if (Array.isArray(value)) {
        // eslint-disable-next-line eqeqeq
        return value.length == 0
      }

      // Object
      if (value && typeof value === 'object' && value.constructor === Object) {
        // eslint-disable-next-line eqeqeq
        return Object.keys(value).length == 0
      }

      // string
      if (typeof value === 'string' || value instanceof String) {
        // eslint-disable-next-line eqeqeq
        return value.trim().length == 0
      }

      // Null & undefined
      if (value === null || typeof value === 'undefined') {
        return true
      }
    },
    /**
     * không được phép gọi trực tiếp, phải gán lại vào 1 biến của component
     * Direct call is not allowed, must be re-assigned to a variable of the component
     * @param key
     * @returns {null|*}
     */
    getConfig(key) {
      // eslint-disable-next-line no-prototype-builtins
      if (!nuxtConfig.hasOwnProperty(key)) {
        const config = this.storeGetData('session', 'config')
        // eslint-disable-next-line no-prototype-builtins
        if (config == null || !config.hasOwnProperty(key)) {
          return null
        }
        nuxtConfig[key] = config[key]
      }
      return nuxtConfig[key]
    },
    getRoutePath(name) {
      const routes = this.$router.options.routes
      // eslint-disable-next-line eqeqeq
      const result = routes.filter((item) => item.name == name)
      // eslint-disable-next-line eqeqeq
      if (result.length == 0) {
        return '/'
      }
      return result[0].path
    },
    saveAccessToken(value, rolePermission) {
      // console.log(process.env.TOKEN_EXPIRED)
      const TOKEN_EXPIRED = process.env.TOKEN_EXPIRED || 7
      Cookies.set('access_token', value, {
        expires: 60 * 60 * 24 * TOKEN_EXPIRED,
      })
      Cookies.set('role_permission', rolePermission, {
        expires: 60 * 60 * 24 * TOKEN_EXPIRED,
      })
    },
    removeAccessToken() {
      Cookies.remove('access_token')
      Cookies.remove('role_permission')
    },
    storeGetData(module, variable) {
      const result = this.$store.state[module][variable]
      if (this.isEmpty(result)) {
        return []
      }
      return this.cloneObject(result)
    },
    storeCommit(name, value = undefined) {
      // eslint-disable-next-line eqeqeq
      if (value == undefined) {
        this.$store.commit(name)
        return
      }

      this.$store.commit(name, value)
    },
    arrayChunk(array, size) {
      const chunkedArr = []
      for (let i = 0; i < array.length; i++) {
        const last = chunkedArr[chunkedArr.length - 1]
        if (!last || last.length === size) {
          chunkedArr.push([array[i]])
        } else {
          last.push(array[i])
        }
      }
      return chunkedArr
    },

    startLoading() {
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    },

    endLoading() {
      if (!this.isEmpty(this.loading)) {
        this.loading.close()
      }
    },

    formShowErrorMessage(errors, formName) {
      const fieldError = Object.keys(errors)
      this.$log.debug('fieldError: ', fieldError)

      this.$refs[formName].$children.forEach((children) => {
        if (!fieldError.includes(children.prop)) {
          if (fieldError.includes('data')) {
            this.notifyError(errors.data)
          }
          return
        }
        children.validateState = 'error'
        children.validateMessage = errors[children.prop]
      })
    },

    showErrorMessage(errors, formName = undefined) {
      // eslint-disable-next-line eqeqeq
      if (errors.code == 422) {
        this.formShowErrorMessage(errors.error, formName)
        return
      }

      const errorMessage = Object.values(errors.error).map((item) => {
        return '• ' + item
      })
      this.notifyError(errorMessage.join('\n'))
    },

    notifyError(message) {
      this.$notify.error({
        title: this.$t(`Error`),
        message,
        duration: 5000,
      })
    },

    notifySuccess(message) {
      this.$notify.success({
        title: this.$t(`Success`),
        message,
        duration: 5000,
      })
    },
    showStartToEndDateTime(
      start = '',
      end = '',
      formatString = '',
      freefix = ' - '
    ) {
      let startFormat, endFormat
      if (!isNaN(Date.parse(start))) {
        startFormat = moment(start).format(formatString)
      } else {
        startFormat = start
      }

      if (!isNaN(Date.parse(end))) {
        endFormat = moment(end).format(formatString)
      } else {
        endFormat = this.$t(`Now`)
      }
      return startFormat + freefix + endFormat
    },
    countDateJob(date) {
      return moment(date).fromNow()
    },
    showDateTime(dateTime, formatString = undefined) {
      // eslint-disable-next-line eqeqeq
      if (formatString == undefined) {
        formatString = process.env.FORMATDATE || 'DD/MM/YYYY - HH:mm'
      }
      return moment(dateTime).format(formatString)
    },
    showAge(dateTime = '') {
      // eslint-disable-next-line eqeqeq
      if (dateTime == '') {
        return dateTime
      }

      return moment().diff(dateTime, 'years')
    },
    showDateAgo(date) {
      if (this.moment().diff(this.moment(date), 'days') > 3) {
        return this.showDateTime(date, process.env.formatDate.dmyhm)
      }

      return this.moment(date).fromNow()
    },
    formatTimeCreate(date) {
      if (this.moment().diff(this.moment(date), 'days') < 1) {
        return this.showDateTime(date, process.env.formatDate.hm)
      }
      const currentYear = new Date().getFullYear()
      // eslint-disable-next-line eqeqeq
      if (parseInt(currentYear) == parseInt(this.showDateTime(date, 'YYYY'))) {
        return this.showDateTime(date, process.env.formatDate.dmhm)
      } else {
        return this.showDateTime(date, process.env.formatDate.dmyhm)
      }
    },
    objToArray(obj, keyField, valueField) {
      // Object
      if (obj && typeof obj === 'object' && obj.constructor === Object) {
        const response = []
        Object.keys(obj).forEach((k) => {
          const newObj = {}
          let vl = k
          if (!isNaN(Number(vl))) {
            vl = parseInt(vl)
          }
          newObj[keyField] = vl
          newObj[valueField] = obj[k]
          response.push(newObj)
        })
        return response
      }
      return []
    },

    validateCallbackForm(fields, type = undefined, action = undefined) {
      this.$log.debug('type: ', type)
      this.$log.debug('action: ', action)
      setTimeout(() => {
        fields.forEach((f) => {
          this.$refs.ruleForm.validateField(f)
        })
      }, 200)
    },

    cloneObject(obj) {
      return JSON.parse(JSON.stringify(obj))
    },

    /**
     * 'money_unit' => [
     1 => 'VND',
     2 => 'Dollar',
     3 => 'Euro'
     ],
     * @param monney
     * @param currency
     * @returns {*}
     */
    formatCurrency(monney, unit = undefined) {
      const str = this.$numeral(monney).format('0,0')
      // eslint-disable-next-line eqeqeq
      if (unit == 1) {
        return str + ' VNĐ'
      }

      // eslint-disable-next-line eqeqeq
      if (unit == 2) {
        return '$' + str
      }

      // eslint-disable-next-line eqeqeq
      if (unit == 3) {
        return str + '€'
      }

      return str
    },

    getLanguageCode() {
      let code = Cookies.get('language_code')
      if (this.isEmpty(code)) {
        code = 'en'
      }
      return code
    },

    setLanguageCode(code) {
      Cookies.set('language_code', code, {
        expires: 60 * 60 * 24 * process.env.TOKEN_EXPIRED,
      })
    },

    changeFlagLanguage() {
      let code = this.getLanguageCode()

      // eslint-disable-next-line eqeqeq
      if (code == 'en') {
        code = 'vi'
      } else {
        code = 'en'
      }

      this.setLanguageCode(code)

      window.location.reload()
    },
    tinyMCE(name, content = undefined) {
      /* eslint-disable */
      this.$log.debug('tinyMCE', name)
      let editor = tinymce.get(name)
      if (this.isEmpty(editor)) {
        return ''
      }

      if (content != undefined) {
        return editor.setContent(content)
      }

      return editor.getContent()
      /* eslint-enable */
    },
    tinyInit(selector, height = 250, callback = undefined) {
      /* eslint-disable */
      setTimeout(() => {
        this.$log.debug('selector', selector)
        tinymce.init({
          selector: '#' + selector,
          height: height,
          menubar: false,
          plugins: [
            'advlist autolink lists link images charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            'undo redo | formatselect | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat',
        })
        if (callback != undefined) {
          callback()
        }
      }, 500)
      /* eslint-enable */
    },
    focusError() {
      setTimeout(() => {
        this.$scrollTo('.el-form-item__error', { offset: -250 })
      }, 300)
    },
    randomString(len = 7) {
      const randomStr = Math.random().toString(36).substring(len)
      return randomStr
    },
    makeTextId(name) {
      return name + '_' + this.randomString()
    },
    makeQueryStringWithoutEmpty(obj) {
      /* eslint-disable */
      return Object.entries(obj).reduce(
        (a, [k, v]) =>
          v == null || v == '' || v == undefined ? a : ((a[k] = v), a),
        {}
      )
      /* eslint-enable */
    },
  },
})
