<template>
	<div class="updatePswContainer">
		<div class="content">
			<div class="title">
				<div class="divider"></div>
				<h3>密码修改</h3>
				<div class="boxContainer">
					<a-form
						:form="updatePswForm"	
					>
						<div class="formContainer">
							<a-form-item v-bind="formItemLayout" label="原始密码">
								<a-input
									style="width: 186px" 
									v-decorator="[
										'originPsw',
										{
											rules: [
												{
													required: true,
													message: '请输入原始密码!',
												},
											],
										},
									]"
									type="password"
								/>
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
							<a-form-item :wrapper-col="{ span: 12, offset: 14 }">
								<a-button type="primary" @click="handleSubmit">
									确认修改
								</a-button>
							</a-form-item>
						</div>
					</a-form>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import config from '@/api/config.js'  
import tools from '@/public/tools/tools'
export default {
	name: 'UpdatePsw',
	data () {
		return {
			updatePswForm: this.$form.createForm(this, {name: 'updatePsw'}),			// 表单	
			validPsw: '',						// 验证密码
			validConfirmPsw: '',				// 验证确认密码
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
		}
	},
	methods: {
		// 校验密码
		compareToFirstPassword(rule, value, callback) {
			const form = this.updatePswForm;
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
			const form = this.updatePswForm;
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
					// 校验密码是否有空格
					var reg2 = new RegExp(/^\S*$/)
					// 是否包含特殊字符
					if (reg.test(value)) {
						if (reg2.test(value)) {
							this.validPsw = 'success'
							callback();
						} else {
							this.validPsw = 'error'
							callback("密码不能有空格");
						}
						
					} else {
						this.validPsw = 'error'
						callback();
					}
				}
			}else {
				this.validPsw = ''
				callback();
			}
			
		},

		handleConfirmBlur(e) {
			const value = e.target.value;
			this.confirmDirty = this.confirmDirty || !!value;
		},

			// 确认事件
		handleSubmit(e) {
			e.preventDefault();
			let self = this
			self.updatePswForm.validateFieldsAndScroll((err, values) => {
				if (!err) {
					let resData = {
						userPassword: values.originPsw,
						changePassword: values.password,
						account: self.$cookie.get('account')
					}
					self.axios.post(config.UPDATE_PSW, resData).then(response => {
						// 修改成功
						if (response.data.code === '200') {
							self.$message.success(response.data.msg)
							// 重置
							self.updatePswForm.resetFields()
							self.validPsw = ''
							self.validConfirmPsw = ''
						}
						else {
							self.$message.error(response.data.msg)
						}
					})
					
					
				}
			});
		},
	}
}
</script>
<style lang="scss" scoped>
	.updatePswContainer{
		width: 100%;
		height: 100%;
		position: relative;
		padding: 15px;

		.content{
			background-color: white;
			position: relative;
			width: 100%;
			height: 100%;

			.title{
				border-bottom: 1px solid #E8E8E8;
			}

			.boxContainer{
				display: flex;
				justify-content: center;
				margin-top: 20px;
				.extra{
					font-size: 12px;
					display: inline-block;
					padding-left: 5px;
				}
			}
		}

		.ant-table-wrapper {
			background: #ffffff;
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