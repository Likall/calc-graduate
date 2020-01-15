import types from 'student_type'

const state = {
    studentGradeList: [],				// 学生成绩信息
}

var getters = {
	studentGradeList: state => {
        return state.studentGradeList
    },
    
}

const actions = {
	// 设置学生成绩列表
	setStudentGradeList: ({
        commit,
        state
    }, value) => {
        commit(types.SET_STUDENTGRADELIST, value)
    },
}

const mutations = {
    [types.SET_STUDENTGRADELIST](state, value) {
        state.studentGradeLists = value
	},
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}