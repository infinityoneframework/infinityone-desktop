import Vue from "vue"
import "./plugins"
import 'path'
import store from "./store"
import App from "./App.vue"
import router from "./router"
import domain from '@/utils/domain-util'
import i18n from "./i18n"
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import config from '@/utils/config-util'
import VuetifyConfirm from 'vuetify-confirm'
import Logger from '@/utils/logger-util'
require('./server-manager')
require('./tray')

Vue.use(VuetifyConfirm, { vuetify })

Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV === 'development'

window.myLogger = Logger
domain.setStore(store)
config.reloadDB()
domain.reloadDB()
window.store = store

new Vue({
  store,
  router,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount("#app")
