<template>
	<div class="hedaerContainer">
		<div class="rightContent">
			<h3>学生毕业达成度计算系统</h3>
			<div class="userHeader" 
				:class="active === true ?  'active' : 'inactive' "
				@mouseenter="changeDropIcon('0')"
				@mouseleave="changeDropIcon('1')">
				<a-avatar :size="32">
					<i class="iconfont icon-yonghu icon-twenty"/>
				</a-avatar>
				<span class="fontWhite">Lika</span>
				<i class="iconfont icon-htmal5icon03 icon-twelve" v-if="isShowDrop"></i>
				<i class="iconfont icon-shouqi icon-twelve" v-if="!isShowDrop"></i>
			</div>
			<ul class="dropItem borderGray"
					v-show="isShowDropItem">
					<li>个人中心</li>
					<li>退出登录</li>
				</ul>
		</div>
		
	</div>
</template>
<script>
export default {
	name: 'IndexHeader',
	data(){
		return{
			isShowDrop: true,						// 下拉/折叠按钮 true：下拉 false: 折叠
			active: false,							// 鼠标hover样式 
			isShowDropItem: true,
		}
	},
	methods: {
		/**
        * Introduction 改变下拉/折叠按钮
        * @author 刘莉
        * @since 1.0
        * @param {type} 0- 显示折叠按钮 1- 显示下拉按钮
        */
		changeDropIcon(type){
			if(type === '0'){
				this.isShowDrop = false
				this.active = true
			}else{
				this.isShowDrop = true
				this.active = false
			}
		}
	}
}
</script>
<style lang="scss" scoped>
	.hedaerContainer{
		width: 100%;
		height: 60px;
		background-color: #1E2028;
		position: relative;
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
				margin-left: 30px;
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

				
			}
		}

		
		.dropItem{
			list-style-type: none;
			height: 85px;
			width: 100px;
			position: absolute;
			right: 70px;
			top: 65px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
			padding: 0px 10px;
			border-radius: 2px;
			li{
				height: 50%;
				line-height: 40px;
			}
		}

		// 鼠标hover样式
		.active{
			border-bottom: 4px solid #A4CBFC;
			transition: all .3s
		}
		
	}
</style>