<template>
    <el-row :gutter="20">
        <el-col :span="4">
            <el-card>
                <div class="title">
                    <div class="round">
                        <el-icon>
                            <Document />
                        </el-icon>
                    </div>
                    <h4>今日总收入 (元)</h4>
                </div>
                <div class="total mt">
                    <h1>{{ formatNumberToThousands(2924) }}</h1>
                    <div class="percent">-21%</div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="4">
            <el-card>
                <div class="title">
                    <div class="round">
                        <el-icon>
                            <Document />
                        </el-icon>
                    </div>
                    <h4>本月总收入 (万元)</h4>
                </div>
                <div class="total mt">
                    <h1>{{ formatNumberToThousands(239824) }}</h1>
                    <div class="percent">-21%</div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="4">
            <el-card>
                <div class="title">
                    <div class="round">
                        <el-icon>
                            <Document />
                        </el-icon>
                    </div>
                    <h4>会员卡储值金额 (元)</h4>
                </div>
                <div class="total mt">
                    <h1>{{ formatNumberToThousands(239824) }}</h1>
                    <div class="percent">-21%</div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="4">
            <el-card>
                <div class="title">
                    <div class="round">
                        <el-icon>
                            <Document />
                        </el-icon>
                    </div>
                    <h4>服务费总金额 (元)</h4>
                </div>
                <div class="total mt">
                    <h1>{{ formatNumberToThousands(239824) }}</h1>
                    <div class="percent">-21%</div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="4">
            <el-card>
                <div class="title">
                    <div class="round">
                        <el-icon>
                            <Document />
                        </el-icon>
                    </div>
                    <h4>停车费总金额 (元)</h4>
                </div>
                <div class="total mt">
                    <h1>{{ formatNumberToThousands(239824) }}</h1>
                    <div class="percent">-21%</div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="4">
            <el-card>
                <div class="title">
                    <div class="round">
                        <el-icon>
                            <Document />
                        </el-icon>
                    </div>
                    <h4>电费总金额 (元)</h4>
                </div>
                <div class="total mt">
                    <h1>{{ formatNumberToThousands(239824) }}</h1>
                    <div class="percent">-21%</div>
                </div>
            </el-card>
        </el-col>
    </el-row>
    <!-- 图 -->
    <el-card class="mt">
        <div ref="chartRef" style="width: 100%; height: 300px;"></div>
    </el-card>
    <!-- 表 -->
    <el-card class="mt">
        <el-input v-model="name" style="max-width: 400px;" placeholder="请输入站点名称">
            <template #append>
                <el-button icon="search" @click="loadData"></el-button>
            </template>
        </el-input>
        <el-table :data="tableData" v-loading="Loading">
            <el-table-column type="index" label="序号" width="80" />
            <el-table-column prop="name" label="充电站名称" />
            <el-table-column prop="id" label="充电站id" />
            <el-table-column prop="city" label="所属城市" />
            <el-table-column prop="count" label="充电桩总量(个)" />
            <!-- 给表格排序 直接添加sortable属性 -->
            <el-table-column prop='day' label="单日总收入(元)" sortable>
                <template #default="scope">
                    <span>{{ scope.row.day }}</span>
                    <el-tag class="ml" :type="scope.row.percent > 0 ? 'success' : 'danger'">
                        {{ scope.row.percent > 0 ? "+" + scope.row.percent + '%' : scope.row.percent + '%' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="month" label="月度总收入(万元)">
                <!-- scope 这个变量就是在 Element Plus中的 el-table-column 组件里，官方预设好的作用域插槽参数 -->
                <!-- scope通常包含{
                row, // 当前行的数据对象
                column, // 当前列的配置对象
                $index // 当前行的索引（从 0 开始）
                } -->
                <template #default="scope">
                    <span>{{ scope.row.month }}</span>
                    <el-tag class="ml" :type="scope.row.mpercent > 0 ? 'success' : 'danger'">
                        {{ scope.row.mpercent > 0 ? "+" + scope.row.mpercent + '%' : scope.row.mpercent + '%' }}
                    </el-tag>
                </template>

            </el-table-column>
            <el-table-column prop="electricity" label="电费营收(元)" />
            <el-table-column prop="parkingFee" label="停车费营收(元)" />
            <el-table-column prop="serviceFee" label="服务费营收(元)" />
            <el-table-column prop="member" label="会员储值金(元)" />
        </el-table>
        <el-pagination class="fr mt mb" v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.pageSize"
            :page-sizes="[10, 20, 30, 40]" layout="total,sizes, prev, pager, next" :total="totals"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" :background="true" />
    </el-card>
</template>
<script lang="ts" setup>
import formatNumberToThousands from '@/utils/toThousand'
import { chartApi, revenueApi } from '@/api/chargingstation';
import { useChart } from "@/hooks/useChart.ts"
import { onMounted, reactive, ref } from "vue";
import { usePagination } from '@/hooks/usePagination'


// 图
const chartRef = ref(null)
const setChartData = async () => {
    const chartOptions = reactive({
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: []
        },
        xAxis: {
            type: 'category',
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月']
        },
        yAxis: [
            {
                type: 'value',
                name: '销售',
                position: 'left'
            },
            {
                type: 'value',
                name: '访问量',
                position: 'right'
            }
        ],
        series: [
            {
                name: '',
                type: 'bar',
                data: [],
                yAxisIndex: 0,
                itemStyle: {
                    color: '#409eff'
                }
            },
            {
                name: '',
                type: 'line',
                data: [],
                yAxisIndex: 1,
                itemStyle: {
                    color: '#409eff'
                },
                smooth: true
            }
        ]
    });
    const res = await chartApi();
    for (let i = 0; i < res.data.list.length; i++) {
        chartOptions.series[i].name = res.data.list[i].name
        chartOptions.series[i].data = res.data.list[i].data
    }
    chartOptions.legend.data = res.data.list.map((item: any) => item.name)
    return chartOptions
}
useChart(chartRef, setChartData)
// 表
const tableData = ref([])
const Loading = ref<boolean>(false)
const name = ref<string>('')

const loadData = async () => {
    Loading.value = true
    const { data: { list, total } } = await revenueApi({ ...pageInfo, name: name.value })
    setTotals(total)
    // 如果箭头函数要 返回一个对象字面量，必须加括号 ({ ... })
    tableData.value = list.map((item: any) => ({
        ...item,
        day: item.electricity + item.parkingFee + item.serviceFee + item.member
    }))
    Loading.value = false

}
const { totals, pageInfo, handleSizeChange, handleCurrentChange, setTotals } = usePagination(loadData)

onMounted(() => {
    loadData()
})

</script>

<style lang="less" scoped>
.title {
    display: flex;
    align-items: center;

    .round {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: rgb(235, 236, 245);
        text-align: center;
        line-height: 35px;
        margin-right: 20px;
    }

    h4 {
        color: #666;
    }
}

.total {
    display: flex;
    align-items: center;

    h1 {
        margin-right: 20px;
        font-size: 30px;
    }

    .percent {
        display: inline-block;
        padding: 3px 5px;
        height: 20px;
        color: green;
        font-size: 12px;
        background-color: rgb(235, 247, 239);
        border-radius: 2px;
        line-height: 20px;
    }
}
</style>