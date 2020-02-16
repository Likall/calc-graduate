import types from './student_type'

const state = {
    studentGradeList: [],				// 学生成绩信息
    studentList: [],                    // 学生信息
}

var getters = {
	studentGradeList: state => {
        return state.studentGradeList
    },
    studentList: state => {
        return state.studentList
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
    // 设置学生信息
    setStudentList: ({
        commit,
        state
    }, value) => {
        commit(types.SET_STUDENTLIST, value)
    },
}

const mutations = {
    [types.SET_STUDENTGRADELIST](state, value) {
        state.studentGradeList = value
    },
    [types.SET_STUDENTLIST](state, value) {
        state.studentList = value
    },
    
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}