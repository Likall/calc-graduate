const APP_DOMAIN = "http://localhost:8091/gacs"


export default {
	LOGIN: APP_DOMAIN + '/user/login',									// 用户登录 
	GET_ALL_COURSE_LIST: APP_DOMAIN + '/course/list',					// 获得课程列表
	UPDATE_COURSE_INFO: APP_DOMAIN + '/course/updateCourse',  			// 更新课程信息
	DELETE_COURSE_INFO: APP_DOMAIN + '/course/deleteCourse',			// 删除课程
	GET_ALL_STUDENT_LIST: APP_DOMAIN + '/student/list',					// 获得学生列表
	GET_ALL_DEMAND2_LIST: APP_DOMAIN + '/demand/list',					// 获得指标点2列表
	GET_QUOTA_CALCULATE: APP_DOMAIN + '/quota/calculate',				// 毕业达成度计算结果
	GET_QOUTA_CACULATE_BY_D2ID: APP_DOMAIN + 'quota/list', 				// 获取二级毕业要求下的计算结果
	GET_GRADE_SECTION: APP_DOMAIN + '/grade/gradeSection',				// 获取成绩分段
	GET_GRADE_LIST: APP_DOMAIN + '/grade/list',							// 获取学生课程信息
	GET_OVER_AVG_STU_INFO: APP_DOMAIN + '/course/overAvgStuInfo',		// 获取达到课程平均分人数的信息
	ADD_USER: APP_DOMAIN + '/user/add',									// 增加用户
	GET_USER_STU_LIST: APP_DOMAIN + '/user/userlist',					// 获取学生用户列表
	GET_USER_LIST: APP_DOMAIN + '/user/list',							// 获取所有用户列表
	DELETE_USER: APP_DOMAIN + '/user/delete',							// 删除用户
	UPDATE_PSW: APP_DOMAIN + '/user/updatePsw',							// 更新用户密码
	UPDATE_DEMAND: APP_DOMAIN + '/demand/updateDemand',	 				// 更新毕业要求
	UPDATE_DEMAND2: APP_DOMAIN + '/demand/updateDemand2',	 			// 更新二级毕业要求
	GET_COURSE_DEMAND_LIST: APP_DOMAIN + '/quota/demandCourse',			// 获取课程与毕业要求关系列表
	GET_GRADE_LIST: APP_DOMAIN + '/course/courseStudent',				// 获取成绩列表信息
	UPDATE_WEIGHT: APP_DOMAIN + '/quota/updateWeight',					// 更新权重值
	UPDATE_STUDENT: APP_DOMAIN + '/student/updateStudent',				// 更新学生信息
	DELETE_STUDENT: APP_DOMAIN + '/student/deleteStudent',				// 删除指定用户
	UPDATE_GRADE: APP_DOMAIN + '/grade/updateGrade',					// 更新课程成绩值
	GET_COURSE_LIST_BY_NAME: APP_DOMAIN + '/course/getCourseByName',	// 根据姓名查询模糊查询获取课程列表
	FILTER_STUDENTS: APP_DOMAIN + '/student/filterStudents',		// 根据学号、姓名模糊查询学生列表
	ADD_STUDENT_GRADE: APP_DOMAIN + '/course/addStudentAndGrade',			// 添加学生-与学生成绩
	ADD_COURSE: APP_DOMAIN + '/course/addCourse',					// 添加课程
}