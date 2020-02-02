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
				<span class="extra">6位英文与数字组成</span>
			</a-form-item>
			<a-form-item v-bind="formItemLayout" label="角色" >
				<a-select  
					style="width: 186px" 
					v-decorator="['role', { rules: [{ required: true, message: '请选择角色！' }] }]">
					<a-select-option value="role2">教师</a-select-option>
					<a-select-option value="role3">学生</a-select-option>
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
				<a-button type="primary" html-type="submit">
					确定
				</a-button>
			</a-form-item>
		</a-form>
	</div>

	
</template>
<script>
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
		}
	},
	methods: {
		 handleSubmit(e) {
			e.preventDefault();
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
				console.log('Received values of form: ', values);
				}
			});
		},
		handleConfirmBlur(e) {
			const value = e.target.value;
			this.confirmDirty = this.confirmDirty || !!value;
		},
		// 校验密码
		compareToFirstPassword(rule, value, callback) {
			console.log("1212")
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
				if (value.length > 6 || value.length < 6) {
					this.validAccount = 'error'
				}else {
					// 校验格式是否是由数字与字母组成
					var reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
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