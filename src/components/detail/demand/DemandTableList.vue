<template>
	<div class="demandTableContainer" v-if="dataSource.length > 0">
		<div class="title" style="padding:0 10px">
			<div class="divider"></div>
			<h3>毕业要求列表</h3>
		</div>
		<div class="demand-table-box">
			<a-table :columns="columns" :dataSource="dataSource" bordered :pagination="demandPagination" :scroll="{ x: 1300, y: 300}"
			:rowClassName="(record, index) => { if(index % 2 === 1) return 'dark-row'}">
				<template
					v-for="col in colData"
					:slot="col"
					slot-scope="text, record, index"
					>
					<div :key="col">
						<a-textarea
							autosize 
							v-if="record.editable"
							style="margin: -5px 0"
							:value="text"
							@change="e => handleChange(e.target.value, record.key, col)"></a-textarea>
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
	import tools from '@/public/tools/tools'
	import Header from '@/components/detail/public/Header'
	export default {
		name: 'DemandTableList',
		components: {
			Header
		},
		props: [
			'dataSource',
			'columns',
			'colData'
		],
		data() {
			this.cacheData = this.dataSource.map(item => ({ ...item }));
			return {
				oldDataSource: [],			// 原数据源
				newDataSource: [],		// 更新后的数据源
				oldTempRowData: {},		// 原行数据
				demandPagination: {current: 1, total: 0, pageSize: 15, size: 'small'},      // 分页信息
			}
		},
		mounted() {
		},
		methods: {

			/**
			 * Introduction 处理输入框事件更改事件
			 * @author 刘莉
			 * @since 1.0
			 * @param {value} 项
			 * @param {key} key值
			 * @param {columns} 列值
			 */
			handleChange(value, key, column) {
				// 设置数据源
				const newData = [...this.dataSource];
				const target = newData.filter(item => key === item.key)[0];
				if (target) {
					target[column] = value;
					// // 更新父组件数据源数据
					this.$emit('updateDemand', newData)
				}
			},


			/**
			 * Introduction 点击编辑按钮事件
			 * @author 刘莉
			 * @since 1.0
			 * @param {index} 下标
			 */
			edit(index) {
				// 编辑时 -> 存储未更改数据，为取消事件返回原数据
				const newData = [...this.dataSource];
				const target = newData.filter((item, i) => index === i);
				// 设置该行可编辑
				if (target) {
					target[0].editable = true;
					// 更新父组件数据源数据
					this.$emit('updateDemand', newData)
				}
			},

			/**
			 * Introduction 编辑后的保存事件
			 * @author 刘莉
			 * @since 1.0
			 * @param {index} 下标
			 */
			save(index) {
				const newData = [...this.dataSource];
				// 保存后，编辑该行的数据清除
				this.oldTempRowData = {}
				const target = newData.filter((item,i) => index === i);
				if (target) {
					delete target[0].editable;
					// 更新父组件数据源数据
					this.$emit('updateDemand', newData, '', index)
				}
			},

			/**
			 * Introduction 编辑后取消修改事件
			 * @author 刘莉
			 * @since 1.0
			 * @param {index} 下标
			 */
			cancel(index) {
				const newData = [...this.dataSource];
				const target = newData.filter((item,i) => index === i);
				if (target) {
					Object.assign(target, this.cacheData.filter((item,i) => index === i));
					delete target[0].editable;
					// 更新父组件数据源数据
					this.$emit('updateDemand', newData, index)
				}
			},

			/**
			 * Introduction 删除该行数据
			 * @author 刘莉
			 * @since 1.0
			 * @param {index} 下标
			 */
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
			padding: 0 10px;
		}
		
		.divider{
			margin-left: 0px;
		}
		/deep/ .dark-row {
			background-color: #F7FDFF !important;
		}
	}
</style>