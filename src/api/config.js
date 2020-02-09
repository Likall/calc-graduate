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
}