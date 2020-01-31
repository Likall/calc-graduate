<template>
	<div class="DemandContainer">
		<a-spin :spinning="spinning">
			<!-- 步骤条 -->
			<step-detail @activeKey="setActiveKey"></step-detail>
			<div class="btn-form" v-if="currentUser.length > 0">
				<a-button size="large"> <a-icon type="download" />下载毕业要求模板文件</a-button>
				<div class="uploadCsvContainer" v-if="currentUser[0].role === '2'">
					<!-- 导入文件 -->
					<a-upload
						name="file"
						:multiple="false"
						@change="handleFileChange"
						action="http://localhost:8091/gacs/excel/demand"
					>
					<a-button type="primary" size="large"> <a-icon type="upload" />导入毕业要求文件</a-button>
					</a-upload>
				</div>
			</div>
			<!-- 搜索按钮 -->
			<Header></Header>
			<!-- 列表 -->
			<demand-table-list v-if="isSuccess" :reponseData="responseData"></demand-table-list>
		</a-spin>
	</div>
</template>
<script>
	import StepDetail from '@/components/detail/public/StepDetail'
	import DemandTableList from '@/components/detail/demand/DemandTableList'
	import Header from '@/components/detail/public/Header'
	import { mapGetters } from 'vuex';
	export default {
		name: 'DemandDetail',
		components: {
			StepDetail,
			DemandTableList,
			Header
		},
		data() {
			return {
				spinning: false,			// 是否开启loading
				isSuccess: false,			// 导入文件是否成功
				responseData: {},			// 接口返回数据
			}
		},
		computed: {
			...mapGetters({
				currentUser: 'currentUser',				 // 当前登录用户信息
				detailCurrentComponent: 'publicData/detailCurrentComponent',	// 当前详情加载的组件
			})	
		},
		methods: {
			// 处理文件上传
			handleFileChange(info){
				this.spinning = true;
				if (info.file.status === 'done') {
					this.$message.success('上传成功');
					this.isSuccess = true;
					this.spinning = false;
					// 执行成功
					this.responseData = info.file.response
				} else if (info.file.status === 'error') {
					this.$message.error('上传失败');
					this.isSuccess = false;
					this.spinning = false;
				}
			},
			/**
			* Introduction 向父组件传递当前击中的key
			* @author 刘莉
			* @since 1.0
			* @param {key} 从StepDetail接收的key
			*/
			setActiveKey(key){
				// 设置当前击中key
				this.$emit('activeKey', key+'')
			}
		}
	}
</script>
<style lang="scss" scoped>
	.DemandContainer{
		position: relative;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		padding: 20px 15px;

		.btn-form{
			// display: flex;
			// justify-content: flex-end;
			// margin-right: 10px;
			position: relative;
			width: 100%;
			top: 30px;

			button{
				margin-right: 15px;
			}

			.uploadCsvContainer{
				display: inline-block; 
				position: relative; 
			}
		}
	}
</style>