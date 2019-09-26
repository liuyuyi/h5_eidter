import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store';
import '@/style/common.scss'
import '@/assets/iconfont/iconfont.js'
import UiIcon from '@/components/iconfont/'

Vue.config.productionTip = false
// iconfont svg图标
Vue.component('UiIcon', UiIcon);

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
