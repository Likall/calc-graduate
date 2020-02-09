<template>
	<!-- 指标点与课程关系 -->
	<div class="relDetailContainer">
		<div class="content-box">
			<a-spin :spinning="spinning" tip="正在生成模板文件,请等待....">
				<div class="btn-form">
					<a-button size="large" @click="getDemand2Info"> <a-icon type="download" />下载指标点与课程关系模板文件</a-button>
					<div class="uploadCsvContainer" v-if="currentUser[0].role === '2'">
						<!-- 导入文件 -->
						<a-upload
							name="file"
							:multiple="false"
							@change="handleFileChange"
							action="http://localhost:8091/gacs/excel/quota"
						>
						<a-button type="primary" size="large"> <a-icon type="upload" />导入指标点与课程关系文件</a-button>
						</a-upload>
					</div>
				</div>
			</a-spin>
		</div>
	</div>
</template>
<script>
	import Header from '@/components/detail/public/Header'
	import config from '@/api/config.js'
	import { mapGetters } from 'vuex'
	export default {
		name: 'RelDemandAndCourseDetail',
		components: {
			Header,
			
		},
		data(){
			return {
				spinning: false,			// 是否开启loading
				editDemand: '毕业指标点',
				editRelDemandCourse: '指标点与课程关系',
				editClose: '完成',
				dataSource: [],				// 数据源
				filterVal: [],				// 列数据
			}
		},
		computed:{
			...mapGetters({
				currentUser: 'currentUser',				// 当前登录用户信息
				detailCurrentComponent: 'publicData/detailCurrentComponent',	// 当前加载的详情组件
				relDemandAndCourseColumns: 'relDemandAndCourseColumns', // 课程指标点与课程模板文件列
				relDemandAndCourseData: 'relDemandAndCourseData',	// 课程指标点与课程模板文件数据
				hasCompletePage: 'hasCompletePage',					// 步骤条已完成页面
			})
		},
		watch:{
			// 设置button是否是可点击
			detailCurrentComponent(New, Old){
				if (New === 'RelDemandAndCourseDetail') {
					if (this.relDemandAndCourseColumns.length !== 0 && this.relDemandAndCourseData.length !== 0) {
						this.disableOfBtn = false
					}else {
						this.disableOfBtn = true
					}
				}
			}
		},
		methods: {
			// 处理文件上传
			handleFileChange(info){
				if (info.file.status === 'done') {
					this.$message.success('上传成功');
				} else if (info.file.status === 'error') {
					this.$message.error('上传失败');
				}
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
			},

			/**
			* Introduction 获得指标点2列表数据
			* @author 刘莉
			* @since 1.0
			*/
			getDemand2Info(){
				let self = this
				// 开启loading
				self.spinning = true
				self.axios.get(config.GET_ALL_DEMAND2_LIST).then(response =>{
					// 查询成功
					if (response.data.code === '200'){
						// 有数据
						if (response.data.data.length > 0){
							
							let objDemand2Id = {}
							let objDemand2Name = {}
							this.filterVal.push('index0')
							this.filterVal.push('index1')
							let tempLength = 0
							// 一级毕业要求
							for(let i = 0; i < response.data.data.length; i++){
								console.log(response.data.data)
								let demand2List = response.data.data[i].demand2List
								console.log(demand2List)
								for(let j = 0; j < demand2List.length; j++){
									objDemand2Id[ 'index' + (tempLength+j+2) ] = demand2List[j].demand2Id
									objDemand2Name[ 'index' + (tempLength+j+2) ] = demand2List[j].name
									let tempName = ['index' + (tempLength+j+2)]
									this.filterVal.push(tempName)
								}
								tempLength += demand2List.length ;
								
							}
							this.dataSource.push(objDemand2Id)
							this.dataSource.push(objDemand2Name)
							this.getCourseInfo()
						}
					}
				})
			},

			/**
			* Introduction 获取课程列表数据
			* @author 刘莉
			* @since 1.0
			*/
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
							
							for(let i = 0; i < response.data.data.list.length; i++){
								let objCourse = {}
								objCourse[ 'index0'] = response.data.data.list[i].courseId
								objCourse[ 'index1'] = response.data.data.list[i].courseName
								self.dataSource.push(objCourse)
							}
							self.exportExcel()
						}
					} else{
						self.$message.error('模板文件生成失败')
					}
					// 关闭loading
					self.spinning = false;
				})
			},
			// 将列表数据导出成excel
			exportExcel(){
				require.ensure([], () => {
					const { export_json_to_excel } = require("../../../excel/Export2Excel");
 
				    const tHeader = ['注意: 按格式填写,勿修改已填写的模板内容(课程名和指标点对应处填写权重值)']; //将对应的属性名转换成中文
				    const list = this.dataSource;　　
					const　filterVal = this.filterVal　　　
					const data = this.formatJson(filterVal, list);
				    export_json_to_excel(tHeader, data, '指标点与课程关系模板');　
				});
			},

			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => v[j]));
			},
		}
		
	}
</script>
<style lang="scss" scoped>
	.relDetailContainer{
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

			.uploadCsvContainer{
				display: inline-block; 
				position: relative; 
			}
		}

	}
</style>