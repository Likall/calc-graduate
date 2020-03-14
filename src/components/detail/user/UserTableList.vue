<template>
	<div class="userTableListContainer">
		<div class="title">
			<div class="divider"></div>
			<h3>{{title}}</h3>
		</div>
		<a-table :rowSelection="rowSelection" :columns="columns" :dataSource="dataSource" bordered @change="handleTableChange">
			<template slot="role" slot-scope="text, record, index">
				<span>
					<a-tag v-if="text === 2 " color="cyan">教师</a-tag>
					<a-tag v-if="text === 3 " color="orange">学生</a-tag>
				</span>
			</template>
			<template slot="operation" slot-scope="text, record, index">
				<div class="editable-row-operations">
					<span>
						<a-popconfirm title="确认删除?" @confirm="() => deleteRow(index)">
							<a-button size="small">删除</a-button>
						</a-popconfirm>
					</span>
				</div>
			</template>
		</a-table>
	</div>
</template>
<script>
import tools from '@/public/tools/tools'
export default {
	name: 'UserTableList',
	data() {
		return {
			selectedRowKeys: [],			// 多选框选中值
		}
	},
	props: [
		'dataSource',
		'columns',
		'title'
	],
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			return {
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRowKeys = selectedRows
					this.$emit('updateDataSource', [], selectedRows, 3)
				},
				getCheckboxProps: record => ({
					props: {
						name: record.name,
					},
				}),
			};
      	},
	},
	mounted: {
		
	},
	methods: {
		handleTableChange(){
			console.log("121212")
		},
		// 处理输入框事件更改事件
		handleChange(value, key) {
			console.log(value, columns, key)
			const newData = [...this.dataSource];
			const target = newData.filter(item => key === item.key)[0];
			console.log(target)
			if (target) {
				// target[column] = value;
				// this.$emit('updateDataSource', newData)
			}
		},
		edit(index) {
			// 编辑时 -> 存储未更改数据，为取消事件返回原数据
			this.oldTempRowData = this.dataSource[index]
			const newData = [...this.dataSource];
			const target = newData.filter((item, i) => index === i);
			// 设置该行可编辑
			if (target) {
				target[0].editable = true;
				this.$emit('updateDataSource', newData)
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
				this.$emit('updateDataSource', newData, 2)
			}
		},

		// 编辑后取消修改事件
		cancel(index) {
			const newData = [...this.dataSource];
			const target = newData.filter((item,i) => index === i);
			if (target) {
				newData[index] = this.oldTempRowData
				delete target[0].editable;
				this.$emit('updateDataSource', newData)
			}
		},

		deleteRow(index){
			let newData = [...this.dataSource]
			let target = newData.filter((item,i) => index === i)
			if (target) {
				// 变换状态
				delete target.editable
				newData.splice(index, 1)
				this.$emit('updateDataSource', newData, target, 1)
			}
		},
	}
}
</script>
<style lang="scss" scoped>
	.userTableListContainer {
		width: 100%;
		height: 100%;
		background: #ffffff;

		.divider {
			margin-left: 15px;
		}

		.ant-table-wrapper {
			padding: 0 15px;
			background: #ffffff;
		}
	}
</style>