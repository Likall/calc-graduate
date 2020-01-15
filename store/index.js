import types from './types'

const state = {
	tabTitleItem: [],						// 顶部tab
	leftBarList: [
		{
			title: '课程',
			key: '1',
			icon: 'icon-kecheng',
			component: 'CourseDetail'
		},
		{
			title: '毕业要求',
			key: '2',
			icon: 'icon-demand',
			component: 'DemandDetail'
		},
		{
			title: '指标点与课程关系',
			key: '3',
			icon: 'icon-guanxi',
			component: 'RelationDetail'
		},
		
		{
			title: '达成度',
			key: '4',
			icon: 'icon-tongji',
			component: 'ReachingDetail'
		},
		{
			title: '专业计划',
			key: '5',
			icon: 'icon-jihua',
			component: 'PlanDetail'
		},

	],
	detailCurrentComponent: '',				// 详情加载的组件
}
var getters = {
	tabTitleItem: state => {
        return state.tabTitleItem
	},
	leftBarList: state => {
        return state.leftBarList
	},
	detailCurrentComponent: state => {
		return state.detailCurrentComponent
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
	}
}
const mutations = {
	[types.SET_TABTITLEITEM](state, value) {
        state.tabTitleItem = value
	},
	[types.SET_DETAILCURRENTCOMPONENT](state, value) {
		state.detailCurrentComponent = value
	}
}
// 导出
export default {
  state,
  getters,
  actions,
  mutations
}