<template>
  <section-block title="Home page"></section-block>
</template>

<script>
import FrontendBase from '~/components/layouts/FrontendBase'

export default {
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'auth',
  data() {
    return {}
  },
  created() {
    let redirect
    switch (this.$authInfo.role()) {
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
}
</script>
