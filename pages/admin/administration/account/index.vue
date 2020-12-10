<template>
  <Account />
</template>

<script>
import FrontendBase from '~/components/layouts/FrontendBase'
import Account from '@/components/administration/account'

export default {
  components: {
    Account,
  },
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'admin',
}
</script>
