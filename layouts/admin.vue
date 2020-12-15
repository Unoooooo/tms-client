<template>
  <section class="layout">
    <aside
      class="layout-aside aside-fixed"
      :class="{ 'aside-collapse': collapseAside }"
    >
      <logo :collapse="collapseAside"></logo>
      <aside-menu :collapse="collapseAside"></aside-menu>
    </aside>

    <section
      class="layout layout-main"
      :class="{ 'layout-collapse': collapseAside }"
    >
      <div
        class="layout-header flex justify-between items-center text-gray-600"
      >
        <div class="flex justify-start items-center">
          <div class="collapse-btn" @click="updateCollapseAside()">
            <i class="el-icon-s-fold"></i>
          </div>
        </div>
        <HeaderProfile />
      </div>
      <div
        ref="mainBox"
        class="relative"
        :style="{ padding: screenWidth < 500 ? '5px' : '20px' }"
      >
        <nuxt v-if="isRouterAlive"></nuxt>
      </div>
    </section>
  </section>
</template>

<script>
export default {
  data() {
    return {
      isRouterAlive: true,
      collapseAside: false,
    }
  },

  computed: {
    screenWidth() {
      return window.innerWidth
    },
  },

  created() {
    this.collapseAside = this.screenWidth < 500 ? true : false
  },

  provide() {
    return {
      reloadPage: this.reloadPage,
    }
  },

  methods: {
    reloadPage() {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    updateCollapseAside() {
      this.collapseAside = !this.collapseAside
    },
  },
}
</script>

<style scoped lang="scss">
.layout {
  display: flex;
  flex: auto;
  min-height: 0;
  background: #f0f2f5;
  box-sizing: border-box;
  flex-direction: row;

  .layout-aside {
    width: 256px;
    background: #001529;
    transition: all 0.3s ease-in-out;
    box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);

    &.aside-collapse {
      flex: 0 0 80px;
      width: 80px;
      @media only screen and (max-width: 650px) {
        display: none;
      }
    }

    &.aside-fixed {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10;
      min-height: 100vh;
    }
  }
}

.layout-main {
  width: 100%;
  flex-direction: column;
  min-height: 100vh;
  transition: all 0.3s ease-in-out;
  padding-left: 256px;
  &.layout-collapse {
    padding-left: 80px;
    @media only screen and (max-width: 650px) {
      padding-left: 0px;
    }
  }
}

.layout-header {
  width: 100%;
  height: 64px;
  padding: 0;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.collapse-btn {
  font-size: 24px;
  padding-left: 20px;
  height: 64px;
  display: flex;
  align-items: center;
}

.logo {
  padding: 0 10px;

  img {
    width: 40px;
  }
}
</style>
