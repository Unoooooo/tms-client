<template>
  <Actual />
</template>

<script>
import FrontendBase from '~/components/layouts/FrontendBase'
import Actual from '~/components/report/actual.vue'

export default {
  components: {
    Actual,
  },
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'staff',
}
</script>
