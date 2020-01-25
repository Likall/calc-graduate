<template>
	<div class="courseDetailContainer">
		<Header></Header>
		<a-spin :spinning="spinning">
		<div class="btn-form">
			<form-work></form-work>
			<!-- 导入文件 -->
			<a-upload
				name="file"
				:multiple="false"
				@change="handleFileChange"
				action="http://localhost:8091/gacs/course/uploadfile"
			>
				<a-button type="primary" size="large"> <a-icon type="upload" />导入CSV文件</a-button>
			</a-upload>
		</div>
		<!-- 列表 -->
		<table-list 
			:columns="columns"
			:dataSource="dataSource"
		></table-list>
		</a-spin>
	</div>
</template>
<script>
	import Header from '@/components/detail/public/Header'
	import FormWork from '@/components/detail/public/FormWork'
	import FormTable from '@/components/detail/public/FormTable'
	import TableList from '@/components/detail/public/TableList'
	export default {
		name: 'CourseDetail',
		components: {
			Header,
			FormWork,
			FormTable,
			TableList
		},
		data(){
			return {
				spinning: false,			// loading 状态
				dataSource: [],
				columns: ['课程号', '课程名称', '课程学分', '课程学期', '课程平均分', '课程总分制']
			}
		},
		mounted(){

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

			// 获得课程信息列表
			getCourseInfoList(){

			}
		}
	}
</script>
<style lang="scss" scoped>
	.courseDetailContainer{
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
			top: -42px
		}
	}
</style>