<template>
	<div class="loginContainer">
		<div class="loginBg"></div>
		<a-layout>
			<a-layout-content>
				<a-spin :spinning="spinning">
				<div class="loginContent">
					<div class="leftLogoCon">
						<div class="logo"></div>
						<div class="divideBar"></div>
					</div>
					<div class="rightContainer">
						<div class="loginBox">
							<h3>登录/LOGIN</h3>
							<a-form :form="loginForm">
								<a-form-item>
									<a-input placeholder="username"
										v-decorator="
											['username', 
												{ rules: [{ required: true, message: '请输入用户名' }] 
										}]"
										@change="handleUserNameChange"/>
								</a-form-item>
								<transition name="fade">
									<i class="iconfont icon-shanchu username-icon" 
										v-if="isShowUnameIcon"
										@click="clearInput('0')"/>
								</transition>
								<a-form-item>
									<a-input placeholder="password"
										v-decorator="
											['psw', 
												{ rules: [{ required: true, message: '请输入密码' }] 
										}]"
										@change="handlePswChange"
										type="password"/>
								</a-form-item>
								<i class="iconfont icon-shanchu password-icon" 
									v-if="isShowPswIcon"
									@click="clearInput('1')"/>
								<a-form-item>
									<a-button @click="login">登录</a-button>
								</a-form-item>
							</a-form>
							
						</div>
					</div>
				</div>
				</a-spin>
			</a-layout-content>
		</a-layout>
	</div>
</template>
<script>
import config from '@/api/config.js'
import { mapGetters, mapActions } from 'vuex'
export default {
	name: 'Login',
	data(){
		return {
			loginForm: this.$form.createForm(this, { name: 'login' }),				 // 表单
			isShowUnameIcon: false,      											// 是否显示用户名删除图标
			isShowPswIcon: false,        											// 是否显示密码删除图标
			value: '',                   											// 单选框当前选中
			spinning: false,														// loading状态
			
		}
	},
	computed: {
		...mapGetters({
			tabTitleItem: 'publicData/tabTitleItem',				// 顶部标题
		})
	},
	methods:{
		...mapActions({
			setTabTitleItem: 'publicData/setTabTitleItem',			// 设置顶部标题
			setDetailCurrentComponent: 'publicData/setDetailCurrentComponent',  // 设置详情加载的组件
			setCurrentUser: 'setCurrentUser',			// 设置当前登录用户信息
		}),
		/**
        * Introduction 角色选择单选框事件
        * @author 刘莉
        * @since 1.0
        *
        */
		handleRadioChange(e){
			this.value = e.target.value
		},

		/**
        * Introduction 用户名输入值改变--清除键显示与否
        * @author 刘莉
        * @since 1.0
        *
        */
		handleUserNameChange(e){
			// 有值
			if(e.target.value !== '' && e.target.value !== null && typeof e.target.value !== 'undefined'){
				this.isShowUnameIcon = true;
			}else{
				this.isShowUnameIcon = false;
			}
		},
		/**
        * Introduction 清除事件
        * @author 刘莉
        * @since 1.0
        *
        */
		clearInput(type){
			// 清除用户名
			if(type === '0'){
				this.loginForm.setFieldsValue({
					username: ''
				})
				// 隐藏清除按钮
				this.isShowUnameIcon = false;
			}
			// 清除密码
			else{
				this.loginForm.setFieldsValue({
					psw: ''
				})
				this.isShowPswIcon = false;
			}
		},
		
		/**
        * Introduction 密码输入框值改变-清除键显示与否
        * @author 刘莉
        * @since 1.0
        *
        */
		handlePswChange(e){
			// 有值
			if(e.target.value !== '' && e.target.value !== null && typeof e.target.value !== 'undefined'){
				this.isShowPswIcon = true;
			}else{
				this.isShowPswIcon = false;
			}
		},

		/**
        * Introduction 登录
        * @author 刘莉
        * @since 1.0
        *
        */
		login(e){
			let self = this
			e.preventDefault();
			self.loginForm.validateFieldsAndScroll((error, values) => {
				if (!error) {
					// 开启loading
					self.spinning = true
					let restData = {
						"account": this.loginForm.getFieldValue('username'),
						"userPassword": this.loginForm.getFieldValue('psw')
					}
					self.axios.post(config.LOGIN , restData).then(response => {
						// 登录失败
						if(response.data.code === '401'){
							self.$message.error(response.data.msg)
							// 关闭loading
							self.spinning = false
						}else if(response.data.code === '200'){
							// 提示信息
							self.$message.success(response.data.msg)
							// 关闭loading
							self.spinning = false
							// 登录成功存cookie
							self.$cookie.set('username', response.data.data.userName, '2d')
							self.$cookie.set('account', response.data.data.account, '2d')
							self.$cookie.set('role', response.data.data.role, '2d')
							self.$cookie.set('avatar', response.data.data.avatar, '2d')
							// 重置
							self.setTabTitleItem([])
							self.setDetailCurrentComponent('')
							// 设置登录信息
							let userName = this.$cookie.get('username');
							let role = this.$cookie.get('role')
							let avatar = this.$cookie.get('avatar')
							let account = this.$cookie.get('account')
							let user = []
							user.push({
								userName: userName,
								role: role,
								avatar: avatar,
								account: account
							})
							this.setCurrentUser(user)
							// 页面自动跳转
							self.$router.replace({
								name: 'index'
							})
						}
					})
					
				}
			})
			
		}
	}
}
</script>
<style lang="scss" scoped>
	.loginContainer{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		position: absolute;
		
		.loginBg{
			background: linear-gradient(-135deg, #00CFFF, #00CFFF);
			width: 45%;
			height: 100%;
		}
		.ant-layout{
			width: 54%;
			height: 410px;
			position: absolute;
			left: 50%;
			top: 50%;
			margin-left: -27%;
			margin-top: -180px;
			background: transparent;
		}
		.loginContent{
			width: 100%;
			height: 100%;
		    background-color:#32425C;
			border-radius: 10px;
			display: flex;
			
			.leftLogoCon{
				display: flex;
				width: 45%;
				height: 100%;
				padding: 20px;

				.divideBar{
					width: 100%;
					height: 100%;
					border-right: 1px solid #4C5A6D;
				}
			}

			.rightContainer{
				width: 55%;
				position: relative;

				.loginBox{
					width: 70%;
					height: 80%;
					position: absolute;
					top: 50%;
					left: 50%;
					margin-top: -36%;
					margin-left: -40%;

					h3{
						color: #6BBFDE;
					}

					.icon-shanchu{
						position: absolute;
						left: 95%;
						margin-top: -54px;
						color: #6BBFDE;
						cursor: pointer;
					}
					.icon-shanchu:hover{
						color: #A0D7DE;
					}

					.ant-radio-group-default{
						display: flex;

						/deep/ span{
							color: white;
						}
					}

					button{
						width: 100%;
						border-radius: 100px;
						background-color: #00CFFF;
						border: none;
						color: white;
						margin-top: 15px;
					}

					button:hover{
						color: white;
						background-color: #00ACD7;
					}
				}
				input{
					width: 100%;
					height: 45px;
					margin-top: 15px;
					border-left: transparent;
					border-top: transparent;
					border-right: transparent;
					border-bottom: 1px solid #92A0B4;
					border-radius: 0;
					background-color: #32425C;
					outline: none;
					display: block;
					color: white;
				}

				input:-ms-input-placeholder{
					color: #B6BFCD;
				}
				input::-webkit-input-placeholder{
					color: #B6BFCD;
				}
				input:-moz-placeholder { /* Mozilla Firefox 4 to 18 适配火狐 */
					color: #BDCADA;
				}
				input::-moz-placeholder { /* Mozilla Firefox 19+ 适配火狐 */
					color: #BDCADA;
				}	
			}
		}
	}

	.fade-enter-active, .fade-leave-active{
		transition: opacity 0.5s;
	}

	.fade-enter, .fade-leave-to {
		opacity: 0;
	}

	// loading样式
	/deep/ .ant-spin-nested-loading{
		height: 100%;
	}
	/deep/ .ant-spin-blur{
		opacity: 0.9;
		height: 100%;
	}

	/deep/ .ant-spin-container{
		height: 100%;
	}
</style>