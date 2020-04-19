<template>
	<div class="addCourseContainer">
		<a-form :form="addCourseForm" >
			<a-form-item v-bind="formItemLayout" label="课程名称">
				<a-input
					style="width: 186px" 
					v-decorator="[
					'course_name',
					{
						rules: [
						{
							required: true,
							message: '请输入课程名称!',
						},
						],
					},
					]"
				/>
			</a-form-item>
			<a-form-item v-bind="formItemLayout" label="学分" >
				<a-input
					style="width: 186px" 
					v-decorator="[
					'course_credit',
					{
						rules: [
						{
							required: true,
							message: '请输入学分!',
						},
						],
					},
					]"
				/>
			</a-form-item>
			<a-form-item v-bind="formItemLayout" label="学期" >
				<a-input-number
					style="width: 186px" 
					v-decorator="[
					'course_term',
					{
						rules: [
						{
							required: true,
							message: '请输入学期!',
						},
						],
					},
					]"
				/>
			</a-form-item>
			<a-form-item v-bind="formItemLayout" label="平均分" >
				<a-input-number
					style="width: 186px" 
					v-decorator="[
					'course_average',
					{
						rules: [
						{
							required: true,
							message: '请输入平均分!',
						},
						],
					},
					]"
				/>
			</a-form-item>
			<a-form-item v-bind="formItemLayout" label="总分制" >
				<a-input-number
					style="width: 186px" 
					v-decorator="[
					'course_total_grade',
					{
						rules: [
						{
							required: true,
							message: '请输入总分制!',
						},
						],
					},
					]"
				/>
			</a-form-item>
			<a-form-item :wrapper-col="{ span: 12, offset: 12 }">
				<a-button type="primary" @click="handleSubmit">
					确定
				</a-button>
				<a-button type="default" style="margin-left: 10px;" @click="handleCancle">
					取消
				</a-button>
			</a-form-item>
		</a-form>
	</div>

	
</template>
<script>
	import config from '@/api/config.js'  
    import tools from '@/public/tools/tools'
	import { mapGetters, mapActions } from 'vuex';
	export default {
		name: 'AddCourse',
		data() {
			return {
				addCourseForm: this.$form.createForm(this, { name: 'addCourse' }),		// 表单
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
				validAccount: '',					// 验证登录账户
				validPsw: '',						// 验证密码
				validConfirmPsw: '',				// 验证确认密码
				userData: [],						// 学生列表
			}
		},
		computed:{
			...mapGetters({
				userList: 'user/userList',				// 用户列表
				studentList: 'student/studentList',		// 学生列表
			})
		},
		mounted() {
			this.getStudentList()
		},
		methods: {
			...mapActions({
				setUserList: 'user/setUserList',		// 设置用户列表
				setStudentList: 'student/setStudentList',		// 设置学生列表
			}),
			/**
			 * Introduction 添加课程，添加课程与指标点关系
			 * @author 刘莉
			 * @since 1.0
			 */
			handleSubmit(e) {
				e.preventDefault();
				let self = this;

				self.addCourseForm.validateFieldsAndScroll((err, values) => {

					if (!err) {
						let resData = {
							courseName: values.course_name,
							courseCredit: values.course_credit,
							courseTerm: values.course_term,
							courseTotalGrade: values.course_total_grade,
							courseAverage: values.course_average 
						}
						// 添加课程 ， 课程与质指标点关系
						self.axios.post(config.ADD_COURSE, resData).then(response => {
							if (response.data.code === '200') {
								self.$message.success(response.data.msg)
							}
							else {
								self.$message.success(response.data.msg)
							}
						})
					}
				});
			},

			/**
			 * Introduction 获取学生信息
			 * @author 刘莉
			 * @since 1.0
			 */
			getStudentList() {
				let self = this
				let restData = {
					"pageNum": 0,
					"pageSize": 0
				}
				let tempStudentArray = tools.deepClone(self.studentList)
				// 无数据
				if(tempStudentArray.length == 0){
					self.axios.post(config.GET_ALL_STUDENT_LIST, restData).then(response =>{
						// 查询成功
						if (response.data.code === '200'){
							// 有数据
							if (response.data.data.total > 0){
								// 设置选中的值
								self.setStudentList(response.data.data.list)
								self.userData = response.data.data.list
							}
						}
					})
				}
				// 有数据
				else {
					self.userData = tempStudentArray
				}
			},

			/**
			 * Introduction 关闭模态框
			 * @author 刘莉
			 * @since 1.0
			 */
			handleCancle() {
				// 触发父组件事件
				this.$emit('closeModal')
			},

		}
		
	}
</script>
<style lang="scss" scoped>
.addCourseContainer{
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