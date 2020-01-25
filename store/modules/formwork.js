import types from './formwork_type'

const state = {
	studentGrade: [			// 学生成绩模板
		'学号',
		'姓名',
		'课程号',
		'课程名',
		'课程分'
	],
	studentCourse: [
		'课程号',
		'课程名称',
		'课程学分',
		'课程总分制',
		'学期'
	],
	studentCourseColums: [
		
	]
}
var getters = {
	studentGrade: state => {
		return state.studentGrade
	},
	studentCourse: state => {
		return state.studentCourse
	},
}

export default {
	namespaced: true,
	state,
	getters
}