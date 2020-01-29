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
			component: 'RelDemandAndCourseDetail'
		},
		
		{
			title: '达成度',
			key: '4',
			icon: 'icon-tongji',
			component: 'AchevementDetail'
		},
		{
			title: '专业计划',
			key: '5',
			icon: 'icon-jihua',
			component: 'PlanDetail'
		},

	],
	detailCurrentComponent: '',				// 详情加载的组件
	courseColumns: [],						// 课程模板文件列
	courseData: [],								// 课程模板文件数据
	studentColumns: [],						// 学生模板文件列
	studentData: [],							// 学生模板文件数据
	relDemandAndCourseColumns: [],			// 课程指标点与课程模板文件列
	relDemandAndCourseData: [],				// 课程指标点与课程模板文件数据
	currentUser: [],							// 登录用户信息
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
	},
	courseColumns: state => {
        return state.courseColumns
	},
	courseData: state => {
        return state.courseData
	},
	studentColumns: state => {
		return state.studentColumns
	},
	studentData: state => {
        return state.studentData
	},
	relDemandAndCourseColumns: state => {
        return state.relDemandAndCourseColumns
	},
	relDemandAndCourseData: state => {
		return state.relDemandAndCourseData
	},
	currentUser: state => {
		return state.currentUser
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
	// 课程模板文件列
	setCourseColumns: ({
        commit,
        state
    }, value) => {
        commit(types.SET_COURSECOLUMNS, value)
	},
	// 课程模板文件数据
	setCourseData: ({
		commit,
		state
	}, value) => {
		commit(types.SET_COURSEDATA, value)
	},
	// 课程学生信息模板文件列
	setStudentColumns: ({
        commit,
        state
    }, value) => {
        commit(types.SET_STUDENTCOLUMNS, value)
	},
	// 课程学生文模板件数据
	setStudentData: ({
		commit,
		state
	}, value) => {
		commit(types.SET_STUDENTDATA, value)
	},
	// 设置课程与指标点关系模板文件列
	setRelDemandAndCourseColumns: ({
        commit,
        state
    }, value) => {
        commit(types.SET_RELDEMANDANDCOURSECOLUMNS, value)
	},
	// 设置课程与指标点关系模板文件数据
	setRelDemandAndCourseData: ({
		commit,
		state
	}, value) => {
		commit(types.SET_RELDEMANDANDCOURSEDATA, value)
	},
	// 设置当前登录用户信息
	setCurrentUser: ({
		commit,
		state
	}, value) => {
		commit(types.SET_CURRENTUSER, value)
	}
}
const mutations = {
	[types.SET_TABTITLEITEM](state, value) {
        state.tabTitleItem = value
	},
	[types.SET_DETAILCURRENTCOMPONENT](state, value) {
		state.detailCurrentComponent = value
	},
	[types.SET_COURSECOLUMNS](state, value) {
        state.courseColumns = value
	},
	[types.SET_COURSEDATA](state, value) {
		state.courseData = value
	},
	[types.SET_STUDENTCOLUMNS](state, value) {
        state.studentColumns = value
	},
	[types.SET_STUDENTDATA](state, value) {
		state.studentData = value
	},
	[types.SET_RELDEMANDANDCOURSECOLUMNS](state, value) {
        state.relDemandAndCourseColumns = value
	},
	[types.SET_RELDEMANDANDCOURSEDATA](state, value) {
		state.relDemandAndCourseData = value
	},
	[types.SET_CURRENTUSER](state, value) {
		state.currentUser = value
	},
	
}
// 导出
export default {
  state,
  getters,
  actions,
  mutations
}