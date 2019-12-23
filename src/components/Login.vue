<template>
	<div class="loginContainer">
		<div class="loginBg"></div>
		<a-layout>
			<a-layout-content>
				<div class="loginContent">
					<div class="leftLogoCon">
						<div class="logo"></div>
						<div class="divideBar"></div>
					</div>
					<div class="rightContainer">
						<div class="loginBox">
							<h3>登录/LOGIN</h3>
							<input placeholder="username" v-model="userName" value="username"/>
							<transition name="fade">
								<i class="iconfont icon-shanchu username-icon" v-if="isShowUnameIcon"/>
							</transition>
							<input placeholder="password" v-model="password" value="password"/>
							<i class="iconfont icon-shanchu password-icon" v-if="isShowPswIcon"/>
							<a-radio-group v-model="value" @change="handleRadioChange">
								<a-radio :style="radioStyle" :value="1">学生</a-radio>
								<a-radio :style="radioStyle" :value="2">教师</a-radio>
								<a-radio :style="radioStyle" :value="3">管理员</a-radio>
							</a-radio-group>
							<a-button @click="login">登录</a-button>
						</div>
					</div>
				</div>
			</a-layout-content>
		</a-layout>
	</div>
</template>
<script>
export default {
	name: 'Login',
	data(){
		return {
			isShowUnameIcon: false,      // 是否显示用户名删除图标
			isShowPswIcon: false,        // 是否显示密码删除图标
			userName: '',				 // 用户名
			password: '',				 // 密码
			value: '',                   // 单选框当前选中
			radioStyle: {
				display: 'block',
				height: '45px',
				lineHeight: '45px',
				marginTop: '15px',
			},
		}
	},
	watch:{
		userName(New, Old){
			if(New !== '' && New !== null && typeof New !== 'undefined'){
				this.isShowUnameIcon = true;
			}else{
				this.isShowUnameIcon = false;
			}
		},
		password(New, Old){
			if(New !== '' && New !== null && typeof New !== 'undefined'){
				this.isShowPswIcon = true;
			}else{
				this.isShowPswIcon = false;
			}
		}
	},
	methods:{
		/**
        * Introduction 角色选择单选框事件
        * @author 刘莉
        * @since 1.0
        *
        */
		handleRadioChange(e){
			this.value = e.target.value
		},

		login(){
			
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
			height: 360px;
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
					margin-top: -30%;
					margin-left: -40%;

					h3{
						color: #6BBFDE;
					}

					.icon-shanchu{
						position: absolute;
						left: 95%;
						margin-top: -32px;
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
</style>