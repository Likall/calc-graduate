<template>
	<div class="demandTableContainer" v-if="dataSource.length > 0">
		<!-- 搜索按钮 -->
		<Header style="padding: 10px 0 0 10px;"></Header>
		<div class="title">
			<div class="divider"></div>
		</div>
		<div class="demand-table-box">
			<a-table :columns="columns" :dataSource="dataSource" bordered :pagination="demandPagination">
				<template
					v-for="col in columnData"
					:slot="col"
					slot-scope="text, record, index">
					<div :key="col">
						<a-input
							v-if="record.editable"
							style="margin: -5px 0"
							:value="text"
							@change="e => handleChange(e.target.value, record.key, col)"/>
						<template v-else>{{text}}</template>
					</div>
				</template>
				<template slot="operation" slot-scope="text, record, index">
					<div class="editable-row-operations">
						<span v-if="record.editable">
							<a-button size="small" type="primary" @click="() => save(index)">保存</a-button>
							<a-popconfirm title="确认取消?" @confirm="() => cancel(index)">
								<a-button size="small">取消</a-button>
							</a-popconfirm>
						</span>
						<span v-else>
							<a-button size="small" type="primary" @click="() => edit(index)">编辑</a-button>
							<a-popconfirm title="确认删除?" @confirm="() => deleteRow(index)">
								<a-button size="small">删除</a-button>
							</a-popconfirm>
							
						</span>
					</div>
				</template>
			</a-table>
		</div>
	</div>
</template>
<script>
	import Header from '@/components/detail/public/Header'
	export default {
		name: 'DemandTableList',
		components: {
			Header
		},
		props: [
			
		],
		data() {
			return {
				columns: [],			// 表的列数
				dataSource: [],			// 数据源
				columnData: [],			// 组
				oldTempRowData: {},		// 原行数据
				demandPagination: {current: 1, total: 0, pageSize: 10, size: 'small'},      // 分页信息
			}
		},
		mounted() {
		},
		methods: {
			// 处理输入框事件更改事件
			handleChange(value, key, column) {
				const newData = [...this.dataSource];
				const target = newData.filter(item => key === item.key)[0];
				if (target) {
					target[column] = value;
					this.dataSource = newData;
				}
			},

			// 点击编辑按钮事件
			edit(index) {
				// 编辑时 -> 存储未更改数据，为取消事件返回原数据
				this.oldTempRowData = this.dataSource[index]
				const newData = [...this.dataSource];
				const target = newData.filter((item, i) => index === i);
				// 设置该行可编辑
				if (target) {
					target[0].editable = true;
					this.dataSource = newData;
				}
			},

			// 编辑后的保存事件
			save(index) {
				const newData = [...this.dataSource];
				// 保存后，编辑该行的数据清除
				this.oldTempRowData = {}
				const target = newData.filter((item,i) => index === i);
				if (target) {
					delete target[0].editable;
					this.dataSource = newData;
				}
			},

			// 编辑后取消修改事件
			cancel(index) {
				const newData = [...this.dataSource];
				const target = newData.filter((item,i) => index === i);
				if (target) {
					newData[index] = this.oldTempRowData
					delete target[0].editable;
					this.dataSource = newData;
				}
			},

			// 删除该行数据
			deleteRow(index){
				let newData = [...this.dataSource]
				let target = newData.filter((item,i) => index === i)
				if (target) {
					// 变换状态
					delete target.editable
					newData.splice(index, 1)
					this.dataSource = newData;
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	.demandTableContainer{
		position: relative;
		width: 100%;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		padding: 0 0px 10px;

		.demand-table-box{
			background-color: white;
		}
		
		.divider{
			margin-left: 0px;
		}
	}
</style>