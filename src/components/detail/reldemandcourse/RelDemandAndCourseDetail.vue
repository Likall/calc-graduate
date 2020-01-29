<template>
	<!-- 指标点与课程关系 -->
	<div class="relDetailContainer">
		<a-spin :spinning="spinning">
			<div class="btn-form" v-if="currentUser.length > 0">
				<form-work v-if="detailCurrentComponent === 'RelDemandAndCourseDetail'"></form-work>
				<div class="uploadCsvContainer" v-if="currentUser[0].role === '2'">
					<!-- 导入文件 -->
					<a-upload
						name="file"
						:multiple="false"
						@change="handleFileChange"
						action="http://localhost:8091/gacs/course/uploadfile"
					>
					<a-button type="primary" size="large" :disabled="disableOfBtn"> <a-icon type="upload" />导入CSV文件</a-button>
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
	import { mapGetters } from 'vuex'
	export default {
		name: 'RelDemandAndCourseDetail',
		components: {
			Header,
			FormWork,
			FormTable
		},
		data(){
			return {
				spinning: false,			// 是否开启loading
				disableOfBtn: true
			}
		},
		computed:{
			...mapGetters({
				currentUser: 'currentUser',				// 当前登录用户信息
				detailCurrentComponent: 'detailCurrentComponent',	// 
				relDemandAndCourseColumns: 'relDemandAndCourseColumns', // 课程指标点与课程模板文件列
				relDemandAndCourseData: 'relDemandAndCourseData',	// 课程指标点与课程模板文件数据
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
		
	}
</script>
<style lang="scss" scoped>
	.relDetailContainer{
		position: relative;
		width: 100%;
		height: 100%;
		padding-top: 10px;

		.btn-form{
			display: flex;
			justify-content: flex-end;
			margin-right: 10px;
			position: relative;
			width: 100%;

			.uploadCsvContainer{
				display: inline-block; 
				left: calc(290px - 100%); 
				position: relative; 
				top: 2px;
			}
		}

	}
</style>