import types from './course_type'

const state = {
	courseList: [],				// 课程列表
	courseGradeSection: [],		// 课程分段
	courseAverage: [],		// 课程平均分
	courseName: [],				// 课程名称
	overAvgStuInfo: [],			// 达到课程平均分的学生信息
	courseDemandList: [],		// 课程指标点列表
}
var getters = {
	courseList: state => {
		return state.courseList
	  },
	courseGradeSection: state => {
		return state.courseGradeSection
	  },
	courseAverage: state => {
		return state.courseAverage
	  },
	courseName: state => {
		return state.courseName
	  },
	overAvgStuInfo: state => {
		return state.overAvgStuInfo
	},
	courseDemandList: state => {
		return state.courseDemandList
	},
}

const actions = {
	// 课程分段
	setCourseList: ({
        commit,
        state
    }, value) => {
        commit(types.SET_COURSELIST, value)
	  },
	// 课程模板文件列
	setCourseGradeSection: ({
        commit,
        state
    }, value) => {
        commit(types.SET_COURSEGRADESECTION, value)
	  },
	  // 课程平均分
	setCourseAverage: ({
        commit,
        state
    }, value) => {
        commit(types.SET_COURSEAVERAGE, value)
	  },
	  // 课程名称
	setCourseName: ({
        commit,
        state
    }, value) => {
        commit(types.SET_COURSENAME, value)
	  },
	   // 设置达到课程平均分的人数
	setOverAvgStuInfo: ({
        commit,
        state
    }, value) => {
        commit(types.SET_OVERAVGSTUINFO, value)
	  },
	// 设置课程指标点列表
	setCourseDemandList: ({
        commit,
        state
    }, value) => {
        commit(types.SET_COURSEDEMANDLIST, value)
  	},
}

const mutations = {
	[types.SET_COURSELIST](state, value) {
        state.courseList = value
	},
	[types.SET_COURSEGRADESECTION](state, value) {
        state.courseGradeSection = value
	},  
	[types.SET_COURSEAVERAGE](state, value) {
        state.courseAverage = value
	},
	[types.SET_COURSENAME](state, value) {
        state.courseName = value
	}, 
	[types.SET_OVERAVGSTUINFO](state, value) {
        state.overAvgStuInfo = value
	},
	[types.SET_COURSEDEMANDLIST](state, value) {
        state.courseDemandList = value
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