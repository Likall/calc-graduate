<template>
    <div class="achieveAnaContainer">
        <div class="content-box">
            <div class="title">
                <div class="divider"></div>
                <h3>达成度统计</h3>
            </div>
            <!-- 折线图 -->
            <div id="echarts1" :style="{width: '800px', height: '500px'}"></div>
        </div>
    </div>
</template>
<script>
import config from '@/api/config.js'
export default {
    name: 'AchievmentAnalysis',
    data() {
        return {
            xData: [],          // x轴数据
            seriesData: [],     // 数据源
            demandList: [],     // demand列表
        }
    },
    mounted() {
        // 获取毕业达成度
        this.getQuotaCal();
        
    },
    methods: {
        getQuotaCal(){
            let self = this
            self.axios.get(config.GET_ALL_DEMAND2_LIST).then(response =>{
                // 查询成功
                if (response.data.code === '200'){
                    // 有数据
                    if (response.data.data.length > 0){
                        self.demandList = response.data.data;
                        let sortArray = []
                        for (let i = 0; i < response.data.data.length; i++) {
                            sortArray.push(response.data.data[i].name)
                            let name = '指标' + (i+1)
                            this.xData.push(name)
                        }
                        // 排序后
                        sortArray = sortArray.sort()
                        for (let k = 0; k < sortArray.length; k++){
                            for (let j = 0; j < self.demandList.length; j++){
                                if(sortArray[k] == self.demandList[j].name) {
                                    this.seriesData.push(parseFloat(self.demandList[j].evalResult).toFixed(2))
                                }
                            }
                        }
                        // 绘画毕业达成度折线图
                        this.drawLineEcarts()
                        
                    }
                }
            })
        },

        // 毕业达成度折线图设置
        drawLineEcarts(){
            // 获取容器
            let myChart = this.$echarts.init(document.getElementById('echarts1'))
            // 绘制图表
            myChart.setOption({
                title: { },
                tooltip: {
                    trigger: 'axis'
                },
                // x轴
                xAxis: {
                    data: this.xData
                },
                // y轴
                yAxis: {
                    type: 'value'
                },
                // 数据
                series: [{
                    type: 'line',
                    data: this.seriesData
                }]
            });
        }
    }

}
</script>
<style lang="scss" scoped>
    .achieveAnaContainer {
        position: relative;
        width: 100%;
        height: 100%
    }
</style>