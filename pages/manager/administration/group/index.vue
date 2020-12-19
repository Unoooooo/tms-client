<template>
  <Group />
</template>

<script>
import FrontendBase from '~/components/layouts/FrontendBase'
import Group from '@/components/administration/group'

export default {
  components: {
    Group,
  },
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'manager',
}
</script>
