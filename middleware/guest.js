import Vue from 'vue'

export default function ({ redirect }) {
  const $authInfo = Vue.prototype.$authInfo
  if ($authInfo.checkAuth()) {
    let role = $authInfo.role()
    switch (role) {
      case 1:
        return redirect({ name: 'admin' })
      case 2:
        return redirect({ name: 'humanresources' })
      case 3:
        return redirect({ name: 'manager' })
      case 4:
        return redirect({ name: 'staff' })
      default:
        return redirect({ name: 'admin' })
    }
  }
}
