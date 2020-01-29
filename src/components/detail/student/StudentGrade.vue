
<template>
	<!-- 学生页面首页 -->
	<div class="studentGradeContainer">
		<a-spin :spinning="spinning">
			<div class="btn-form" v-if="currentUser.length > 0">
				<form-work v-if="detailCurrentComponent === 'StudentGrade'"></form-work>
				<div class="uploadCsvContainer" v-if="currentUser[0].role === '2'">
					<!-- 导入文件 -->
					<a-upload
						name="file"
						:multiple="false"
						@change="handleFileChange"
						action="http://localhost:8091/gacs/student/uploadfile"
					>
					<a-button type="primary" size="large" :disabled="disableOfBtn"> <a-icon type="upload" />导入CSV文件</a-button>
					</a-upload>
				</div>
				
			</div>
			<a-spin :spinning="tableListSpinning" v-if="currentUser.length > 0"> 
				<Header></Header>
				<!-- 列表 -->
				<course-table-list 
					:columns="columns"
					:dataSource="dataSource"
					:title="tabTitle"
					@tableLoading="getTableLoading"
				></course-table-list>
				<!-- table默认一页显示10条数据 -->
				<div style="margin: 10px 10px 30px 10px;overflow: hidden" v-if="currentUser[0].role === '2'">
					<div style="float: right;">
						<Page :total="studentPagination.total" :current="1"></Page>
					</div>
				</div>
			</a-spin>
		</a-spin>
	</div>
</template>
<script>
	import { mapGetters, mapActions } from 'vuex'
	import Header from '@/components/detail/public/Header'
	import FormWork from '@/components/detail/public/FormWork'
	import FormTable from '@/components/detail/public/FormTable'
	import CourseTableList from '@/components/detail/course/CourseTableList'
	export default {
		name: 'StudentGrade',
		components: {
			Header,
			FormWork,
			FormTable,
			CourseTableList
		},
		data(){
			return {
				spinning: false, 			// loading是否开启
				tableListSpinning: false,	// tab列表loading
				studentPagination: {current: 1, total: 0, pageSize: 10, page: 1},			// 分页信息
				columns: [],
				dataSource: [],
				tabTitle: '学生成绩列表',
				disableOfBtn: true,
			}
		},
		computed: {
			...mapGetters({
				studentGradeList: 'student/studentGradeList',					// 学生成绩列表
				currentUser: 'currentUser',										// 用户登录信息
				detailCurrentComponent: 'detailCurrentComponent',				// 当前详情加载的组件
				studentColumns: 'studentColumns',								// 学生模板文件列
				studentData: 'studentData',										// 学生模板文件数据
			})
		},
		watch:{
			// 设置button是否是可点击
			detailCurrentComponent(New, Old){
				if (New === 'StudentGrade') {
					if (this.studentColumns.length !== 0 && this.studentData.length !== 0) {
						this.disableOfBtn = false
					}else {
						this.disableOfBtn = true
					}
				}
			}
		},
		methods: {
			...mapActions({
				setStudentGradeList: 'student/setStudentGradeList',			// 设置学生成绩列表
			}),

			// 处理文件上传
			handleFileChange(info){
				if (info.file.status === 'done') {
					this.$message.success('上传成功');
				} else if (info.file.status === 'error') {
					this.$message.error('上传失败');
				}
			},

			/**
			* Introduction 子组件接收的loading状态 
			* @author 刘莉
			* @since 1.0
			* @param {flag} false：关闭，true开启
			*/
			getTableLoading(flag){
				this.tableListSpinning = flag
			}
		}
	}
</script>
<style lang="scss" scoped>
	.studentGradeContainer{
		position: relative;
		width: 100%;
		height: 100%;
		padding-top: 10px;

		.btn-form{
			display: flex;
			justify-content: flex-end;
			margin-right: 10px;
			position: relative;
			width: 100%;

			.uploadCsvContainer{
				display: inline-block; 
				left: calc(290px - 100%); 
				position: relative; 
				top: 2px;
			}
		}
	}
</style>