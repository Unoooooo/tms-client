<template>
  <Absence />
</template>

<script>
import FrontendBase from '~/components/layouts/FrontendBase'
import Absence from '@/components/request/absence'

export default {
  components: {
    Absence,
  },
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'staff',
}
</script>
