<template>
	<div class="tableListContainer" v-if="columns.length > 0 && dataSource.length > 0">
		<a-table :columns="columns" :dataSource="dataSource" bordered>

		</a-table>
	</div>
</template>
<script>
	export default {
		name: 'TableList',
		props: [
			'columns',
			'dataSource'
		],
	}
</script>
<style lang="scss" scoped>

</style>