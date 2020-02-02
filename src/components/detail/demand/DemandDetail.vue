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
				<demand-table-list></demand-table-list>
			</a-spin>
		</div>
	</div>
</template>
<script>
	import StepDetail from '@/components/detail/public/StepDetail'
	import DemandTableList from '@/components/detail/demand/DemandTableList'
	
	import { mapGetters } from 'vuex';
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
				responseData: {},			// 接口返回数据
				tableData: [],
				colData: [],
				originData: [
					{"skuId":"00001","skuName":"nameSku0001","w00001":
						{"warehouseId":"w00001","warehouseName":"仓库1","quantity":50,"lockQuantity":5,"availableQuantity":45},"w00002":{"warehouseId":"w00002","warehouseName":"仓库2","quantity":200,"lockQuantity":5,"availableQuantity":195}
						,"w00003":{"warehouseId":"w00003","warehouseName":"仓库3","quantity":40,"lockQuantity":1,"availableQuantity":39}},{"skuId":"00002","skuName":"nameSku0002","warehouseItem":[{"warehouseId":"w00001","warehouseName":"仓库1","quantity":100,"lockQuantity":5,"availableQuantity":95},{"warehouseId":"w00002","warehouseName":"仓库2","quantity":200,"lockQuantity":5,"availableQuantity":195},{"warehouseId":"w00003","warehouseName":"仓库3","quantity":5,"lockQuantity":5,"availableQuantity":0}],"w00001":{"warehouseId":"w00001","warehouseName":"仓库1","quantity":100,"lockQuantity":5,"availableQuantity":95},"w00002":{"warehouseId":"w00002","warehouseName":"仓库2","quantity":200,"lockQuantity":5,"availableQuantity":195},"w00003":{"warehouseId":"w00003","warehouseName":"仓库3","quantity":5,"lockQuantity":5,"availableQuantity":0}},{"skuId":"00003","skuName":"nameSku0003","warehouseItem":[{"warehouseId":"w00001","warehouseName":"仓库2","quantity":100,"lockQuantity":5,"availableQuantity":95},{"warehouseId":"w00002","warehouseName":"仓库2","quantity":200,"lockQuantity":5,"availableQuantity":195},{"warehouseId":"w00003","warehouseName":"仓库3","quantity":50,"lockQuantity":5,"availableQuantity":45}],"w00001":{"warehouseId":"w00001","warehouseName":"仓库2","quantity":100,"lockQuantity":5,"availableQuantity":95},"w00002":{"warehouseId":"w00002","warehouseName":"仓库2","quantity":200,"lockQuantity":5,"availableQuantity":195},"w00003":{"warehouseId":"w00003","warehouseName":"仓库3","quantity":50,"lockQuantity":5,"availableQuantity":45}}]
			}
		},
		computed: {
			...mapGetters({
				currentUser: 'currentUser',				 // 当前登录用户信息
				detailCurrentComponent: 'publicData/detailCurrentComponent',	// 当前详情加载的组件
			})	
		},
		mounted(){
		},
		methods: {
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
				} else if (info.file.status === 'error') {
					this.$message.error('上传失败');
					this.isSuccess = false;
					this.spinning = false;
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