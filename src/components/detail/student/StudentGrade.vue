
<template>
	<!-- 学生页面首页 -->
	<div class="studentGradeContainer">
		<div class="content-box">
			<a-spin :spinning="spinning" tip="正在生成模板文件,请等待....">
				<div class="btn-form">
					<a-button @click="getStudentInfo" size="large"><a-icon type="download" />下载课程与学生关系模板</a-button>
					<div class="uploadContainer">
						<!-- 导入文件 -->
						<a-upload
							name="file"
							:multiple="false"
							@change="handleFileChange"
							action="http://localhost:8091/gacs/excel/grade"
						>
						<a-button type="primary" size="large"> <a-icon type="upload" />导入课程与学生关系文件</a-button>
						</a-upload>
					</div>	
				</div>
				<!-- 根据学生ID查询学生课程列表 -->
				<!-- <list-by-stu-id></list-by-stu-id> -->
				<!-- 根据课程名称查询学生情况 -->
				<!-- <list-by-course-name></list-by-course-name> -->
				<!-- 成绩列表 -->
				<student-grade-table-list></student-grade-table-list>
			</a-spin>
		</div>
		
		
	</div>
</template>
<script>
	import { mapGetters, mapActions } from 'vuex'
	import config from '@/api/config.js'
	import ListByCourseName from './ListByCourseName'
	import ListByStuId from './ListByStuId'
	import StudentGradeTableList from '@/components/detail/student/StudentGradeTableList'
	import tools from '@/public/tools/tools'
	export default {
		name: 'StudentGrade',
		components: {
			ListByCourseName,
			ListByStuId,
			StudentGradeTableList
		},
		data(){
			return {
				dataSource: [],					// 生成excel的数据源
				filterVal: [],					// 列数据
				spinning: false,				// loading
				// columnsData: [],				// 列数据
				// tableDataSource: [],			// 列表数据源
				// scollWidth: '',
				// colColumns: []
			}
		},
		computed: {
			...mapGetters({
				studentGradeList: 'student/studentGradeList',					// 学生成绩列表
				currentUser: 'currentUser',										// 用户登录信息
				detailCurrentComponent: 'publicData/detailCurrentComponent',    // 当前详情加载的组件
				studentColumns: 'studentColumns',								// 学生模板文件列
				studentData: 'studentData',										// 学生模板文件数据
				courseList: 'course/courseList',								// 课程列表
				studentList: 'student/studentList',								// 学生列表
			})
		},
		watch:{
		},
		mounted(){
		},
		methods: {
			...mapActions({
				setStudentGradeList: 'student/setStudentGradeList',			// 设置学生成绩列表
				setCourseList: 'course/setCourseList',						// 设置课程列表
				setStudentList: 'student/setStudentList',					// 设置学生列表
			}),

			// 获取课程列表数据
			getCourseInfo(){
				let self = this
				let restData = {
					"pageNum": 0,
					"pageSize": 0
				}
				self.axios.post(config.GET_ALL_COURSE_LIST, restData).then(response =>{
					// 查询成功
					if (response.data.code === '200'){
						// 有数据
						if (response.data.data.total > 0){
							// 设置课程列表数据
							self.setCourseList(response.data.data.list)
							for(let i = 0; i < response.data.data.list.length; i++){
								let objCourse = {}
								objCourse[ 'index0'] = response.data.data.list[i].courseId
								objCourse[ 'index1'] = response.data.data.list[i].courseName
								this.dataSource.push(objCourse)
							}
							this.exportExcel()
						}
					} else{
						this.$message.error('模板文件生成失败')
					}
					// 关闭loading
					this.spinning = false;
				})
			},

			// 获取学生列表数据
			getStudentInfo(){
				let self = this
				// 开启loading
				this.spinning = true;
				let restData = {
					"pageNum": 0,
					"pageSize": 0
				}
				self.axios.post(config.GET_ALL_STUDENT_LIST, restData).then(response =>{
					// 查询成功
					if (response.data.code === '200'){
						// 有数据
						if (response.data.data.total > 0){
							// 设置学生列表数据
							self.setStudentList(response.data.data.list)
							let objStuId = {}
							let objStuName = {}
							objStuId[ 'index0'] = '课程编号'
							objStuName['index0'] = '课程名称'
							objStuId[ 'index1'] = '学号'
							objStuName['index1'] = '姓名'
							this.filterVal.push('index0')
							this.filterVal.push('index1')
							for(let i = 0; i < response.data.data.list.length; i++){
								objStuId[ 'index' + (i+2) ] = response.data.data.list[i].stuId
								objStuName[ 'index' + (i+2) ] = response.data.data.list[i].stuName
								let tempName = 'index' +(i+2)
								this.filterVal.push(tempName)
							}
							this.filterVal.push('index' + (response.data.data.list.length+3))
							objStuName[ 'index' + (response.data.data.list.length+3) ] = '平均分'
							this.dataSource.push(objStuId)
							this.dataSource.push(objStuName)
							this.getCourseInfo()
						}
					}
				})
			},

			// 将列表数据导出成excel
			exportExcel(){
				require.ensure([], () => {
					const { export_json_to_excel } = require("../../../excel/Export2Excel");
 
				    const tHeader = ['按格式填写,勿修改已填写的模板内容']; //将对应的属性名转换成中文
				    const list = this.dataSource;　　
					const　filterVal = this.filterVal　　　
					const data = this.formatJson(filterVal, list);
				    export_json_to_excel(tHeader, data, '课程与学生模板');　
				});
			},

			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => v[j]));
			},

			// 处理文件上传
			handleFileChange(info){
				if (info.file.status === 'done') {
					this.$message.success('上传成功');
				} else if (info.file.status === 'error') {
					this.$message.error('上传失败');
				}
			},

			
		}
	}
</script>
<style lang="scss" scoped>
	.studentGradeContainer{
		position: relative;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		padding: 15px;

		.content-box{
			position: relative;
			width: 100%;
			height: 100%;
			background-color: white;
		}

		.btn-form{
			display: flex;
			justify-content: flex-start;
			position: relative;
			width: 100%;
			padding: 10px;

			button{
				margin-right: 15px;
			}

			.uploadContainer{
				display: inline-block; 
				position: relative; 
			}
		}
	}
</style>