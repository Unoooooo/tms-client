import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default ({ app }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    // locale: store.state.user.locale,
    locale: 'en',
    // fallbackLocale: store.state.user.locale,
    messages: {
      en: require('~/locales/en.json'),
      vi: require('~/locales/vi.json'),
    },
    silentTranslationWarn: true,
  })

  // app.i18n.path = (link) => {
  //     if (app.i18n.locale === app.i18n.fallbackLocale) {
  //         return `/${link}`
  //     }
  //
  //     return `/${app.i18n.locale}/${link}`
  // }
}
