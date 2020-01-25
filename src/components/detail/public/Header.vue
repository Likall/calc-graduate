<template>
	<div class="headerContainer">
		<a-input-search 
			:placeholder='placeHolderContent' 
			@search="onSearch" 
			enterButton 
			size="large"/>
	</div>
</template>
<script>
	import Search from './Search'
	import FormWork from './FormWork'
	export default {
		name: 'Header',
		data() {
			return {
				placeHolderContent: '输入内容'
			}
		},
		methods: {
			onSearch(){}
		}
	}
</script>
<style lang="scss" scoped>
	.headerContainer{
		width: 250px;
		float: left;
		
		.ant-input-group-wrapper{
			margin-left: 10px;
		}
	}
	
</style>