import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
// 引入vuex模块
import index from './index'
import header from './modules/header'
import formwork from './modules/formwork'
import student from './modules/student'
Vue.use(Vuex)
export default new Vuex.Store({
	modules: {
		index,
		header,
		formwork,
		student
	},
	plugins: [createPersistedState({
		storage: window.localstorage,
　　　 reducer(val) {
				return {
					// 只储存state中的user
					index: val.index
				}
			}
	})]
})