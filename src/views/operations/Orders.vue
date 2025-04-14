<template>
    <!-- 表单部分 -->
    <el-card>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-input v-model="searchParams.orderNo" placeholder="请输入订单号">
                </el-input>
            </el-col>
            <el-col :span="6">
                <el-select v-model="searchParams.status" placeholder="订单状态">
                    <el-option :value="1" label="全部"></el-option>
                    <el-option :value="2" label="进行中"></el-option>
                    <el-option :value="3" label="已完成"></el-option>
                    <el-option :value="4" label="异常"></el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <el-input v-model="searchParams.no" placeholder="设备编号">
                </el-input>
            </el-col>
            <el-col :span="6">
                <el-button type="primary" @click="loadData">查询</el-button>
                <el-button @click="handleReset">重置</el-button>
            </el-col>
            <el-col :span="6" class="mt">
                <el-input v-model="searchParams.name" placeholder="请输入站点名称">
                </el-input>
            </el-col>
            <el-col :span="6" class="mt">
                <!-- element 日期区间   value-format 可选，绑定值的格式。 不指定则绑定值为 Date 对象
                 change	用户确认选定的值时触发-->
                <el-date-picker v-model="date" type="daterange" range-separator="/" value-format="YYYY-MM-DD"
                    @change="handleChange" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-col>
        </el-row>
    </el-card>
    <!-- 按钮 -->
    <el-card class="mt">
        <!-- 必须表格处有勾选才可以进行使用 -->
        <el-button type="danger" :disabled="!selectionList.length" @click="handleBatchDelete">批量删除</el-button>
        <el-button type="primary" icon="Download" :disabled="!selectionList.length"
            @click="exportToExcel">导出订单数据到Excel</el-button>
    </el-card>
    <!-- 表格和分页 -->
    <el-card class="mt">
        <!-- selection-change	当选择项发生变化时会触发该事件 -->
        <el-table :data="dataList" v-loading="loading" @selection-change="handleSelectChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="序号" width="80" />
            <el-table-column prop="orderNo" label="订单号" />
            <el-table-column prop="equipmentNo" label="设备编号" />
            <el-table-column prop="date" label="订单日期" />
            <el-table-column prop="startTime" label="开始时间" />
            <el-table-column prop="endTime" label="结束时间" />
            <el-table-column prop="money" label="金额" />
            <el-table-column prop="pay" label="支付方式" />
            <el-table-column>
                <template #default="scope">
                    <el-tag type="success" v-if="scope.row.status == 2">进行中</el-tag>
                    <el-tag type="primary" v-else-if="scope.row.status == 3">已完成</el-tag>
                    <el-tag type="warning" v-else-if="scope.row.status == 4">异常</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="opera" label="操作">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="handleDetail(scope.row.orderNo)">
                        详情
                    </el-button>
                    <el-button type="danger" size="small">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="fr mt mb" v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.pageSize"
            :page-sizes="[10, 20, 30, 40]" :background="true" layout="total, sizes, prev, pager, next, jumper"
            :total="totals" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useHttp } from '@/hooks/useHttp';
import { BatchDeleteApi } from '@/api/operation.'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useTabStore } from '@/store/tabs'
import * as XLSX from 'xlsx'; // 导入 xlsx 库，用于处理 Excel 文件
import { saveAs } from 'file-saver' // 导入 file-saver 库，用于保存文件

// 最上面表单部分 
const date = ref()
interface SearchType {
    orderNo: string
    status: number,
    no: string,
    startDate: string,
    endDate: string,
    name: string
}
const searchParams = ref<SearchType>({
    orderNo: "",
    status: 1,
    no: "",
    startDate: "",
    endDate: "", //不能写成date.value[0]
    name: ""
})
const handleChange = (val: string[]) => {
    // console.log(val)
    searchParams.value.startDate = val[0]
    searchParams.value.endDate = val[1]
}
// 下面表格部分
interface SelectionListType {
    orderNo: string,
    equipmentNo: string,
    date: string,
    startTime: string,
    endTime: string,
    money: string,
    pay: string,
    status: number
}
const { dataList,
    loading,
    loadData,
    totals,
    pageInfo,
    handleSizeChange,
    handleCurrentChange,
    resetPagination, } = useHttp<SelectionListType>('/orderList', searchParams)
const handleReset = () => {
    date.value = ["", ""]
    searchParams.value = {
        orderNo: "",
        status: 1,
        no: "",
        startDate: "",
        endDate: "",

        name: ""
    }
    resetPagination()
}
// 表格多选 
const selectionList = ref<SelectionListType[]>([])
const handleSelectChange = (selection: SelectionListType[]) => {
    selectionList.value = selection
}
//批量删除订单
const handleBatchDelete = async () => {
    const res = await BatchDeleteApi(selectionList.value.map((item: SelectionListType) => item.orderNo))
    if (res.code === 200) {
        ElMessage({
            message: res.data,
            type: 'success',
        });
        loadData()
    }
}
// 详情
// 点击详情，将订单号作为参数携带过去，然后在订单详情页面通过订单号发请求进行渲染
const router = useRouter()
// 添加快捷页签页 在store 中的 tab里
const tabStore = useTabStore()
const { addTab, setCurrentTab } = tabStore
const handleDetail = (orderNo: string) => {
    addTab('订单详情', '/operations/detail', "Share")
    setCurrentTab('订单详情', '/operations/detail')
    router.push("/operations/detail?orderNo=" + orderNo)

}
//点击详情页面 回订单管理页面需要缓存 已在basicrouemap里添加Meta{keep-alive}，tabslayout 控制路由处添加相关代码
// 此处代码是为了解决从非订单详情页面进入订单管理页面 不需要进行缓存
const route = useRoute()
// watch 监听 reactive 的属性（推荐用函数方式）
// 例如: const state = reactive({
//     count: 0
// })

// watch(() => state.count, (newVal, oldVal) => {
//     console.log('state.count:', oldVal, '->', newVal)
// })

// watch监视 如果不是从订单详情页面进入，则重新加载数据
watch(() => route.name, (to, from) => {
    console.log(to, from)
    if (to === 'orders' && from != 'details') {
        loadData()
    }
})
// 导出excel文件
const exportToExcel = () => {
    // 将选择的数据（selectionList.value）转换为工作表格式
    const ws = XLSX.utils.json_to_sheet(selectionList.value);

    // 创建一个新的工作簿（Workbook）
    const wb = XLSX.utils.book_new();

    // 将工作表（ws）追加到工作簿（wb）中，并命名为 'Sheet1'
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // 将工作簿（wb）写入输出格式，这里选择了 'xlsx' 格式，并以 'array' 类型输出
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // 创建一个新的 Blob 对象，并将输出数据放入其中，设置 MIME 类型为 'application/octet-stream'
    const blob = new Blob([wbout], { type: 'application/octet-stream' });

    // 使用 file-saver 库的 saveAs 函数，导出并下载 Excel 文件，指定文件名为 '导出数据.xlsx'
    saveAs(blob, '导出数据.xlsx');
}

</script>