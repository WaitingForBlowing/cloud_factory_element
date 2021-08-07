import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import '@/core/plugins/element'
import '@/core/plugins/ls'
import '@/core/loadcss'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
