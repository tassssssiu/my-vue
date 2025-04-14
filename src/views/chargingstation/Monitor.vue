<template>
  <!-- 第一行 -->
  <el-card>
    <el-row :gutter='20'>
      <el-col :span='6'>
        <el-input v-model.trim="formParams.input" placeholder="请输入站点名称、ID">
          <template #append>
            <el-select v-model="select" style="width: 115px">
              <el-option label="按名称查询" value="name" />
              <el-option label="按ID查询" value="id" />
            </el-select>
          </template>
        </el-input>
      </el-col>
      <el-col :span='6'>
        <el-select placeholder="充电站状态" v-model="formParams.value">
          <el-option label="全部" :value="1"></el-option>
          <el-option label="使用中" :value="2"></el-option>
          <el-option label="空闲中" :value="3"></el-option>
          <el-option label="维护中" :value="4"></el-option>
          <el-option label="待维修" :value="5"></el-option>
        </el-select>
      </el-col>
      <el-col :span='6'>
        <el-button type="primary" @click="loadData">查询</el-button>
        <el-button @click="handleReset">重置</el-button>

      </el-col>
    </el-row>
    <!-- 使用element statistic统计组件 -->
  </el-card>
  <!-- 第二行 直接写死的数据 -->
  <el-card class="mt">
    <el-row>
      <el-col :span="6">
        <el-statistic title="累计充电量(度)" :value="268900" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="累计充电次数(次)" :value="1389"></el-statistic>
      </el-col>
      <el-col :span="6">
        <el-statistic title="服务区域(个)" :value="88" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="累计效益(元)" :value="5622178">
        </el-statistic>
      </el-col>
    </el-row>
  </el-card>
  <!-- 第三行 图标 -->
  <el-card class="mt">
    <el-button type="primary" @click="handleAdd">
      <el-icon style="margin-right: 5px;">
        <Plus />
      </el-icon>
      新增充电站
    </el-button>
  </el-card>

  <!--表格  使用的element table表格组件-->
  <el-card class="mt">
    <!-- v-loading 可以在加载时出现加载模块，而非空白 等于true的时候就是加载中的状态-->
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="60" label="序号" />
      <el-table-column prop="name" label="站点名称" />
      <el-table-column prop="id" label="站点ID" />
      <el-table-column prop="city" label="所属城市" />
      <el-table-column prop="fast" label="快充数" />
      <el-table-column prop="slow" label="慢充数" />
      <el-table-column prop="status" label="充电站状态">
        <template #default="scope">
          <!-- scope.row可以拿到一整行的数据 -->
          <el-tag v-if="scope.row.status === 2" type="primary">使用中 </el-tag>
          <el-tag v-if="scope.row.status === 3" type="success">空闲中 </el-tag>
          <el-tag v-if="scope.row.status === 4" type="warning">维护中 </el-tag>
          <el-tag v-if="scope.row.status === 5" type="danger">待维修 </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="now" label="正在充电" />
      <el-table-column prop="fault" label="故障数" />
      <el-table-column prop="person" label="站点负责人" />
      <el-table-column prop="tel" label="负责人电话" />
      <el-table-column label="操作">
        <template #default="scope">
          <!-- scope.row可以拿到一整行的数据 -->
          <el-button type="primary" size="small" @click="edit(scope.row)">编辑 </el-button>
          <!-- 气泡弹出窗  confirm 点击确认按钮时触发-->
          <el-popconfirm title="确定要删除当前站点吗" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button type="danger" size="small">删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 这里要实现分页功能 element 分页功能 -->
    <el-pagination class="fr mt mb" v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.pageSize"
      :page-sizes="[10, 20, 30, 40]" layout="total,sizes, prev, pager, next" :total="totals"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" :background="true" />
  </el-card>
  <StationForm :dialog-visible="visible" @close="visible = false" @reload="loadData"></StationForm>
</template>

<script setup lang="ts">
import { DeleteApi, listApi } from '@/api/chargingstation'
import { ref, reactive, onMounted } from 'vue'
import StationForm from '@/views/chargingstation/components/StationForm.vue'
import type { RowType } from '@/types/station/index'
import { useStationStore } from '@/store/station'
import { ElMessage } from 'element-plus'
const formParams = reactive({
  input: "",
  // value是指查询前的状态
  value: 1
})
const select = ref("name")
const totals = ref<number>(0)
const tableData = ref<RowType[]>([])
const pageInfo = reactive({
  page: 1,
  pageSize: 10
})
const loading = ref<boolean>(false)

const loadData = async () => {
  loading.value = true
  // input 可能是name也可能是id
  const { data: { list, total } } = await listApi({ ...pageInfo, status: formParams.value, [select.value]: formParams.input })
  loading.value = false
  tableData.value = list
  totals.value = total
}
onMounted(() => {
  loadData()
})

const handleSizeChange = (size: number) => {
  pageInfo.pageSize = size
  loadData()
}
const handleCurrentChange = (page: number) => {
  // 这里的page是可以拿到的当前的页面数
  pageInfo.page = page
  loadData()
}
const handleReset = () => {
  pageInfo.page = 1
  pageInfo.pageSize = 10
  formParams.input = ''
  formParams.value = 1
  select.value = 'name'
  loadData()
}

const visible = ref<boolean>(false)
const stationStore = useStationStore()
const { setRowData } = stationStore
const edit = (row: RowType) => {
  setRowData(row)
  visible.value = true
}
const handleAdd = () => {
  // pinia中数据在编辑时被更改了，因此这里需要进行清空操作
  setRowData({
    name: "",
    id: "",
    city: "",
    fast: "",
    slow: "",
    status: 1,
    now: "",
    fault: "",
    person: "",
    tel: ""
  })
  visible.value = true
}
const handleDelete = async (id: string) => {
  const res = await DeleteApi(id)
  if (res.code === 200) {
    ElMessage({
      message: res.data,
      type: 'success',
    })
  }
  loadData()
}

</script>
