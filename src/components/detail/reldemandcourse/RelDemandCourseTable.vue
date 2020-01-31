<template>
	<div class="tableListContainer" v-if="currentUser[0].role === '2'">
		<div class="title">
			<div class="divider"></div>
		</div>
		<div class="tableBox">
			<a-table></a-table>
		</div>
	</div>
</template>
<script>
export default {
	name: 'RelDemandCourseTable',
	mounted() {

	},
	methods: {
	}
}
</script>
<style lang="scss" scoped>

</style>