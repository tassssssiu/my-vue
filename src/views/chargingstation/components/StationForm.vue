<template>
    <!-- element dialog对话框 -->

    <!-- <el-dialog v-model="dialogVisible"> -->
    <!-- 等价于： -->
    <!-- <el-dialog :model-value="dialogVisible" @update:modelValue="dialogVisible = $event"> -->
    <!--这里@close 是控制 点击 框的x号时弹窗的打开关闭 -->
    <!-- destroy-on-close当关闭 Dialog 时，销毁其中的元素 -->
    <el-dialog :model-value="dialogVisible" :title="title" @close="handleCancel" destroy-on-close>
        <span>
            <!-- label-width标签的长度，例如 '50px'。 作为 Form 直接子元素的 form-item 会继承该值。 可以使用 auto -->
            <el-form label-width="120" :rules="rules" :model="ruleForm" ref="formRef">
                <el-row>
                    <el-col :span="12">
                        <!-- Form 组件提供了表单验证的功能，只需为 rules 属性传入约定的验证规则，并将 form-Item 的 prop 属性设置为需要验证的特殊键值即可。  -->
                        <el-form-item label="站点名称：" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="站点id：" prop="id">
                            <el-input v-model="ruleForm.id" :disabled="disabled"></el-input>
                        </el-form-item>
                        <el-form-item label="所属城市：" prop="city">
                            <el-input v-model="ruleForm.city"></el-input>
                        </el-form-item>
                        <el-form-item label="站点负责人：" prop="person">
                            <el-input v-model="ruleForm.person"></el-input>
                        </el-form-item>
                        <el-form-item label="负责人电话：" prop="tel">
                            <el-input v-model="ruleForm.tel"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="快充数：" prop="fast">
                            <el-input v-model="ruleForm.fast"></el-input>
                        </el-form-item>
                        <el-form-item label="慢充数：" prop="slow">
                            <el-input v-model="ruleForm.slow"></el-input>
                        </el-form-item>
                        <el-form-item label="充电站状态：" prop="status">
                            <el-select placeholder="充电站状态" v-model="ruleForm.status" :disabled="disabled">
                                <el-option label="全部" :value="1"></el-option>
                                <el-option label="使用中" :value="2"></el-option>
                                <el-option label="空闲中" :value="3"></el-option>
                                <el-option label="维护中" :value="4"></el-option>
                                <el-option label="待维修" :value="5"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="正在充电：" prop="now">
                            <el-input v-model="ruleForm.now" :disabled="disabled"></el-input>
                        </el-form-item>
                        <el-form-item label="故障数：" prop="fault">
                            <el-input v-model="ruleForm.fault" :disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleConfirm">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { RowType } from '@/types/station/index'
import { useStationStore } from '@/store/station'
import { storeToRefs } from 'pinia'
import { EditApi } from '@/api/chargingstation'
import { ElMessage } from 'element-plus'
const props = defineProps({
    dialogVisible: {
        type: Boolean,
        required: true
    }
})
const emit = defineEmits(['close', 'reload'])
const ruleForm = ref<RowType>({
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
const rules = reactive<FormRules<RowType>>({
    name: [
        { required: true, message: '站点名称不能为空', trigger: 'blur' },
    ],
    id: [
        { required: true, message: '站点id不能为空', trigger: 'blur' },
    ],
    city: [
        { required: true, message: '所属城市不能为空', trigger: 'blur' },
    ],
    person: [
        { required: true, message: '站点负责人不能为空', trigger: 'blur' },
    ],
    tel: [
        { required: true, message: '负责人电话不能为空', trigger: 'blur' },
    ],
    fast: [
        { required: true, message: '快充数不能为空', trigger: 'blur' },
    ],
    slow: [
        { required: true, message: '慢充数不能为空', trigger: 'blur' },
    ],
    status: [
        { required: true, message: '充电站状态不能为空', trigger: 'blur' },
    ],
    now: [
        { required: true, message: '正在充电数不能为空', trigger: 'blur' },
    ],
    fault: [
        { required: true, message: '故障数量不能为空', trigger: 'blur' },
    ]
})
const stationStore = useStationStore()
const { rowData } = storeToRefs(stationStore)
const disabled = ref<boolean>(false)
const title = ref<string>('')

// 监听父组件传进来的 dialogVisible 的值变化（比如打开/关闭对话框）
// 当 dialogVisible 变化时，执行这个回调
// 将 rowData 中的数据赋值给 ruleForm，通常用于 表单回显
watch(() => props.dialogVisible, () => {
    // 看pinia中是否有值，有值即为编辑
    if (rowData.value.name) {
        disabled.value = true
        title.value = '编辑充电站信息'
    } else {
        title.value = '新增充电站信息'
        disabled.value = false
    }
    ruleForm.value = rowData.value
})
const handleCancel = () => {
    emit('close')
}
const formRef = ref<FormInstance>()
const handleConfirm = () => {
    formRef.value?.validate(async (valid: boolean) => {
        if (valid) {
            const res = await EditApi(ruleForm.value)
            if (res.code === 200) {
                ElMessage({
                    message: res.data,
                    type: 'success',
                })
                handleCancel()
                emit('reload')
            }
        }
    })
}
</script>