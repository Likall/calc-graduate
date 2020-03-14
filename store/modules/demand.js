import types from './demand_type'

const state = {
	demandList: [],			// 毕业要求列表
	originDataSource: [],	// 毕业要求数据源
}
var getters = {
	demandList: state => {
		return state.demandList
		},
	originDataSource: state => {
		return state.originDataSource
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
	// 设置毕业要求列表
	setOriginDataSource: ({
		commit,
		state
	}, value) => {
			commit(types.SET_ORIGINDATASOURCE, value)
	},
}

const mutations = {
	[types.SET_DEMANDLIST](state, value) {
        state.demandList = value
	},
	[types.SET_ORIGINDATASOURCE](state, value) {
		state.originDataSource = value
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