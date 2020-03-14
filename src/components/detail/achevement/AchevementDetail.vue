<template>
	<div class="acheveContainer">
		<a-spin :spinning="acheveSpinning">
			<div class="title">
				<div class="divider"></div>
				<h3>达成度总结果</h3>
			</div>
			<div class="content-box">
				<a-table
					:columns="columns" 
					:dataSource="dataSource"
					:pagination="Pagination"
					:rowClassName="(record, index) => { if(index % 2 === 1) return 'dark-row'}"
					bordered>
				</a-table>
			</div>
			<div class="title">
				<div class="divider"></div>
				<h3>二级指标点结果</h3>
			</div>
			<div class="demand2-content-box">
				<a-select :value="selectDemand2Info" style="width: 550px" @change="handleSelectChange">
					<a-select-option v-for="(item, index) in demand2NameList"  :key="index" :value="item">{{item}}</a-select-option>
				</a-select>
				<a-table 
					bordered
					:columns="demand2Columns"
					:dataSource="demand2DataSource">
				</a-table>
			</div>
		</a-spin>
	</div>
</template>
<script>
	import config from '@/api/config.js'
	export default {
		name: 'AchevementDetail',
		data() {
			return {
				acheveSpinning: false,		 // loading是否开启
				dataSource: [],				 // 数据源
				columns: [					 // 列数据
					{
						title: '毕业要求',
						dataIndex: 'demand1',
						width: '15%',
						customRender: (value, row, index) => {
							const obj2 = {
							children: value,
							attrs: {},
							};
							if ((index+1)%2 == 0) {
								obj2.attrs.rowSpan = 0;
							} else {
								obj2.attrs.rowSpan = 2;
							}
							return obj2;
							
						}
					}
				],				 
				demandList: [],				 // 毕业要求列表
				Pagination: {current: 1, total: 0, pageSize: 30, pageNum: 1, pages: 0},			// 分页信息
				demand2Info: [],			// 二级指标点信息
				demand2IdList: [],			// 二级指标点ID
				demand2NameList: [],		// 二级指标点名称
				selectDemand2Info: '',		// 下拉框当前击中的二级指标信息
				demand2DataSource: [],		// 数据源
				demand2Columns: [			// 列数据
				],
				tempLength: 0,
			}
		},
		mounted() {
			// 获取毕业达成度
			this.getQuotaCal();
		},
		methods: {
			/**
			* Introduction 	获取毕业要求指标点
			* @author 刘莉
			* @since 1.0
			*/
			getDemandList(){
				let self = this;
				self.axios.get(config.GET_ALL_DEMAND2_LIST).then(response =>{
					// 查询成功
					if (response.data.code === '200'){
						// 有数据
						if (response.data.data.length > 0){
							let responseData = response.data.data
							// 设置毕业要求指标点与结果
							self.demandList = responseData;
							// 二级指标点长度-> 最长长度
							let tempMaxLength = 0
							for (let i = 0; i < responseData.length; i++) {
								let objOfDemand1 = {}
								// 设置最长长度
								if (tempMaxLength < responseData[i].demand2List.length) {
									tempMaxLength = responseData[i].demand2List.length;
								}
								let objOfEvalResult = {}
								// 设置数据源
								objOfEvalResult['demand1'] = '指标'+[i+1]
								objOfDemand1['demand1'] = '指标'+[i+1]
								// 排序
								let sortNameArray = []
								let sortCalcArray = []
								for (let m = 0; m < responseData[i].demand2List.length; m++) {
									let splitData = responseData[i].demand2List[m].name
									sortNameArray.push(splitData)
								}
								// 排序后的名称
								sortNameArray = sortNameArray.sort()
								for (let n = 0; n < sortNameArray.length; n++) {
									if (n == 0) {
										// 设置数据源
										objOfDemand1['demand2'] = '指标点'
										objOfEvalResult['demand2'] = '评价值'
										objOfEvalResult['evalresult'] = parseFloat(responseData[i].evalResult).toFixed(2);
									}
									for (let k = 0; k < responseData[i].demand2List.length; k++) {
										if (responseData[i].demand2List[k].name == sortNameArray[n]) {
											// 如果指标点大于等于10 截取4个字符串
											if (i >= 9) {
												objOfDemand1['index' + n] = sortNameArray[n].substr(0,4);
											} else {
												objOfDemand1['index' + n] = sortNameArray[n].substr(0,3);
											}
											objOfEvalResult['index' + n] = parseFloat(responseData[i].demand2List[k].evalResult).toFixed(2)
										}
										
									}
								}
								self.dataSource.push(objOfDemand1)
								self.dataSource.push(objOfEvalResult)
							}
							let obj = {
								'title': '指标点',
								'dataIndex': 'demand2',
								'colSpan': tempMaxLength+1,
							}
							self.columns.push(obj)
							// 设置列
							let tempObj = {}
							for (let j = 0; j < tempMaxLength; j++) {
								tempObj = {
									'title': '指标点',
									'dataIndex': 'index'+j,
									'colSpan': 0
								}
								self.columns.push(tempObj)
							}
							self.columns.push({
								'title': '评价值',
								'dataIndex': 'evalresult'
							})
						}
					} else {
						self.$message.error('查询失败')
					}
				})
			},

			/**
			* Introduction 	获取毕业达成度指标点
			* @author 刘莉
			* @since 1.0
			*/
			getQuotaCal(){
				let self = this
				this.demand2IdList = []
				this.demand2NameList = []
				this.demand2Info = []
				// 计算毕业达成度
				this.axios.get(config.GET_QUOTA_CALCULATE).then(response => {
					// 查询成功
					if (response.data.code == '200') {
						// 设置二级指标信息
						this.demand2Info = response.data.data
						for (let i = 0; i < response.data.data.length; i++) {
							// 设置ID
							this.demand2IdList.push(response.data.data[i].demand1Id)
							// 设置名称
							this.demand2NameList.push(response.data.data[i].name)
							if( i == 0){
								this.saveDemand2Info(i, response.data.data)
							}
						}
						this.getDemandList()
					} else {
						
					}
				})
			},
			/**
			* Introduction 	将二级指标点ID和内容存储
			* @author 刘莉
			* @since 1.0
			*/
			saveDemand2Info(i, array){
				this.demand2Columns.push({
					'title': '毕业要求',
					'dataIndex': 'demand',
					'width': '25%'
				})
				this.selectDemand2Info = this.demand2NameList[i]
				let columnsLength = array[i].courseList.length
				// 设置数据源
				let objData = {}
				objData['demand'] = array[i].name
				for( let j = 0; j < columnsLength; j++) {
					// 设置列数据
					this.demand2Columns.push({
						'title': array[i].courseList[j].courseName,
						'dataIndex': 'course' + j
					})
					objData['course' + j] = parseFloat(array[i].courseList[j].evalResult).toFixed(2)
				}
				objData['evalresult'] = parseFloat(array[i].evalResult).toFixed(2)
				objData['key'] = 0
				this.demand2Columns.push({
					'title' : '评价结果',
					'dataIndex': 'evalresult',
				})
				// 设置数据源
				this.demand2DataSource.push(objData)
			},

			handleSelectChange(value,option){
				this.demand2Columns = []
				this.demand2DataSource = []
				this.saveDemand2Info(option.data.key, this.demand2Info)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.acheveContainer{
		position: relative;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		padding: 15px;

		.title {
			position: relative;
    		height: 50px
		}
		/deep/ .ant-table-tbody > tr > td {
			padding: 6px;
		}
		.content-box {
			background: #ffffff;
		}

		/deep/ .dark-row {
			background-color: #CEEFFF !important;
		}

		.demand2-content-box{
			position: relative;
			width: 100%;
			padding-bottom: 20px;
			background-color: #ffffff;
		}

		.ant-select {
			padding-bottom: 10px;
			margin-top: 10px;
			margin-left: 10px
		}
	}
</style>