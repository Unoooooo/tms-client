<template>
  <Monthly />
</template>

<script>
import FrontendBase from '~/components/layouts/FrontendBase'
import Monthly from '@/components/report/monthly'

export default {
  components: {
    Monthly,
  },
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'staff',
}
</script>
