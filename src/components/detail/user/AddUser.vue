<template>
	<div class="addUserContainer">
		<a-form :form="addUserForm" >
			<a-form-item v-bind="formItemLayout" label="登录账号" :validate-status="validAccount" hasFeedback>
				<a-input
					style="width: 186px" 
					v-decorator="[
					'account',
					{
						rules: [
						{
							required: true,
							message: '请输入登录账号!',
						},
						{
							validator: validateUserAccount,
						},
						],
					},
					]"
				/>
				<span class="extra">8位数字组成</span>
			</a-form-item>
			<a-form-item v-bind="formItemLayout" label="角色" >
				<a-select  
					style="width: 186px" 
					v-decorator="['role', { rules: [{ required: true, message: '请选择角色！' }] }]">
					<a-select-option value="2">教师</a-select-option>
					<a-select-option value="3">学生</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item v-bind="formItemLayout" label="密码" :validate-status="validPsw" hasFeedback>
				<a-input
					style="width: 186px" 
					v-decorator="[
					'password',
					{
						rules: [
						{
							required: true,
							message: '请输入密码!',
						},
						{
							validator: validateToNextPassword,
						},
						],
					},
					]"
					type="password"
				/>
				<span class="extra">6-16位英文与数字组成</span>
			</a-form-item>
			<a-form-item v-bind="formItemLayout" label="确认密码" :validate-status="validConfirmPsw" hasFeedback>
				<a-input
					style="width: 186px" 
					v-decorator="[
					'confirm',
					{
						rules: [
						{
							required: true,
							message: '请输入密码!',
						},
						{
							validator: compareToFirstPassword,
						},
						],
					},
					]"
					type="password"
					@blur="handleConfirmBlur"
			/>
			</a-form-item>
			<a-form-item :wrapper-col="{ span: 12, offset: 15 }">
				<a-button type="primary" @click="handleSubmit">
					确定
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
		name: 'AddUser',
		data() {
			return {
				addUserForm: this.$form.createForm(this, { name: 'addUser' }),		// 表单
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
			// 确认事件
			handleSubmit(e) {
				e.preventDefault();
				let self = this
				self.addUserForm.validateFieldsAndScroll((err, values) => {
					if (!err) {
						let resData = {
							account: values.account,
							userPassword: values.password,
							role: values.role,
						}
						self.axios.post(config.ADD_USER, resData).then(response => {
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
			
			handleConfirmBlur(e) {
				const value = e.target.value;
				this.confirmDirty = this.confirmDirty || !!value;
			},

			// 获取学生信息
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
			// 校验密码
			compareToFirstPassword(rule, value, callback) {
				const form = this.addUserForm;
				if (value && value !== form.getFieldValue('password')) {
					this.validConfirmPsw = 'error'
					callback('两次密码输入不一致！');
				} else {
					if(!value){
						this.validConfirmPsw = ''
					} else {
						this.validConfirmPsw = 'success'

					}
					callback();
				}
			},
			// 校验密码
			validateToNextPassword(rule, value, callback) {
				const form = this.addUserForm;
				if (value && this.confirmDirty) {
					form.validateFields(['confirm'], { force: true });
				}
				if(value){
					// 长度不符合
					if (value.length < 6 || value.length > 16) {
						this.validPsw = 'error'
					}else {
						// 校验格式是否是由数字与字母组成
						var reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
						if (reg.test(value)) {
							this.validPsw = 'success'
						} else {
							this.validPsw = 'error'
						}
					}
				}else {
					this.validPsw = ''
				}
				callback();
			},

			// 验证登录账户
			validateUserAccount(rule, value, callback){
				const form = this.addUserForm
				if(value){
					// 长度不符合
					if (value.length > 8 || value.length < 8) {
						this.validAccount = 'error'
					}else {
						// 校验格式是否是由数字与字母组成
						var reg = new RegExp(/^[0-9]*$/);
						if (reg.test(value)) {
							this.validAccount = 'success'
						} else {
							this.validAccount = 'error'
						}
					}
				}else {
					this.validAccount = ''
				}
				callback();
			}

		}
		
	}
</script>
<style lang="scss" scoped>
.addUserContainer{
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