<template>
  <Checkinout />
</template>

<script>
import FrontendBase from '~/components/layouts/FrontendBase'
import Checkinout from '@/components/report/checkinout'

export default {
  components: {
    Checkinout,
  },
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'manager',
}
</script>
