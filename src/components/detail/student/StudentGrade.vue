
<template>
	<!-- 学生页面首页 -->
	<div class="studentGradeContainer">
		<!-- 头部 -->
		<Header></Header>
		<form-work></form-work>
		<a-upload
			name="file"
			:multiple="false"
		>
        	<a-button type="primary" size="large"> <a-icon type="upload" />导入Excel</a-button>
		</a-upload>
	</div>
</template>
<script>
	import { mapGetters, mapActions } from 'vuex'
	import Header from '@/components/detail/public/Header'
	import FormWork from '@/components/detail/public/FormWork'
	export default {
		name: 'StudentGrade',
		components: {
			Header,
			FormWork
		},
		props: 
		[
			'detailCurrentComponent'
		],
		computed: {
			...mapGetters({
				studentGradeList: 'student/studentGradeList',					// 学生成绩列表
			})
		},
		methods: {
			...mapActions({
				setStudentGradeList: 'student/setStudentGradeList',			// 设置学生成绩列表
			})
		}
	}
</script>
<style lang="scss" scoped>
	.studentGradeContainer{
		position: relative;
		width: 100%;
		height: 100%;
		padding-top: 10px;
	}
</style>