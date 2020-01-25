<template>
    <div class="indexContainer">
		<!-- 头部 -->
		<index-header
			@activeKey="setActiveKey">
		</index-header>
		<!-- 左侧边栏 -->
		<left-bar
			@activeKey="setActiveKey"></left-bar>
		<!-- 顶部tab -->
		<tab-title
			:tabs="tabs"
			:activeKey="activeKey"
			@activeKey="setActiveKey"
			>
		</tab-title>
		<!-- 详情 -->
		<guide-detail
			:tabs="tabs">
		</guide-detail>
	</div>
</template>
<script>
	import IndexHeader from './IndexHeader'
	import LeftBar from './LeftBar'
	import TabTitle from './TabTitle'
	import GuideDetail from './detail/GuideDetail'
	export default {
		name: 'Index',
		components: {
			IndexHeader,
			LeftBar,
			TabTitle,
			GuideDetail,
		},
		data(){
			return{
				tabs: [
					{
						id: 1,
						name: '课程',
						component: 'CourseDetail'
					},
					{
						id: 2,
						name: '毕业要求',
						component: 'DemandDetail'
					},
					{
						id: 3,
						name: '指标点与课程关系',
						component: 'RelationDetail'
					},
					{
						id: 4,
						name: '达成度',
						component: 'ReachingDetail'
					},
					{
						id: 5,
						name: '专业计划',
						component: 'PlanDetail'
					},
					{
						id: 6,
						name: '成绩',
						component: 'GradeDetail'
					},
					{
						id: 7,
						name: '成绩统计',
						component: 'GradeAnalysisDetail'
					},
					{
						id: 8,
						name: '个人中心',
						component: 'UserIndex'
					}
					
				],
				activeKey: '',						// 击中项key
			}
		},
		methods: {
			// 设置当前左侧边栏，顶部tab切换击中key
			setActiveKey(key){
				this.activeKey = key
			}
		}
	}
</script>
<style lang="scss" scoped>
	.indexContainer{
		// height: 100%;
		// width: 100%;
	}
</style>