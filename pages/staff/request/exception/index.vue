<template>
  <Exception />
</template>

<script>
import FrontendBase from '~/components/layouts/FrontendBase'
import Exception from '@/components/request/exception'

export default {
  components: {
    Exception,
  },
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'staff',
}
</script>
