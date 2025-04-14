//封装的useChart 自定义组合函数 ，在dashbord里需要使用自定义函数的时候，直接调用useChart函数
import type { Ref } from 'vue'
import { onBeforeUnmount, onMounted, ref, markRaw } from 'vue'
import * as echarts from 'echarts'

//chartRef：传入的 ref，用于绑定 ECharts的DOM容器 initialOptions:初始的 ECharts 配置 option
export function useChart(chartRef: Ref<HTMLElement | null>, setChartData: any) {
    // echarts.ECharts 是echarts实例类型
    //chartInstance：保存 ECharts 的实例对象，类型是 echarts.ECharts，初始为空 null
    const chartInstance = ref<echarts.ECharts | null>(null)
    // const chartOptions = ref(initialOptios)
    const ininChart = async () => {
        //判断 chartRef.value 是否存在，确保 div 已渲染
        if (chartRef.value) {
            //echarts.init(chartRef.value) 初始化 ECharts 并赋值给 chartInstance
            //markRaw(value) 是 Vue 3 提供的 API，作用是 标记对象为非响应式，防止 Vue 追踪这个对象的变化。echarts.init() 返回的是一个 ECharts 实例，它是一个复杂对象，包含大量内部状态和方法。
            // Vue 的响应式系统不适用于这种复杂对象，否则 Vue 会尝试代理 ECharts 内部的状态，可能导致性能下降或错误。 即vue的响应式会和echarts内部的响应式冲突
            chartInstance.value = markRaw(echarts.init(chartRef.value))
            //chartInstance.value.setOption(chartOptions.value) 设置图表配置
            const options = await setChartData()
            chartInstance.value.setOption(options)
        }
    }
    //监听 窗口大小变化，动态调整 ECharts 图表大小
    const resizeChart = () => {
        chartInstance.value?.resize()
    }

    onMounted(() => {
        ininChart()
        window.addEventListener('resize', resizeChart)
    })
    onBeforeUnmount(() => {
        window.removeEventListener('resize', resizeChart)
        if (chartInstance.value) {
            //dispose echarts自带资源 ，在页面关闭时卸载图表资源
            chartInstance.value.dispose()
        }
    })
}