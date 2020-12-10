require('dotenv').config()
export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // server: {
  //   port: process.env.APP_PORT || 3000, // default: 3000
  //   host: 'localhost', // default: localhost
  // },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: process.env.APP_NAME || 'spa',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1',
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.APP_DESCRIPTION || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '~/assets/css/tailwind.css',
    'element-ui/lib/theme-chalk/index.css',
    'animate.css/animate.min.css',
    '~/assets/css/page-transition.css',
    '~/assets/css/main.css',
    'element-ui/lib/theme-chalk/index.css',
    'assets/css/util.css',
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/consola',
    '~/plugins/axios',
    '~/plugins/services',
    '~/plugins/element-ui',
    '~/plugins/mixin',
    '~/plugins/component',
    '~/plugins/i18n',
    '~/plugins/nuxt-client-init',
    { src: '~/plugins/swiper', ssr: false },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
    '@nuxtjs/fontawesome',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources',
    'vue-scrollto/nuxt',
  ],

  styleResources: {
    scss: [
      './assets/scss/mixin/main-mixin.scss',
      './assets/scss/variables.scss',
      
    ],
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    // baseURL: process.env.URL_API + '/api',
    // https: false,
    baseURL: 'https://time-management-system-fpt.herokuapp.com/api',
    https: true,
    proxy: false,
    // debug: 'debug',
  },

  proxy: {
    '/api/': {
      target: 'http://localhost:8080/',
      pathRewrite: { '^/api/': '' },
    },
  },

  fontawesome: {
    component: 'fa',
    icons: {
      solid: true,
      brands: true,
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    postcss: {
      plugins: {
        tailwindcss: './tailwind.config.js',
      },
    },
    transpile: [/^element-ui/],
    extend(config, ctx) {
      // Run ESLint on save
      // if (ctx.isDev && ctx.isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules)/,
      //   })
      // }
    },
    babel: { compact: true },
  },
}
