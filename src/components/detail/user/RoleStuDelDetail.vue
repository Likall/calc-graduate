<template>
    <div class="roleStuDecContainer">
		<!-- 搜索框 -->
		<Header :placeData="placeData"></Header>
	</div>
</template>
<script>
	import Header from '@/components/detail/public/Header'
	export default {
		name: 'RoleStuDecDetail',
		components: {
			Header
		},
		data() {
			return {
				placeData: '请输入账号'
			}
		}
	}
</script>
<style lang="scss" scoped>

</style>