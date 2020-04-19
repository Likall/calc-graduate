<template>
	<div class="headerContainer" v-if="currentUser.length > 0">
		<div style="display: inline-block;">
			<a-input-search 
				:placeholder='placeData' 
				@search="onSearch" 
				@change="handleChange"
				enterButton 
				size="large"/>
		</div>
		
	</div>
</template>
<script>
	import FormWork from './FormWork'
	import { mapGetters } from 'vuex'
	import config from '@/api/config.js'
	export default {
		name: 'Header',
		props: [
			'placeData',
			'type'
		],
		data() {
			return {
				placeHolderContent: '输入内容',
				searchData:'',							// 搜索内容
			}
		},
		computed:{
			...mapGetters({
				currentUser: 'currentUser',				// 当前登录用户信息
			})
		},
		watch: {
			
		},
		methods: {
			onSearch(){
				let self = this
				// 1. 课程
				if (self.type == 'course') {
					let resData = {
						courseName: self.searchData
					}
					self.axios.post(config.GET_COURSE_LIST_BY_NAME, resData).then(response => {
						// 查询成功
						if (response.data.code == '200'){
							this.$emit('setSearchCourseData', response.data.data)
						}
					})
				}
				// 2. 学生
				else if (self.type == 'student') {
					let resData = {
						stuId: self.searchData,
						stuName: self.searchData
					}
					self.axios.post(config.FILTER_STUDENTS, resData).then(response => {
						// 查询成功
						if (response.data.code == '200'){
							this.$emit('setSearchStudentData', response.data.data)
						}
					})
				}
			},

			handleChange (e) {
				this.searchData = e.target.value
			}
		}
	}
</script>
<style lang="scss" scoped>
	.headerContainer{
		width: 250px;
		margin-top: 45px;
		
	}
	
</style>