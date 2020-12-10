<template>
  <Overtime />
</template>

<script>
import FrontendBase from '~/components/layouts/FrontendBase'
import Overtime from '@/components/report/overtime'

export default {
  components: {
    Overtime,
  },
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'humanresources',
}
</script>
