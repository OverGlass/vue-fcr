import Vue from 'vue'
import VueFcr from './components/demo/test.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(VueFcr)
}).$mount('#app')
