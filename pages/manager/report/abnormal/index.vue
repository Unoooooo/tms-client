<template>
  <Abnormal />
</template>

<script>
import FrontendBase from '~/components/layouts/FrontendBase'
import Abnormal from '@/components/report/abnormal'

export default {
  components: {
    Abnormal,
  },
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'manager',
}
</script>
