<template>
    <div class="formTableContainer">
	
		
      <Table 
				:columns="columns8" 
				:data="data7"
				size="small" 
				ref="table" 
				:show-header="false"
				:border="true">
		</Table>
    </div>
</template>
<script>
export default {
	name: 'FormTable',
	data(){
		return {
			columns8: [
				{
					"title": "学号",
					"key": "courseID",
					"fixed": "left",
					"width": 200
				},
				{
					"title": "分数",
					"key": "grade",
					"fixed": "left",
					"width": 200
				}
			],
			data7: [
				{
					"courseID": "学号",
				},
				{
					"courseID": "姓名",
				},
				{
					"courseID": "课程名",
					"grade": "分数"
				}
			]
		}
	}
}
</script>
<style lang="scss" scoped>
	.formTableContainer{
		position: absolute;
		margin-left: 10px;

		
		.editBtn{
			margin-top: 20px;
		}
	}
</style>