export default class Auth {
  constructor(store) {
    this.data = null
    this.store = store
    if (store.state.user.data != {}) {
      this.data = store.state.user.data
    }
  }

  checkAuth() {
    return this.id() != null
  }

  id() {
    return this.getData('id')
  }

  name() {
    return this.getData('name')
  }

  username() {
    return this.getData('username')
  }

  avatar_url() {
    return this.getData('avatar_url')
  }

  email() {
    return this.getData('email')
  }

  groupName() {
    return this.getData('groupCompanyName')
  }

  role() {
    return this.getData('role')
  }

  roleValue() {
    switch (this.getData('role')) {
      case 1:
        return 'admin'
      case 2:
        return 'humanresources'
      case 3:
        return 'manager'
      case 4:
        return 'staff'
    }
  }

  profile() {
    return this.getData('profile')
  }

  getData(field) {
    if (this.data == null) {
      return null
    }
    // eslint-disable-next-line no-prototype-builtins
    if (this.data.hasOwnProperty(field)) {
      return this.data[field]
    }
    return null
  }

  loginAction(response) {
    this.store.commit('user/saveUserInfo', response)
    this.data = response
  }

  logoutAction() {
    this.store.commit('user/logoutAction')
    this.data = null
  }
}
