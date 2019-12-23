// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Antd from 'ant-design-vue'
import echarts from "echarts"
import 'ant-design-vue/dist/antd.css';
import './assets/iconfont/css/iconfont.css'
Vue.config.productionTip = false
Vue.use(Antd)
Vue.prototype.$echarts = echarts;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
