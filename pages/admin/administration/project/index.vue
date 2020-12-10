<template>
  <Project />
</template>

<script>
import FrontendBase from '~/components/layouts/FrontendBase'
import Project from '@/components/administration/project'

export default {
  components: {
    Project,
  },
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'admin',
}
</script>
