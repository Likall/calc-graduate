<template>
	<div class="guideDetailContainer"
		:style="{'width': posTabWidth.width, 'left': posTabWidth.left}"
		>
		<div class="content-wrap">
			<keep-alive>
				<component
					:detailCurrentComponent="detailCurrentComponent"
					:is="detailCurrentComponent"
					@activeKey="setActiveKey">
				</component>
			</keep-alive>
		</div>
	</div>
</template>
<script>
	import StudentGrade from './student/StudentGrade'
	import StudentAnalysis from './student/StudentAnalysis'
	import UserIndex from './user/UserIndex'
	import CourseDetail from './course/CourseDetail'
	import RelDemandAndCourseDetail from '@/components/detail/reldemandcourse/RelDemandAndCourseDetail'
	import DemandDetail from '@/components/detail/demand/DemandDetail.vue'
	import AchevementDetail from '@/components/detail/achevement/AchevementDetail.vue'
	import PlanDetail from '@/components/detail/plan/PlanDetail.vue'
	import { mapGetters, mapActions } from 'vuex'
	export default {
		name: 'GuideDetail',
		components: {
			StudentGrade,
			StudentAnalysis,
			UserIndex,
			CourseDetail,
			RelDemandAndCourseDetail,
			DemandDetail,
			AchevementDetail,
			PlanDetail
		},
		props: [
			'tabs'
		],
		data() {
			return{
				
			}
		},
		computed: {
			...mapGetters({
				detailCurrentComponent: 'publicData/detailCurrentComponent',				     // 详情加载的组件
				posTabWidth: 'header/posTabWidth',									// tab宽度与左边距
			})
		},
		methods: {
			...mapActions({
				setDetailCurrentComponent: 'publicData/setDetailCurrentComponent',				// 设置当前详情加载的组件
			}),
			/**
			* Introduction 向父组件传递当前击中的key
			* @author 刘莉
			* @since 1.0
			* @param {key} 从StepDetail接收的key
			*/
			setActiveKey(key){
				// 设置当前击中key
				this.$emit('activeKey', key+'')
			}
		}
	}
</script>
<style lang="scss" scoped>
	.guideDetailContainer{
		position: absolute;
		top: 100px;
		height: calc(100% - 100px);
		box-sizing: border-box;
		background-color: #f2f2f2;
		overflow-x: hidden;
		.content-wrap{
			position: relative;
			height: 100%;
			width: 100%;
		}
	}
</style>