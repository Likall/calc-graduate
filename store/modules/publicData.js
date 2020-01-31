import types from './public_type'

const state = {
  tabTitleItem: [],						// 顶部tab
  detailCurrentComponent: '',			// 详情加载的组件
  currentPage: 0,						// 步骤条当前页
}

var getters = {
	tabTitleItem: state => {
        return state.tabTitleItem
	},
	detailCurrentComponent: state => {
		return state.detailCurrentComponent
	},
	currentPage: state => {
		return state.currentPage
	}
}

const actions = {
	// 设置menu是否折叠
	setTabTitleItem: ({
        commit,
        state
    }, value) => {
        commit(types.SET_TABTITLEITEM, value)
  },
  // 设置当前详情加载组件
	setDetailCurrentComponent: ({
		commit,
		state
	}, value) => {
		commit(types.SET_DETAILCURRENTCOMPONENT, value)
	},
	// 设置当前步骤条加载的页
	setCurrentPage: ({
		commit,
		state
	}, value) => {
		commit(types.SET_CURRENTPAGE, value)
	},
}

const mutations = {
	[types.SET_TABTITLEITEM](state, value) {
        state.tabTitleItem = value
	},
	[types.SET_DETAILCURRENTCOMPONENT](state, value) {
		state.detailCurrentComponent = value
	},
	[types.SET_CURRENTPAGE](state, value) {
		state.currentPage = value
	},
	  
}

// 导出
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}