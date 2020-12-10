export const strict = false
import Cookies from 'js-cookie'
import Vue from 'vue'

const syncObject = {
  commit: null,
  context: null,
  async getUserInfo() {
    const token = Cookies.get('access_token')
    if (token == undefined || token.length == 0) {
      Vue.prototype.$log.warn('Session not found')
      return
    }

    await Vue.prototype.$services.common.getUserInfo(
      (response) => {
        let roleValue = 0

        switch (response.data.role) {
          case 'ROLE_ADMIN':
            roleValue = 1
            break
          case 'ROLE_HR':
            roleValue = 2
            break
          case 'ROLE_MANAGER':
            roleValue = 3
            break
          case 'ROLE_STAFF':
            roleValue = 4
            break
        }
        const user_info = {
          active_status: response.data.status ? 1 : 0,
          id: response.data.account_id,
          role: roleValue,
          full_name: response.data.full_name,
          username: response.data.username,
          status: response.data.status,
          groupCompanyName: response.data.groupCompanyName,
          avatar_url: response.data.image_url,
        }
        Vue.prototype.$authInfo.loginAction(user_info)
      },
      (err) => {
        Cookies.remove('access_token')
        Vue.prototype.$log.error(err)
      }
    )
  },
}

export const actions = {
  async nuxtClientInit({ commit }) {
    syncObject.commit = commit
    syncObject.context = this

    //begin get user info
    await syncObject.getUserInfo()
    //end begin get user info
  },
}
