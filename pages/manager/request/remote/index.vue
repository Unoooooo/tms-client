<template>
  <Remote />
</template>

<script>
import FrontendBase from '~/components/layouts/FrontendBase'
import Remote from '@/components/request/remote'

export default {
  components: {
    Remote,
  },
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'manager',
}
</script>
