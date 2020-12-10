<template>
  <Explanation />
</template>

<script>
import FrontendBase from '~/components/layouts/FrontendBase'
import Explanation from '@/components/request/explanation'

export default {
  components: {
    Explanation,
  },
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'manager',
}
</script>
