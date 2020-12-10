<template>
  <Dashboard />
</template>

<script>
import FrontendBase from '~/components/layouts/FrontendBase'
import Dashboard from '@/components/administration/dashboard'

export default {
  components: {
    Dashboard,
  },
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'humanresources',
}
</script>
