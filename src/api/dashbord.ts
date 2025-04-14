//获取dashboard下 echarts数据
import { get } from '@/utils/http'
enum Api {
    chartData = '/chartData',
    chartData2 = '/chartData2',
    chartData3 = 'chartData3'
}

function chartDataApi() {
    return get(Api.chartData)
}
function chartDataApi2() {
    return get(Api.chartData2)
}
function chartDataApi3(): Promise<any> {
    return get(Api.chartData3)
}

export { chartDataApi, chartDataApi2, chartDataApi3 }

