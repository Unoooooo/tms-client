<template>
  <Jobservice />
</template>

<script>
import FrontendBase from '~/components/layouts/FrontendBase'
import Jobservice from '@/components/administration/jobservice'

export default {
  components: {
    Jobservice,
  },
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'admin',
}
</script>
