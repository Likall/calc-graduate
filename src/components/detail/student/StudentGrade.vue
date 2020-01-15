
<template>
	<!-- 学生页面首页 -->
	<div class="studentGradeContainer">
		<!-- 无学生成绩列表 -->
		
	</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
	export default {
		name: 'StudentGrade',
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
	}
</style>