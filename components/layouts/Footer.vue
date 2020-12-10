<template>
  <footer
    class="page-footer border-top bg-white"
    :class="{ 'ss-footer': isSSPage }"
  >
    <div>
      <span class="text-muted">©&nbsp;TMS&nbsp;Tool</span>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      isSSPage: false,
    }
  },
  created() {
    this.initData()
  },
  mounted() {},
  methods: {
    initData() {
      let role = this.$authInfo.role()
      switch (role) {
        case 1:
          this.isSSPage = false
          break
        case 3:
          this.isSSPage = true
          break
        default:
          break
      }
    },
  },
}
</script>

<style lang="scss">
.ss-footer {
  justify-content: normal !important;
}
</style>
