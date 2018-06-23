import Vue from 'vue'
import VueFcr from './components/VueFcr'

Vue.config.productionTip = false

new Vue({
  render: h => h(VueFcr)
}).$mount('#app')
