<!--计费管理页面 -->
<!-- 重点 树形图的模糊查询 和 时间区间动态生成的表单校验 -->
<template>
    <el-row :gutter="20">
        <el-col :span="6">
            <!-- 搜索框 -->
            <el-card>
                <el-input style="width:80%" placeholder="请输入关键词" v-model="filterText">
                    <template #append>
                        <el-button icon="Search" />
                    </template>
                </el-input>
            </el-card>
            <!-- 树形图 element tree组件 -->
            <!--  show-checkbox 加了前面有框 -->
            <!-- node-click 当节点被点击时触发 -->
            <el-tree style="max-width: 600px;" :props="defaultProps" :data="treeData" class="mt" show-checkbox
                :filter-node-method="filterNode" ref="treeRef" @node-click="handleNodeClick">
            </el-tree>
        </el-col>
        <el-col :span="18">
            <el-card>
                <template #header>
                    <div class="card-header">
                        <span>{{ title }}:计费模版</span>
                    </div>
                </template>
                <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" class="demo-ruleForm"
                    status-icon>
                    <el-form-item label="模版名称" prop="name">
                        <el-input v-model="ruleForm.name" style="max-width: 200px" />
                    </el-form-item>
                    <div v-for="(timeSlot, index) in ruleForm.date" :key="index">
                        <el-form-item :label="'时间区间' + (index + 1) + ':'" required>
                            <el-col :span="8">
                                <el-form-item :prop="'date.' + index + '.date1'"
                                    :rules="{ required: true, message: '时间不能为空', trigger: 'blur' }">
                                    <el-time-picker v-model="timeSlot.date1" type="date" aria-label="开始时间"
                                        placeholder="开始时间" style="width: 100%" />
                                </el-form-item>
                            </el-col>
                            <el-col class="text-center" :span="1">
                                <span class="text-gray-500">-</span>
                            </el-col>
                            <el-col :span="8">
                                <!-- prop格式是固定的 element里固定的 -->
                                <!-- eg.date.0.date1 是ruleform里date[0].date1-->
                                <el-form-item :prop="'date.' + index + '.date2'"
                                    :rules="{ required: true, message: '时间不能为空', trigger: 'blur' }">
                                    <el-time-picker v-model="timeSlot.date2" aria-label="结束时间" placeholder="结束时间"
                                        style="width: 100%" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="电费：" :prop="'date.' + index + '.electricity'"
                                    :rules="{ required: true, message: '时间不能为空', trigger: 'blur' }">
                                    <el-input v-model="timeSlot.electricity" style="width: 100%" />
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                    </div>
                    <el-button type="primary" class="mb" @click="addTimeSlot">添加时间区间</el-button>
                    <el-form-item label="服务费" prop="service">
                        <el-input v-model="ruleForm.service" style="max-width: 200px" />
                    </el-form-item>
                    <el-form-item label="停车费" prop="parking">
                        <el-input v-model="ruleForm.parking" style="max-width: 200px" />
                    </el-form-item>
                    <el-form-item label="特殊备注" prop="remarks">
                        <el-input v-model="ruleForm.remarks" type="textarea" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm()">
                            创建
                        </el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, reactive } from "vue"
import { cityListApi } from "@/api/operation."
import type { TreeInstance } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

// 树形图
const filterText = ref('')
const defaultProps = {
    children: 'children',
    label: 'label',
}
interface Tree {
    label: string
    children?: Tree[]
}
// 树形图渲染数据
const treeData = ref<Tree[]>([])
onMounted(async () => {
    const { data } = await cityListApi()
    treeData.value = data
})

//树形图模糊查询 参考官方文档 树节点过滤 
// 调用 Tree 实例对象的 filter 方法来过滤树节点。 方法的参数就是过滤关键字。 需要注意的是，此时需要设置 filter-node-method 属性，其值为过滤函数。
const treeRef = ref<TreeInstance>()
watch(filterText, (val) => {
    // !非空断言
    treeRef.value!.filter(val)
})
const filterNode = (value: string, data: Tree) => {
    if (!value) return true
    return data.label.includes(value)
}
//计费模版
interface RuleForm {
    date: Array<{ date1: string; date2: string; electricity: string }>,
    name: string,
    service: string,
    parking: string,
    remarks: string
}
const title = ref<string>('')
// ruleFormRef 是表单对象
const ruleFormRef = ref<FormInstance>()
// 表格除了时间区间 剩余几个的表单校验
const rules = reactive<FormRules<RuleForm>>({
    name: [
        { required: true, message: '请输入模板名称', trigger: 'blur' },
    ],
    service: [
        { required: true, message: '请输入服务费', trigger: 'blur' },
    ],
    parking: [
        { required: true, message: '请输入停车费', trigger: 'blur' },
    ],
    remarks: [
        { required: true, message: '请输入备注', trigger: 'blur' },
    ],
})
const ruleForm = ref<RuleForm>({
    date: [{ date1: '', date2: '', electricity: '' }],
    name: '',
    service: "",
    parking: "",
    remarks: ""

})
//表格 添加时间区间
const addTimeSlot = () => {
    ruleForm.value.date.push({ date1: '', date2: '', electricity: '' })
}
// 创建
const submitForm = () => {
    ruleFormRef.value?.validate((valid) => {
        if (valid) {
            console.log(ruleForm)
        }
    })
}

//树状图和右边联动
const handleNodeClick = (data: Tree) => {
    // console.log(data)
    if (!data.children) {
        title.value = data.label
        resetForm()
    }

}
// 重置功能
const resetForm = () => {
    ruleForm.value = {
        date: [{ date1: '', date2: '', electricity: '' }],
        name: '',
        service: "",
        parking: "",
        remarks: ""
    }
}
</script>