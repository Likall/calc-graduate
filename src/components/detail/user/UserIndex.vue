<template>
	<div class="userIndexContainer">
		<div class="content">
			<div class="title">
				<div class="divider"></div>
				<h3>个人中心</h3>
				<div class="boxContainer">
					<div class="rightContainer" v-if="currentUser.length > 0">
						<form
							:form="userInfoForm">
							<div class="formContainer">
								<a-form-item>
									<span class="formTitle formItem">头像</span>
									<a-upload
										v-decorator="[
										'avator',
										]"
										class="avatar-uploader"
										listType="picture"
										:multiple="false"
										@change="handleAvatarChange"
										action="http://localhost:8091/gacs/file/upload"
										:showUploadList="false"
									>
											<!-- <i class="iconfont icon-yonghu" style="font-size:30px;"/> -->
										<i 
											v-if="avatarSource ==='' || avatarSource === null || avatarSource === 'null' || typeof avatarSource === 'undefined'"
											class="iconfont icon-yonghu" 
											style="font-size:30px;"></i>
										<img v-else :src="avatarSource" alt="avatar">
									</a-upload>
								</a-form-item>
								<a-form-item>
									<span class="formTitle formItem">我的角色</span>
									<a-select style="width: 120px" :value="currentRole">
										<a-select-option 
											v-for="(item, index) in selectItem" :key="index"
											:disabled ="index === selectIndex ? false : true"
											:class="index === selectIndex ? 'activeSelect' : 'inactive'"
											>
											{{item}}
										</a-select-option>
									</a-select>
									<span class="unable-font">当前角色不可更改为其它角色</span>
								</a-form-item>
								<a-form-item>
									<!-- 管理员 -->
									<span class="formTitle formItem" v-if="selectIndex === 0">账号</span>
									<!-- 教师 -->
									<span class="formTitle formItem" v-if="selectIndex === 1">工号</span>
									<!-- 学生 -->
									<span class="formTitle formItem" v-if="selectIndex === 2">学号</span>
									<a-input readonly :value="userId"/>
									<span class="unable-font">当前角色不可修改</span>
								</a-form-item>
								<a-form-item>
									<span class="formTitle formItem">昵称</span>
									<a-input :value="userName" @change="handleUserNameChange"/>
								</a-form-item>
								<a-form-item class="btnBox">
									<a-button @click="handleSaveUserInfo" type="primary">确认修改</a-button>
								</a-form-item>
							</div>
							
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import {mapGetters, mapActions} from 'vuex'
	import tools from '@/public/tools/tools'
 	export default {
		name: 'UserIndex',
		data() {
			return {
				userInfoForm: this.$form.createForm(this, { name: 'userInfo' }),			// 表单
				selectIndex: 0,																// 下拉列表选中index
				currentRole: '',															// 
				selectItem: ['管理员', '教师', '学生'],									// 下拉列表
				userId: '41603557',															// 用户id
				userName: '',																	// 昵称
				avatarSource: '',															// 用户头像
			}
		},
		computed:{
				...mapGetters({
					tabTitleItem: 'publicData/tabTitleItem',										// 顶部tab项
					detailCurrentComponent: 'publicData/detailCurrentComponent',				     // 详情加载的组件
					currentUser: 'currentUser',										// 当前登录用户信息
				})
			},
		mounted(){
			// 当前用户存在
			if(this.currentUser.length !== 0){
				// 设置当前角色
				this.currentRole = this.selectItem[parseInt(this.currentUser[0].role) -1]
				// 设置下拉列表选中值
				this.selectIndex = parseInt(this.currentUser[0].role) -1
				// 设置头像
				this.avatarSource = this.currentUser[0].avator
				// 设置昵称
				this.userName = this.currentUser[0].userName
				// 登录账号
				this.userId = this.currentUser[0].account
			}
			
		},
		methods: {
			...mapActions({
				setTabTitleItem: 'publicData/setTabTitleItem',									// 设置顶部tab项
				setDetailCurrentComponent: 'publicData/setDetailCurrentComponent',				// 设置当前详情加载的组件
			}),
			getBase64(img, callback) {
				const reader = new FileReader();
				reader.addEventListener('load', () => callback(reader.result));
				reader.readAsDataURL(img);
			},
			handleAvatarChange(info){
				let self = this
				if (info.file.status !== 'uploading') {
					console.log(info.file, info.fileList);
				}
				if (info.file.status === 'done') {
					this.$message.success(`${info.file.name} 上传成功`);
					this.getBase64(info.file.originFileObj, avatarSource => {
						self.avatarSource = tools.deepClone(avatarSource);
					});
				} else if (info.file.status === 'error') {
				this.$message.error(`${info.file.name} 上传失败.`);
				}
			},

			handleSaveUserInfo(){
				let self = this
				// e.preventDefault()
				console.log(this.loginForm.getFieldValue(avator))
			},

			customRequest(data){
				console.log(data)
				const formData = new FormData()
				formData.append('file', data.file)
				this.axios({
					method: 'post',
					url: 'http://localhost:8091/gacs/file/upload',
					headers: {
						"Content-Type": "multipart/form-data" 
					},
					data: {
						formData
					}
				}).then((res) => {
					console.log(res)
				})
			},

			handlerUpload(e) {
				console.log(e)
				//获取选定的文件
				let tFiles = e.target.files;
				let len = tFiles.length;
			},
			// 昵称更新事件
			handleUserNameChange(e){
				// 增加字符串
				if (e.data !== '' && e.data !== null && e.data !== 'null') {
					this.userName = this.userName + e.data
				}
				// 删除字符串
				else{
					this.userName = this.userName.substring(0,this.userName.length-1)
				}
			}
		}
	 }
</script>
<style lang="scss" scoped>
	.userIndexContainer{
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
				.ant-avatar-circle{
					background-color: #A4CBFC;
					cursor: pointer;
				}
			}

			.boxContainer{
				display: flex;
				justify-content: center;
				margin-top: 10px;
				.leftContainer{
					padding-right: 20px;
				}
				.formItem{
					display: inline-block;
					height: 70px;
					width: 100px;
					line-height: 70px;

				}

				.unable-font{
					display: inline-block;
					margin-left: 10px;
					color: #999999;
				}

				.ant-input{
					width: 120px;
				}

			}

			
		}

		// input样式
		.ant-form-item{
			margin-bottom: 0px;
		}

		// button样式
		.btnBox{
			button{
				margin-left: 100px;
			}
		}

		// 头像样式
		img{
			width: 70px;
			height: 70px;
			border-radius: 100%;
		}

		.icon-yonghu{
			font-size: 30px;
			width: 70px;
			height: 70px;
			background-color: #A4CBFC;
			display: inline-block;
			border-radius: 100%;
			line-height: 70px;
			text-align: center;
			color: white;
		}

		.ant-upload{
			cursor: pointer;
		}
	}
</style>