const APP_DOMAIN = "http://localhost:8091/gacs"


export default {
	LOGIN: APP_DOMAIN + '/user/login',				// 用户登录 
	GET_ALL_COURSE_LIST: APP_DOMAIN + '/course/list',	// 获得课程列表
	UPDATE_COURSE_INFO: APP_DOMAIN + '/course/updateCourse',  // 更新课程信息
	DELETE_COURSE_INFO: APP_DOMAIN + '/course/deleteCourse',	// 删除课程
	GET_ALL_STUDENT_LIST: APP_DOMAIN + '/student/list',		// 获得学生列表
	GET_ALL_DEMAND2_LIST: APP_DOMAIN + '/demand/list',		// 获得指标点2列表
	GET_QUOTA_CALCULATE: APP_DOMAIN + '/quota/calculate',	// 毕业达成度计算结果
	GET_QOUTA_CACULATE_BY_D2ID: APP_DOMAIN + 'quota/list', // 获取二级毕业要求下的计算结果
	GET_GRADE_SECTION: APP_DOMAIN + '/grade/gradeSection',	// 获取成绩分段
	GET_GRADE_LIST: APP_DOMAIN + '/grade/list',	// 获取学生课程信息
	GET_OVER_AVG_STU_INFO: APP_DOMAIN + '/course/overAvgStuInfo',	// 获取达到课程平均分人数的信息
	ADD_USER: APP_DOMAIN + '/user/add',		// 增加用户
	GET_USER_STU_LIST: APP_DOMAIN + '/user/userlist',	// 获取学生用户列表
	GET_USER_LIST: APP_DOMAIN + '/user/list',					// 获取所有用户列表
	DELETE_USER: APP_DOMAIN + '/user/delete',					// 删除用户
}