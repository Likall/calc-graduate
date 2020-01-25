<template>
	<div class="formWorkContainer">
		
		<div class="uploadFileContainer" >
			<a-button  @change="onUpload" class="upload-file" id="uploadFile"> 
				<a-icon type="upload"/>上传模板文件(仅.csv文件)
				<input type="file" name="uploadCSV" id="upCsv" />
			</a-button>
		</div>
			
		<Button size="large" @click="exportData(1)" class="download">
			 <Icon type="ios-download-outline"></Icon> 
				下载模板
		</Button>
		<div class="tableContainer">
			<Table 
				:columns="columns" 
				:data="data"
				size="small" 
				ref="table" 
				:show-header="false"
				:border="true">
				</Table>
			<br>
		</div>
		
		
	</div>
</template>
<script>
	import { mapGetters, mapActions } from 'vuex';
	import tools from '@/public/tools/tools'
	export default {
		name: 'FormWork',
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
				data: []
			}
		},
		computed:{
			...mapGetters({
				studentGrade: 'formwork/studentGrade',				// 成绩
				studentCourse: 'formwork/studentCourse'	,			// 课程
				tabTitleItem: 'tabTitleItem',						// 顶部tab项
				detailCurrentComponent: 'detailCurrentComponent',	// 详情加载的组件
				courseColumns: 'courseColumns',						// 课程模板文件列
				courseData: 'courseData',							// 课程模板文件数据
				studentColumns: 'studentColumns',					// 学生模板文件列
				studentData: 'studentData',							// 学生模板文件数据
				relDemandAndCourseColumns: 'relDemandAndCourseColumns', // 课程指标点与课程模板文件列
				relDemandAndCourseData: 'relDemandAndCourseData',	// 课程指标点与课程模板文件数据
			})
		},
		watch:{
			detailCurrentComponent(New, Old){
				if(New){
					if(New.key === '1'){
						this.formData = tools.deepClone(this.studentCourse)
						this.formTitle = this.titleData[1]
						// 设置课程信息模板信息
						this.columns = this.courseColumns
						this.data = this.courseData
					}else if(New.key === '3' || New.key === '2'){
						this.formTitle = this.titleData[2]
					}else if(New.key === '6'){
						this.formData = tools.deepClone(this.studentGrade)
						this.formTitle = this.titleData[0]
						// 设置学生成绩模板信息
						this.columns = this.studentColumns
						this.data = this.studentData
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
			}else if(this.detailCurrentComponent  === 'DemandDetail' || this.detailCurrentComponent  === 'RelationDetail'){
				this.formTitle = this.titleData[2]
			}else if(this.detailCurrentComponent === 'StudentGrade'){
				this.formData = tools.deepClone(this.studentGrade)
				this.formTitle = this.titleData[0]
				// 设置学生成绩模板信息
				this.columns = this.studentColumns
				this.data = this.studentData
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
                    this.$refs.table.exportCsv({
						filename: 'The original data',
						noHeader: true
                    });
                } else if (type === 2) {
                    this.$refs.table.exportCsv({
                        filename: 'Sorting and filtering data',
                        original: false
                    });
                } else if (type === 3) {
                    this.$refs.table.exportCsv({
                        filename: 'Custom data',
                        columns: this.columns8.filter((col, index) => index < 4),
                        data: this.data7.filter((data, index) => index < 4)
                    });
				}
			},

			// 上传模板文件
			onUpload() {
				console.log("1212")
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
									if(tempColumns.length === data[i].length){
										self.columns = tempColumns
										if(self.detailCurrentComponent === 'CourseDetail'){
											console.log(self.columns)
											self.setCourseColumns(self.columns)
										}else if (self.detailCurrentComponent  === 'DemandDetail' || self.detailCurrentComponent  === 'RelationDetail'){
											self.setRelDemandAndCourseColumns(self.columns)
										}else if (self.detailCurrentComponent === 'StudentGrade'){
											self.setCourseColumns(self.columns)
										}
									}else{
										obj['key'] = 'index' + j
										tempColumns.push(obj)
									}
									// 设置行数
									if(data[i][j] !== '' && data[i][j] !== null){
										obj2['index' + j] = data[i][j]
									}
									if((j+1) === data[i].length){
										tempData.push(obj2)
										self.data = tempData
										if(self.detailCurrentComponent === 'CourseDetail'){
											console.log(self.data)
											self.setCourseData(self.data)
										}else if (self.detailCurrentComponent  === 'DemandDetail' || self.detailCurrentComponent  === 'RelationDetail'){
											self.setRelDemandAndCourseData(self.data)
										}else if (self.detailCurrentComponent === 'StudentGrade'){
											self.setCourseData(self.data)
										}
									}
								}
								
							}
						}
					}
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

		.download{
			height: 40px;
			position: absolute;
			right: 10px;
			top: -33px;
		}

		.tableContainer{
			position: absolute;
    		left: 10px;
			top: 20px;

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
		
	}
</style>