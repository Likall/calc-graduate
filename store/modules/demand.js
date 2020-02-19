import types from './demand_type'

const state = {
	demandList: [],			// 毕业要求列表
}
var getters = {
	demandList: state => {
		return state.demandList
	  },
}

const actions = {
	// 设置毕业要求列表
	setDemandList: ({
        commit,
        state
    }, value) => {
        commit(types.SET_DEMANDLIST, value)
	},
}

const mutations = {
	[types.SET_DEMANDLIST](state, value) {
        state.demandList = value
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