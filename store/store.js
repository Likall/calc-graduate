import Vue from 'vue'
import Vuex from 'vuex'
// 引入vuex模块
import index from './index'
import header from './modules/header'
Vue.use(Vuex)
export default new Vuex.Store({
	modules: {
		index,
		header
	}
})