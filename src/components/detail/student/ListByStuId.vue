<template>
	<div class="listContainer">
		<!-- 学生信息列表 -->
		<div class="title">
			<div class="divider"></div>
			<h3>学生信息列表</h3>
		</div>
		<a-select
			mode="multiple"
			:defaultValue="['a1', 'b2']"
			style="width: 100%"
			@change="handleChange"
			placeholder="Please select"
		>
			<a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i"
			>{{(i + 9).toString(36) + i}}</a-select-option
			>
		</a-select>
	</div>
</template>
<script>
export default {
	name: 'ListByStuId',
	data(){
		return {}
	},
	mounted(){

	},
	methods: {
		getStuCourseList(){}
	}
}
</script>
<style lang="scss" scoped>
	/deep/ .ant-select{
		width: calc(100% - 20px) !important;
		margin: 0 10px !important;
	}
</style>