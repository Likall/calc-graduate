<template>
	<div class="hedaerContainer">
		<div class="leftContent">
			<div class="logoContent">
				<i class="iconfont icon--biye fontBlue icon-thirdfour"></i>
				<!-- <a-button type="primary"  > -->
					<a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" 
						class="btn-toogle fontWhite icon-twenty"
						@click="toggleCollapsed"/>
				<!-- </a-button> -->
			</div>
		</div>
		<div class="rightContent ">
			<h3>学生毕业达成度计算系统</h3>
			<div class="userHeader"
				:class="active === true ?  'active' : 'inactive' ">
				<a-dropdown
					@visibleChange="changeDropIcon">
					<div>
						<a-avatar :size="32">
							<i class="iconfont icon-yonghu icon-twenty"/>
						</a-avatar>
						<span class="fontWhite">Lika</span>
						<i class="iconfont icon-htmal5icon03 icon-twelve" v-if="isShowDrop"></i>
						<i class="iconfont icon-shouqi icon-twelve" v-if="!isShowDrop"></i>
					</div>
					<a-menu slot="overlay">
						<a-menu-item>
							<a href="javascript:;">个人中心</a>
						</a-menu-item>
						<a-menu-item>
							<a href="javascript:;" class="logout">
								退出登录
								<i class="iconfont icon-tuichu icon-twelve"></i>
							</a>
						</a-menu-item>
					</a-menu>
				</a-dropdown>
			</div>
		</div>
	</div>
</template>
<script>
	import {mapGetters, mapActions} from 'vuex'
	import tools from '@/public/tools/tools'
	export default {
		name: 'IndexHeader',
		components: {
			
		},
		data(){
			return{
				isShowDrop: true,						// 下拉/折叠按钮 true：下拉 false: 折叠
				active: false,							// 鼠标hover样式 
			}
		},
		computed:{
			...mapGetters({
				collapsed: 'header/collapsed',						// menu 折叠
			})
		},
		methods: {
			...mapActions({
				setCollapsed: 'header/setCollapsed',				// 设置menu 是否折叠
			}),
			/**
			* Introduction 改变下拉/折叠按钮
			* @author 刘莉
			* @since 1.0
			* @param {visible} true- 显示折叠按钮 false- 显示下拉按钮
			*/
			changeDropIcon(visible){
				
				if(visible === true){
					this.isShowDrop = false
					this.active = true
				}else{
					this.isShowDrop = true
					this.active = false
				}
			},

			/**
			* Introduction meun折叠
			* @author 刘莉
			* @since 1.0
			*/
			toggleCollapsed(){
				// 设置menu是否折叠
				let collapsed = tools.deepClone(this.collapsed)
				this.setCollapsed(!collapsed)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.hedaerContainer{
		width: 100%;
		height: 60px;
		background-color: #172742;
		position: fixed;
		display: flex;
		display: -webkit-flex; /* Safari */
		justify-content: flex-end;

		.rightContent{
			width: 420px;
			display: flex;
			display: -webkit-flex; /* Safari */
			justify-content: flex-start;
			position: relative;

			h3{
				width: 250px;
				height: 100%;
				line-height: 60px;
				color: rgba(255, 255, 255, 0.8);
				font-weight: bold;
				font-size: 18px;
				font-family: Arial, Helvetica, sans-serif;
			}
		
			.userHeader{
				line-height: 65px;

				.ant-avatar-circle{
					background-color: #A4CBFC;
				}

				.icon-htmal5icon03,
				.icon-shouqi{
					color: white;
				}

				.logout{
					color: red;
				}
			}
		}

		.leftContent{
			width: calc(100% - 420px);
			display: flex;
			justify-content: flex-start;
			padding-left: 20px;
			line-height: 60px;

			.logoContent{
				height: 100%;
			}

			.btn-toogle{
				position: absolute;
				top: 50%;
				margin-top: -10px;
				padding-left: 35px;
			}
		}


		// 鼠标hover样式
		.active{
			border-bottom: 3px solid #A4CBFC;
			transition: all .3s
		}
		
	}
</style>