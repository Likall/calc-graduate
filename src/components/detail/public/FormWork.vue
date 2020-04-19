<template>
	<div class="formWorkContainer" v-show="currentUser.length > 0">
		
		<div class="uploadFileContainer" v-if="currentUser[0].role === '1'">
			<!--  -->
			<!-- <a-button  @change="onUpload" class="upload-file" id="uploadFile" >  -->
			<a-button   class="upload-file" id="uploadFile" > 
				<a-icon type="upload"/>{{title}}(仅.csv文件)
				<input type="file" name="uploadCSV" id="upCsv" @change="uploadFile"/>
			</a-button>
			
		</div>
		<Button size="large" @click="exportData(1)" class="download" v-if="currentUser[0].role === '2'" :disabled="disableOfDown">
			 <Icon type="ios-download-outline"></Icon> 
				下载模板
		</Button>
		<span style="color: #d81e06;" v-if="disableOfDown === true"><i class="iconfont icon-zhuyi"/>暂无模板文件，等待管理员上传</span>
		<!-- 管理员登录时 -->
		<div class="adminTableContainer" v-if="currentUser[0].role === '1'">
			<div class="title">
				<div class="divider"></div>
				<h3>模板内容</h3>
			</div>
			<Table 
				:columns="columns" 
				:data="data"
				size="small" 
				ref="table" 
				:show-header="false"
				:border="true"
				width="800">
			</Table>
			<br>
		</div>
		<!-- 教师登录时 -->
		<div class="tableContainer" v-if="currentUser[0].role === '2'">
			<div class="title">
				<div class="divider"></div>
				<h3>模板内容</h3>
			</div>
			<Table 
				:columns="columns" 
				:data="data"
				size="small" 
				ref="table" 
				:show-header="false"
				:border="true"
				width="800"
				>
			</Table>
			<br>
		</div>
		
	</div>
</template>
<script>
	import { mapGetters, mapActions } from 'vuex';
	import tools from '@/public/tools/tools'
	import XLSX from 'xlsx'
	export default {
		name: 'FormWork',
		props: [
			'title'
		],
		data(){
			return {
				titleData: [
					'成绩信息模板',
					'课程信息模板',
					'权重信息模板'
				],
				formData: [],
				formTitle: '',
				columns: [],
				data: [],
				disableOfDown: false,			// 下载模板按钮是否可以点击
			}
		},
		computed:{
			...mapGetters({
				studentGrade: 'formwork/studentGrade',				// 成绩
				studentCourse: 'formwork/studentCourse'	,			// 课程
				relDemandCourse: 'formwork/relDemandCourse'	,		// 指标点与课程关系
				tabTitleItem: 'publicData/tabTitleItem',						// 顶部tab项
				detailCurrentComponent: 'publicData/detailCurrentComponent',	// 详情加载的组件
				courseColumns: 'courseColumns',						// 课程模板文件列
				courseData: 'courseData',							// 课程模板文件数据
				studentColumns: 'studentColumns',					// 学生模板文件列
				studentData: 'studentData',							// 学生模板文件数据
				relDemandAndCourseColumns: 'relDemandAndCourseColumns', // 课程指标点与课程模板文件列
				relDemandAndCourseData: 'relDemandAndCourseData',	// 课程指标点与课程模板文件数据
				currentUser: 'currentUser',							// 当前登录的用户信息
			})
		},
		watch:{
			detailCurrentComponent(New, Old){
				if(New === 'CourseDetail'){
					this.formData = tools.deepClone(this.studentCourse)
					this.formTitle = this.titleData[1]
					// 设置课程信息模板信息
					this.columns = this.courseColumns
					this.data = this.courseData
					// 设置下载模板文件是否可以点击
					if (this.courseColumns.length !== 0 && this.courseData.length !== 0) {
						// 模板文件已上传设置可以点击
						this.disableOfDown = false
					}else {
						this.disableOfDown = true
					}
				}else if(New  === 'RelDemandAndCourseDetail'){
					this.formTitle = this.titleData[2]
					this.formData = tools.deepClone(this.relDemandCourse)
					// 设置指标点与课程模板信息
					this.columns = this.relDemandAndCourseColumns
					this.data = this.relDemandAndCourseData
					// 设置下载模板文件是否可以点击
					if (this.relDemandAndCourseColumns.length !== 0 && this.relDemandAndCourseData.length !== 0) {
						// 模板文件已上传设置可以点击
						this.disableOfDown = false
					}else {
						this.disableOfDown = true
					}
				}else if(New === 'StudentGrade'){
					this.formData = tools.deepClone(this.studentGrade)
					this.formTitle = this.titleData[0]
					// 设置学生成绩模板信息
					this.columns = this.studentColumns
					this.data = this.studentData
					// 设置下载模板文件是否可以点击
					if (this.studentColumns.length !== 0 && this.studentData.length !== 0) {
						// 模板文件已上传设置可以点击
						this.disableOfDown = false
					}else {
						this.disableOfDown = true
					}
				}
			}
		},
		mounted() {
			if(this.detailCurrentComponent === 'CourseDetail'){
				this.formData = tools.deepClone(this.studentCourse)
				this.formTitle = this.titleData[1]
				// 设置课程信息模板信息
				this.columns = this.courseColumns
				this.data = this.courseData
				// 设置下载模板文件是否可以点击
				if (this.courseColumns.length !== 0 && this.courseData.length !== 0) {
					// 模板文件已上传设置可以点击
					this.disableOfDown = false
				}else {
					this.disableOfDown = true
				}
			}else if(this.detailCurrentComponent  === 'RelDemandAndCourseDetail'){
				this.formTitle = this.titleData[2]
				this.formData = tools.deepClone(this.relDemandCourse)
				// 设置指标点与课程模板信息
				this.columns = this.relDemandAndCourseColumns
				this.data = this.relDemandAndCourseData
				// 设置下载模板文件是否可以点击
				if (this.relDemandAndCourseColumns.length !== 0 && this.relDemandAndCourseData.length !== 0) {
					// 模板文件已上传设置可以点击
					this.disableOfDown = false
				}else {
					this.disableOfDown = true
				}
			}else if(this.detailCurrentComponent === 'StudentGrade'){
				this.formData = tools.deepClone(this.studentGrade)
				this.formTitle = this.titleData[0]
				// 设置学生成绩模板信息
				this.columns = this.studentColumns
				this.data = this.studentData
				// 设置下载模板文件是否可以点击
				if (this.studentColumns.length !== 0 && this.studentData.length !== 0) {
					// 模板文件已上传设置可以点击
					this.disableOfDown = false
				}else {
					this.disableOfDown = true
				}
			}
			
			
		},
		methods: {
			...mapActions({
				setCourseColumns: 'setCourseColumns',							// 课程模板文件列
				setCourseData: 'setCourseData',									// 课程模板文件数据
				setStudentColumns: 'setStudentColumns',							// 课程学生信息模板文件列
				setStudentData: 'setStudentData',								// 课程学生信息模板文件数据
				setRelDemandAndCourseColumns: 'setRelDemandAndCourseColumns',	// 设置课程与指标点关系模板文件列
				setRelDemandAndCourseData: 'setRelDemandAndCourseData',			// 设置课程与指标点关系模板文件数据
			}),
			exportExcel(){
				require.ensure([], () => {
					const { export_json_to_excel } = require("../../../excel/Export2Excel");
 
				     const tHeader = [...this.formData]; //将对应的属性名转换成中文
				
				     const data = [];　　　　　　
				
				     export_json_to_excel(tHeader, data, this.formTitle);　
				});
			},

			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => v[j]));
			},

			// 导出文件
			exportData(type) {
                if (type === 1) {
					let fileName = ''
					// 设置模板文件名称
					if(this.detailCurrentComponent === 'CourseDetail'){
						fileName = "课程信息模板"
					} else if (this.detailCurrentComponent === 'StudentGrade') {
						fileName = "学生成绩模板"
					} else if (this.detailCurrentComponent === 'RelDemandAndCourseDetail') {
						fileName = '课程与指标点模板'
					}
                    this.$refs.table.exportCsv({
						filename: fileName,
						noHeader: true
					});
				}
			},

			// 上传模板文件
			onUpload() {
				// 重置
				this.columns = []
				this.data = []
				let sum = 0;
				let fileType = $('#upCsv').val().split('.');
				let files = document.getElementById("upCsv").files;
				let name = files[0] ? files[0].name : '';
				$("#uploadFile").attr("disabled","disabled");
				// 导入.csv文件
				if((fileType[fileType.length-1]) === 'csv' || (fileType[fileType.length-1]) === 'CSV'){
					let data = [];
					let files = document.getElementById("upCsv").files;
					if(files.length) {
						let file = files[0];
						let reader = new FileReader(); //new一个FileReader实例
						if(typeof FileReader == 'undefined') {
							self.$message.error("你的浏览器暂不支持该功能")
							file.setAttribute("disabled", "disabled");
							return;
						}
						reader.readAsText(file);
						let self = this
						reader.onload = function() {
							let num = null;
							let relArr = this.result.split("\r\n");
							if(!$.isEmptyObject(relArr) && relArr.length > 1) {
								for(let key = 0; key < relArr.length; key++) {
									let values = relArr[key];
									if(!$.isEmptyObject(values)) {
										let objArr = values.split(",");
										data.push(objArr);
									}
								}
							}else{
								self.$message.error("格式不正确")
							}
							let tempData = []
							let tempColumns = []
							for(let i = 0; i < data.length; i++){
								let obj2 = {}
								for(let j = 0; j < data[i].length; j++){
									let obj = {}
									// 设置列数
									if(tempColumns.length !== data[i].length){
										obj['key'] = 'index' + j
										tempColumns.push(obj)
										if(tempColumns.length === data[i].length){
											self.columns = tempColumns
											if(self.detailCurrentComponent === 'CourseDetail'){
												self.setCourseColumns(self.columns)
											}else if (self.detailCurrentComponent  === 'RelDemandAndCourseDetail'){
												self.setRelDemandAndCourseColumns(self.columns)
											}else if (self.detailCurrentComponent === 'StudentGrade'){
												self.setStudentColumns(self.columns)
											}
										}
										
									}
									// 设置行数
									if(data[i][j] !== '' && data[i][j] !== null){
										obj2['index' + j] = data[i][j]
									}
									if((j+1) === data[i].length){
										tempData.push(obj2)
										self.data = tempData
										if(self.detailCurrentComponent === 'CourseDetail'){
											self.setCourseData(self.data)
										}else if (self.detailCurrentComponent  === 'RelDemandAndCourseDetail'){
											self.setRelDemandAndCourseData(self.data)
										}else if (self.detailCurrentComponent === 'StudentGrade'){
											self.setStudentData(self.data)
										}
									}
								}
								
							}
							self.disableOfDown = false;
						}
					}
				}
			},

			uploadFile(e){
				console.log(e)
				//拿到所导入文件的名字
				let fileName = e.target.files[0]
				//定义reader，存放文件读取方法
                let reader = new FileReader()
				//启动函数
                reader.readAsBinaryString(fileName)
                //onload在文件被读取时自动触发
                reader.onload = function(e) {
                    //workbook存放excel的所有基本信息
					let workbook = XLSX.read(e.target.result, {type: 'binary'})
					console.log(workbook)
                    //定义sheetList中存放excel表格的sheet表，就是最下方的tab
					let sheetList = workbook.SheetNames
					console.log()
                    //存放json数组格式的表格数据
                    let resultJson = []
                    //存放字符串数组格式的表格数据
                    let resultFormulae = []
                    sheetList.forEach(function(y) {
						let worksheet = workbook.Sheets[y]
						console.log(worksheet)
						let json = XLSX.utils.sheet_to_json(worksheet)
						console.log(json)
                        let formulae = XLSX.utils.sheet_to_formulae(workbook.Sheets[y])
                        if(json.length > 0){
                            //具体如何处理看项目需求，我的项目其实只有一个sheet，在这里写成循环避免大家误会
                            //数据处理与存放
                            resultJson.push(json)
                            resultFormulae.push(formulae)
                        }
 
					});
					console.log("1",resultJson)
					console.log("2",resultFormulae)
					//因为我的表格只有一列，因此我取出resultJson第一组数据的key作为键去遍历取出手机号码
					// let tableHeader = Object.keys(result[0])[0]
					// console.log("table",tableHeader)
                    // let importInfo = result.map((item) => {
					// 	console.log("item",item)
                    //     return item[tableHeader]
					// })
					// console.log("im",importInfo)
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	.formWorkContainer{
		width: 100%;
		margin-right: 10px;
    	position: relative;
		top: 35px;
		// left: 122px;
		box-sizing: border-box;
		padding: 10px;

		.download{
			height: 40px;
			position: absolute;
			top: -33px;
			// left: -150px;
		}

		.adminTableContainer{
			position: relative;
			// left: -150px;

			.ivu-table-wrapper-with-border{
				margin-top: 10px;
			}

			table{
				position: relative;
			}
		}
		.tableContainer{
			position: relative;
			// left: -160px;

			.ivu-table-wrapper-with-border{
				margin-top: 10px;
			}

			table{
				position: relative;
			}
		}

		#upCsv{
			width: 140px;
			overflow: hidden;
			position: absolute;
			left: 0;
			opacity: 0;
			cursor: pointer;
		}
		.upload-file{
			cursor: pointer;
		}

		.uploadFileContainer{
			width: 250px;
			position: absolute;
			// left: -140px;
			top: -35px;
			#uploadFile{
				height: 40px;
			}
		}

		.title{
			height: 40px;
		}

		.divider{
			margin-left: 0;
		}
		
		
	}
</style>