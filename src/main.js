// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Antd from 'ant-design-vue'
import echarts from "echarts"
import store from '../store/store'
import axios from 'axios'
import ViewUI from 'view-design'
import VueCookies from 'vue-cookies'
import 'jquery'
import 'view-design/dist/styles/iview.css';
import 'ant-design-vue/dist/antd.css';
import './assets/iconfont/css/iconfont.css'
import './public/css/style.css'
import './public/css/overwrite.scss'
Vue.config.productionTip = false
Vue.use(Antd)
Vue.prototype.$echarts = echarts;
Vue.prototype.axios = axios;
Vue.use(ViewUI);
Vue.prototype.$cookie = VueCookies;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
