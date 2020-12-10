<template>
  <SystemSettings />
</template>

<script>
import FrontendBase from '~/components/layouts/FrontendBase'
import SystemSettings from '@/components/administration/system-settings'

export default {
  components: {
    SystemSettings,
  },
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'admin',
}
</script>
