
<template>
	<!-- 学生页面首页 -->
	<div class="studentDetailListContainer">
		<div class="content-box">
			<a-spin :spinning="spinning" tip="正在生成模板文件,请等待....">
				<div class="btn-form">
					<a-button @click="exportExcel" size="large"><a-icon type="download" />下载学生信息模板</a-button>
					<div class="uploadContainer">
						<!-- 导入文件 -->
						<a-upload
							name="file"
							:multiple="false"
							@change="handleFileChange"
							action="http://localhost:8091/gacs/excel/student"
						>
						<a-button type="primary" size="large"> <a-icon type="upload" />导入学生信息文件</a-button>
						</a-upload>
					</div>	
				</div>
				<Header style="padding:10px 0px 0px 10px; margin-top: 0" :placeData="placeData"></Header>
				<!-- 列表 -->
				<table-list 
					:title="tabTitle"
					:com="currentCom"
					:isSuccess="isSuccess"
					style="padding:10px 0px 0px 10px;"
				></table-list>
			</a-spin>
		</div>
		
	</div>
</template>
<script>
	import { mapGetters, mapActions } from 'vuex'
	import config from '@/api/config.js'
	import Header from '@/components/detail/public/Header'
	import FormWork from '@/components/detail/public/FormWork'
	import FormTable from '@/components/detail/public/FormTable'
	import TableList from '@/components/detail/public/TableList'
	import StepDetail from '@/components/detail/public/StepDetail'
	export default {
		name: 'StudentDetailList',
		components: {
			Header,
			FormWork,
			FormTable,
			TableList,
			StepDetail
		},
		data(){
			return {
				spinning: false, 			// loading是否开启
				tableListSpinning: false,	// tab列表loading
				columns: [],
				dataSource: [],
				tabTitle: '学生列表',
				disablefBtn: true,
				currentCom: 'StudentGrade',	// 当前组件名称
				placeData: '输入学号',
				isSuccess: false
			}
		},
		computed: {
			...mapGetters({
				studentGradeList: 'student/studentGradeList',					// 学生成绩列表
				currentUser: 'currentUser',										// 用户登录信息
				detailCurrentComponent: 'publicData/detailCurrentComponent',				// 当前详情加载的组件
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
		mounted(){
			if (this.detailCurrentComponent === 'StudentGrade') {
				if (this.studentColumns.length !== 0 && this.studentData.length !== 0) {
					this.disableOfBtn = false
				}else {
					this.disableOfBtn = true
				}
			}
		},
		methods: {
			...mapActions({
				setStudentGradeList: 'student/setStudentGradeList',			// 设置学生成绩列表
			}),
			exportExcel(){
				require.ensure([], () => {
					const { export_json_to_excel } = require("../../../excel/Export2Excel");
 
				    const tHeader = ['学号', '姓名', '性别']; //将对应的属性名转换成中文
					const data =[]
				    export_json_to_excel(tHeader, data, '学生信息模板');　
				});
			},

			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => v[j]));
			},
			// 处理文件上传
			handleFileChange(info){
				if (info.file.status === 'done') {
					this.isSuccess = true
					this.$message.success('上传成功');
				} else if (info.file.status === 'error') {
					this.$message.error('上传失败');
					this.isSuccess = true
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
			},

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
	.studentDetailListContainer{
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
	}
</style>