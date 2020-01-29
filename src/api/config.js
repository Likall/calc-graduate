const APP_DOMAIN = "http://localhost:8091/gacs"


export default {
	LOGIN: APP_DOMAIN + '/user/login',				// 用户登录 
	GET_ALL_COURSE_LIST: APP_DOMAIN + '/course/getAllCourse',	// 获得课程列表
	UPDATE_COURSE_INFO: APP_DOMAIN + '/course/updateCourse',  // 更新课程信息
	DELETE_COURSE_INFO: APP_DOMAIN + '/course/deleteCourse',	// 删除课程
}