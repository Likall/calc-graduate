<template>
	<!-- 指标点与课程关系 -->
	<div class="relDetailContainer">
		<a-spin :spinning="spinning">
			<div class="btn-form" v-if="currentUser.length > 0">
				<a-button size="large"> <a-icon type="download" />下载指标点与课程关系模板文件</a-button>
				<div class="uploadCsvContainer" v-if="currentUser[0].role === '2'">
					<!-- 导入文件 -->
					<a-upload
						name="file"
						:multiple="false"
						@change="handleFileChange"
						action="http://localhost:8091/gacs/course/uploadfile"
					>
					<a-button type="primary" size="large"> <a-icon type="upload" />导入指标点与课程关系文件</a-button>
					</a-upload>
				</div>				
			</div>
		</a-spin>
	</div>
</template>
<script>
	import Header from '@/components/detail/public/Header'
	import FormWork from '@/components/detail/public/FormWork'
	import FormTable from '@/components/detail/public/FormTable'
	import StepDetail from '@/components/detail/public/StepDetail'
	import { mapGetters } from 'vuex'
	export default {
		name: 'RelDemandAndCourseDetail',
		components: {
			Header,
			FormWork,
			FormTable,
			StepDetail,
		},
		data(){
			return {
				spinning: false,			// 是否开启loading
				editDemand: '毕业指标点',
				editRelDemandCourse: '指标点与课程关系',
				editClose: '完成',
				currentPage: 0,				// 当前steps项
				
			}
		},
		computed:{
			...mapGetters({
				currentUser: 'currentUser',				// 当前登录用户信息
				detailCurrentComponent: 'publicData/detailCurrentComponent',	// 当前加载的详情组件
				relDemandAndCourseColumns: 'relDemandAndCourseColumns', // 课程指标点与课程模板文件列
				relDemandAndCourseData: 'relDemandAndCourseData',	// 课程指标点与课程模板文件数据
				hasCompletePage: 'hasCompletePage',					// 步骤条已完成页面
			})
		},
		watch:{
			// 设置button是否是可点击
			detailCurrentComponent(New, Old){
				if (New === 'RelDemandAndCourseDetail') {
					if (this.relDemandAndCourseColumns.length !== 0 && this.relDemandAndCourseData.length !== 0) {
						this.disableOfBtn = false
					}else {
						this.disableOfBtn = true
					}
				}
			}
		},
		methods: {
			// 处理文件上传
			handleFileChange(info){
				if (info.file.status === 'done') {
					this.$message.success('上传成功');
				} else if (info.file.status === 'error') {
					this.$message.error('上传失败');
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
	.relDetailContainer{
		position: relative;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		padding: 20px 15px;

		.btn-form{
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