<template>
  <Abnormal />
</template>

<script>
import FrontendBase from '~/components/layouts/FrontendBase'
import Abnormal from '@/components/report/overtime'

export default {
  components: {
    Abnormal,
  },
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'staff',
}
</script>
