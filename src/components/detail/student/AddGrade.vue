<template>
	<div class="addGradeContainer">
		<a-form :form="addGradeForm" >
			
		</a-form>
	</div>

	
</template>
<script>
	import config from '@/api/config.js'  
    import tools from '@/public/tools/tools'
	import { mapGetters, mapActions } from 'vuex';
	export default {
		name: 'AddGrade',
		data() {
			return {
				addGradeForm: this.$form.createForm(this, { name: 'addGrade' }),		// 表单
				confirmDirty: false,
				formItemLayout: {
					labelCol: {
						xs: { span: 7 },
						sm: { span: 10 },
						},
					wrapperCol: {
						xs: { span: 12 },
						sm: { span: 12 },
					},
				},
				spinning: false,														// loading状态
			}
		},
		computed:{
			...mapGetters({
				userList: 'user/userList',				// 用户列表
				studentList: 'student/studentList',		// 学生列表
				courseList: 'course/courseList',		// 课程列表
			
			})
		},
		mounted() {
			this.checkHasLoadCourseInfo()
		},
		methods: {
			...mapActions({
				setUserList: 'user/setUserList',		// 设置用户列表
				setCourseList: 'course/setCourseList',		// 设置学生列表
			}),

			/**
			* Introduction 判断是否已加载课程列表
			* @author 刘莉
			* @since 1.0
			*/
			checkHasLoadCourseInfo(){
				let exsist = tools.deepClone(this.courseList)
				if (exsist.length <= 0) {
					this.getCourseInfo()
				} else {
					this.courseData = exsist
				}
			},

			// 获取列表数据
			getCourseInfo(){
				let self = this
				let restData = {
					"pageNum": 0,
					"pageSize": 0,
				}
				
				self.axios.post(config.GET_ALL_COURSE_LIST, restData).then(response =>{
					// 查询成功
					if (response.data.code === '200'){
						// 有数据
						if (response.data.data.total > 0){
							// 设置课程列表
							let course = response.data.data.list
							self.setCourseList(course)
							self.courseData = tools.deepClone(self.courseList)
						}
					}else {
						self.$message.error('查询失败')
                    	this.spinning = false
					}
				})
			},
		}
		
	}
</script>
<style lang="scss" scoped>
.addGradeContainer{
	position: relative;
	display: flex;
	
	.extra{
		font-size: 12px;
		display: inline-block;
		padding-left: 5px;
	}

	.ant-table-wrapper {}
	background: #ffffff;
	

	// 下拉框
	.ant-select-selection-selected-value{
		color: black;
	}
	/deep/ .ant-form-item-control{
		white-space: nowrap;
	}
	/deep/ .ant-form-item-label{
		color: black;
		font-weight: bolder;
	}

	/deep/ .ant-form-item-children{
		width: 190px;
    	display: inline-block
	}
}
</style>