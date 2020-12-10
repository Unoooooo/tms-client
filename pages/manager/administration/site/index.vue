<template>
  <Site />
</template>

<script>
import FrontendBase from '~/components/layouts/FrontendBase'
import Site from '@/components/administration/site'

export default {
  components: {
    Site,
  },
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'manager',
}
</script>
