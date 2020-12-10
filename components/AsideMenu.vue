<template>
  <div>
    <el-menu
      class="menu-vertical"
      router
      :collapse="collapse"
      :default-active="activeRoute"
      unique-opened
      @close="handleClose"
    >
      <template v-for="menu in menus">
        <el-menu-item
          v-if="menu.children == false"
          :key="menu.key"
          :index="menu.key"
          :route="{ path: menu.path }"
        >
          <i class="icon" :class="menu.icon"></i>
          <span slot="title">{{ menu.name }}</span>
        </el-menu-item>

        <el-submenu v-else :key="menu.key" :index="menu.key">
          <template slot="title">
            <i class="icon" :class="menu.icon"></i>
            <span slot="title">{{ menu.name }}</span>
          </template>
          <el-menu-item
            v-for="subMenu in menu.children"
            :key="subMenu.key"
            :index="subMenu.key"
            :route="{ path: subMenu.path }"
          >
            <span>{{ subMenu.name }}</span>
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
.icon {
  font-size: 20px;
}

.menu-vertical:not(.el-menu--collapse) {
  width: 256px;
}
.el-submenu .el-menu-item {
  margin-left: 20px;
}
.el-menu--collapse {
  width: 80px;

  .collapse-text-center {
    text-align: center;
  }
}
</style>

<script>
import MenuAdmin from '~/config/menu_admin.js'
import MenuHr from '~/config/menu_hr.js'
import MenuManager from '~/config/menu_manager.js'
import MenuStaff from '~/config/menu_staff.js'

export default {
  name: 'AsideMenu',
  // eslint-disable-next-line vue/require-prop-types
  props: ['collapse'],

  data() {
    return {
      activeRoute: 'index',
      menus: '',
    }
  },

  watch: {
    $route(newVal) {
      this.activeRoute = this.parseRoute(newVal.path)
    },
  },

  created() {
    let role = this.$authInfo.role()
    switch (role) {
      case 1:
        this.menus = MenuAdmin
        break
      case 2:
        this.menus = MenuHr
        break
      case 3:
        this.menus = MenuManager
        break
      case 4:
        this.menus = MenuStaff
        break
      default:
        break
    }
    this.activeRoute = this.parseRoute(this.$route.path)
  },

  methods: {
    parseRoute(fullPath) {
      if (fullPath == '/') {
        return 'index'
      }
      let segmentation = fullPath.split('/')
      if (segmentation[0] === '') {
        segmentation.shift()
      }

      if (segmentation.length < 2) {
        return segmentation[0]
      }

      let res = segmentation.filter((item) => {
        return !/^\d+$/.test(item)
      })

      return res.join('-')
    },

    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
  },
}
</script>
