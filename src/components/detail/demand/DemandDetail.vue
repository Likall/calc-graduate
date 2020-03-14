<template>
	<div class="DemandContainer">
		<div class="content-box">
			<a-spin :spinning="spinning">
				<!-- 步骤条 -->
				<div class="btn-form" v-if="currentUser.length > 0">
					<a-button size="large"  @click="exportSpecialExcel"> <a-icon type="download"/>下载毕业要求模板文件</a-button>
					<div class="uploadCsvContainer" v-if="currentUser[0].role === '2'">
						<!-- 导入文件 -->
						<a-upload
							name="file"
							:multiple="false"
							@change="handleFileChange"
							action="http://localhost:8091/gacs/excel/demand"
						>
						<a-button type="primary" size="large"> <a-icon type="upload" />导入毕业要求文件</a-button>
						</a-upload>
					</div>
				</div>
				<!-- 列表 -->
				<demand-table-list :dataSource="changeDataSource" :columns="columns" :colData="colData" @updateDemand="updateDemand"></demand-table-list>
			</a-spin>
		</div>
	</div>
</template>
<script>
	import StepDetail from '@/components/detail/public/StepDetail'
	import DemandTableList from '@/components/detail/demand/DemandTableList'
	
	import config from '@/api/config.js' 
	import { mapGetters, mapActions } from 'vuex'
	import tools from '@/public/tools/tools'
	import XLSX from 'xlsx'
	export default {
		name: 'DemandDetail',
		components: {
			StepDetail,
			DemandTableList,
		},
		data() {
			return {
				spinning: false,			// 是否开启loading
				isSuccess: false,			// 导入文件是否成功
				demandData: [],				// 毕业要求指标点列表
				dataSource: [],
				columns: [
					{
						'title': '一级毕业要求',
						'dataIndex': 'demand1',
						'fixed': 'left',
						'width': 200,
						'scopedSlots': { customRender: 'demand1' },
					}
				],
				colData: ['demand1'],				// template for table
				changeDataSource: [],
			}
		},
		computed: {
			...mapGetters({
				currentUser: 'currentUser',				 // 当前登录用户信息
				detailCurrentComponent: 'publicData/detailCurrentComponent',	// 当前详情加载的组件\
				demandList: 'demand/demandList',		// 毕业要求列表
				originDataSource: 'demand/originDataSource',	// 数据源
			})	
		},
		mounted(){
			this.getDemandList()
		},
		methods: {
			...mapActions({
				setDemandList: 'demand/setDemandList',		// 设置毕业要求列表
				setOriginDataSource: 'demand/setOriginDataSource', // 设置毕业要求数据源
			}),
			// 生成excel
			exportSpecialExcel() {
				var aoa = [
					['一级毕业要求', '二级毕业要求',null, null], // 特别注意合并的地方后面预留2个null
					['1、这是一级要求', '1.1这个是二级要求', '1.2这个是二级要求', '1.3这个是二级要求'],
					['1、这是一级要求', '1.1这个是二级要求', '1.2这个是二级要求', '1.3这个是二级要求'],
				];
				var sheet = XLSX.utils.aoa_to_sheet(aoa);
				// s 开始 e 结束
				sheet['!merges'] = [
					// 合并第一行数据[B1,C1,D1,E1]
					{s: 
						{
							r: 0,  // 开始行
							c: 1   // 可以看成开始列,实际是取值范围
						}, 
					e: 
						{
							r: 0,  //结束行
							c: 4   // 结束列
						}
					}
				];
				this.openDownloadDialog(this.sheet2blob(sheet), '毕业指标点模板.xlsx');
			},
			sheet2blob(sheet, sheetName) {
				sheetName = sheetName || 'sheet1';
				var workbook = {
					SheetNames: [sheetName],
					Sheets: {}
				};
				workbook.Sheets[sheetName] = sheet;
				// 生成excel的配置项
				var wopts = {
					bookType: 'xlsx', // 要生成的文件类型
					bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
					type: 'binary'
				};
				var wbout = XLSX.write(workbook, wopts);
				var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
				// 字符串转ArrayBuffer
				function s2ab(s) {
					var buf = new ArrayBuffer(s.length);
					var view = new Uint8Array(buf);
					for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
					return buf;
				}
				return blob;
			},
			// 下载excel
			openDownloadDialog(url, saveName)
			{
				if(typeof url == 'object' && url instanceof Blob)
				{
					url = URL.createObjectURL(url); // 创建blob地址
				}
				var aLink = document.createElement('a');
				aLink.href = url;
				aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
				var event;
				if(window.MouseEvent) event = new MouseEvent('click');
				else
				{
					event = document.createEvent('MouseEvents');
					event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				}
				aLink.dispatchEvent(event);
			},
			// 处理文件上传
			handleFileChange(info){
				console.log(info)
				this.spinning = true;
				if (info.file.status === 'done') {
					this.$message.success('上传成功');
					this.isSuccess = true;
					this.spinning = false;
					// 执行成功
					this.responseData = info.file.response
					this.getDemandList();
				} else if (info.file.status === 'error') {
					this.$message.error('上传失败');
					this.isSuccess = false;
					this.spinning = false;
				}
			},

			// 查询毕业要求列表
			getDemandList(){
				let self = this
				self.axios.get(config.GET_ALL_DEMAND2_LIST).then(response =>{
					if (response.data.code === '200'){
						// 有数据
						if (response.data.data.length > 0){
							let responseData = response.data.data
							// 设置毕业要求指标点与结果
							self.demandData = responseData;
							// 二级指标点长度-> 最长长度
							let tempMaxLength = 0
							for (let i = 0; i < responseData.length; i++) {
								let objOfDemand1 = {}
								// 设置最长长度
								if (tempMaxLength < responseData[i].demand2List.length) {
									tempMaxLength = responseData[i].demand2List.length;
								}
								// 设置数据源
								objOfDemand1['demand1'] = responseData[i].name
								objOfDemand1['key'] = responseData[i].demand1Id
								// 排序
								let sortNameArray = []
								let sortCalcArray = []
								for (let m = 0; m < responseData[i].demand2List.length; m++) {
									let splitData = responseData[i].demand2List[m].name
									sortNameArray.push(splitData)
								}
								// 排序后的名称
								sortNameArray = sortNameArray.sort()
								// let tempDemand2List = tools.deepClone(sortNameArray)
								let tempDemand2List = []
								// 设置排序后的毕业要求数据
								for (let n = 0; n < sortNameArray.length; n++) {
									let obj = {
										name: sortNameArray[n]
									}
									for (let k = 0; k < responseData[i].demand2List.length; k++) {
										if (responseData[i].demand2List[k].name == sortNameArray[n]) {
											objOfDemand1['index' + n] = sortNameArray[n];
											obj.demand2Id = responseData[i].demand2List[k].demand2Id
										}
										
									}
									tempDemand2List.push(obj)
									
								}
								// 设置毕业要求列表
								
								self.demandData[i].demand2List = tempDemand2List
								self.setDemandList(self.demandData)
								self.dataSource.push(objOfDemand1)
							}
							self.changeDataSource = tools.deepClone(self.dataSource)
							self.setOriginDataSource(self.dataSource)

							// 设置列
							
							for (let j = 0; j < tempMaxLength; j++) {
								let tempObj = {}
								if(j === 1) {
									tempObj = {
										'title': '二级毕业要求',
										'dataIndex': 'index' + j,
										'colSpan': tempMaxLength,
										'scopedSlots': { customRender: 'index' + j },
									}
									self.columns.push(tempObj)
								} else {
									tempObj = {
										'title': '二级毕业要求',
										'dataIndex': 'index'+j,
										'colSpan': 0,
										'scopedSlots': { customRender: 'index'+j },
									}
									self.columns.push(tempObj)
								}
								self.colData.push('index' + j)
								
							}
							let operatObj = {
								'title': '操作',
								'dataIndex': 'operation',
								'colSpan': 1,
								'fixed': 'right',
								'width': 150,
								scopedSlots: { customRender: 'operation' },
							}
							self.columns.push(operatObj)
						}
					} else {
						self.$message.error('查询失败')
					}
				})
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
			* Introduction 接收父组件传递过来的值
			* @author 刘莉
			* @since 1.0
			* @param {data} 从demandtablelist接收的数据源 
			* @param {index} 取消行的下标
			* @param {indexOfSave} 保存的下标
			*/
			updateDemand(data, index, indexOfSave) {
				console.log(data,index, indexOfSave)
				// 取消修改，还原
				if (index !=='' && index !== null && index !== 'undefined' && typeof index !== 'undefined') {
					this.changeDataSource = [...data]
					this.changeDataSource[index] = {...this.dataSource[index]}
				}
				// 保存
				else if (indexOfSave !=='' && indexOfSave !== null && indexOfSave !== 'undefined' && typeof indexOfSave !== 'undefined') {
					this.updateDemandsTotal(indexOfSave, data)
				}
				else {
					this.changeDataSource = data
				}
			},

			/**
			* Introduction 更新指标点
			* @author 刘莉
			* @since 1.0
			* @param {index} 更新的下标
			*/
			updateDemandsTotal(index, data) {
				let self = this
				// 一级指标点ID
				let demand1Id = this.dataSource[index].key
				// 一级指标点名称
				let demand1Name = this.changeDataSource[index].demand1
				// 设置参数
				let demand2List = self.setDemandResData(index)
				let resData = {
					demand1Id: demand1Id,
					name: demand1Name,
					demand2List
				}
				// 更新值
				self.axios.post(config.UPDATE_DEMAND, resData).then(response => {
					if (response.data.code === 200) {
						self.$message.success(response.data.msg)
						self.changeDataSource = data
						// 更新dataSource值
						self.dataSource[index] = {...self.changeDataSource[index]}
						self.changeDataSource = tools.deepClone(self.dataSource)
						self.setOriginDataSource(self.changeDataSource)
					} else {
						self.$message.success(response.data.msg)
						self.changeDataSource[index] = {...self.dataSource[index]}
					}
				})
			},

			/**
			* Introduction 设置参数
			* @author 刘莉
			* @since 1.0
			* @param {index} 下标
			*/
			setDemandResData(index) {
				// 设置二级指标点
				let array = []
				let obj = {}
				for (let i = 0; i < this.demandData[index].demand2List.length; i++) {
					let keyName = 'index'+i
					obj = {
						demand2Id: this.demandData[index].demand2List[i].demand2Id,
						name: this.changeDataSource[index][keyName]
					}
					array.push(obj)
				}
				return array
			}
		}
	}
</script>
<style lang="scss" scoped>
	.DemandContainer{
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
			margin-right: 10px;
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