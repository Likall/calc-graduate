<template>
	<div class="stepContainer">
		<div class="stepBody">
			<a-steps :current="currentPage">
				<a-step :title="editCourse" @click="stepsJumpPage(0)"></a-step>
				<a-step :title="editStudent" @click="stepsJumpPage(1)"></a-step>
				<a-step :title="editDemand" @click="stepsJumpPage(2)"></a-step>
				<a-step :title="editRelDemandCourse" @click="stepsJumpPage(3)"></a-step>
			</a-steps>
		</div>
	</div>
</template>
<script>
	import { mapActions, mapGetters } from 'vuex'
	import tools from '@/public/tools/tools'
	export default {
		name: 'StepDetail',
		data() {
			return {
				editCourse: '课程',
				editStudent: '学生',
				editDemand: '毕业要求',
				editRelDemandCourse: '毕业要求与课程关系',
			}
		},
		computed: {
			...mapGetters({
				tabTitleItem: 'publicData/tabTitleItem',							// 顶部tab项
				leftBarList: 'leftBarList',											// 左侧边栏栏项
				currentPage: 'publicData/currentPage',								// 当前步骤条加载的页面
			})
		},
		methods: {
			...mapActions({
				setTabTitleItem: 'publicData/setTabTitleItem',									// 设置顶部tab项
				setDetailCurrentComponent: 'publicData/setDetailCurrentComponent',				// 设置当前详情加载的组件
				setCurrentPage: 'publicData/setCurrentPage',									// 设置当前步骤条加载的页面
			}),
			// 页面跳转
			stepsJumpPage(page){
				this.setCurrentPage(page)
				// 设置当前加载的组件
				let key = (page+1) + ''
				let tempTabArr = tools.deepClone(this.tabTitleItem)
				let tempCom = ''
				let tempIcon = ''
				let tempTitle = ''
				// 是否存在
				let exsist = tempTabArr.filter(item => {
					return item.key === key
				})
				// 存在不向数组中插入数据
				if(exsist.length !== 0){
					this.$emit("activeKey", key)
					let com = exsist[0].datas.component
					this.setDetailCurrentComponent(com)
					return
				}else{
					let newArrayTemp
					// 学生无图标
					if (page === 1) {
						tempCom = 'StudentGrade'
						newArrayTemp = {
							key: key,
							datas: {
								icon: '',
								title: '成绩',
								key: key,
								component: 'StudentGrade'
							}
						}
					}else {
						
						if (page === 0){
							tempCom = 'CourseDetail'
							tempIcon = 'icon-kecheng'
							tempTitle = '课程'
						} else if (page === 2) {
							tempCom = 'DemandDetail'
							tempIcon = 'icon-demand'
							tempTitle = '毕业要求'
						} else {
							tempCom = 'RelDemandAndCourseDetail'
							tempIcon = 'icon-guanxi'
							tempTitle = '指标点与课程关系'
						}
						newArrayTemp = {
							key: key,
							datas: {
								icon: tempIcon,
								title: tempTitle,
								key: key,
								component: tempCom
							}
						}
					}
					// 插入数据
					this.$emit("activeKey", key)
					let newTabArr = tools.deepClone(this.tabTitleItem)
					newTabArr.push(newArrayTemp)
					this.setTabTitleItem(newTabArr)
					this.setDetailCurrentComponent(tempCom)
				}
				
			}
		}
	}
</script>
<style lang="scss" scoped>

</style>