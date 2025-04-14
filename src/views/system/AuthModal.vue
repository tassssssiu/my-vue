<!-- 权限弹窗组件 -->

<template>
    <!-- 显示隐藏由父组件决定，因此写 model-value 而不是v-model -->
    <el-dialog title="权限设置" width="600px" :model-value="visible" @open="handleOpen" @close="handleClose">
        <el-card>
            <template #header>
                <div class="caard-header">
                    <span>页面权限</span>
                </div>
            </template>
            <el-tree style="max-width: 600px;" show-checkbox :data="treeData" ref="treeRef" node-key="url"></el-tree>
        </el-card>
        <!-- 按钮级权限 -->
        <el-card class="mt">
            <template #header>
                <div class="card-header">
                    <span>按钮权限</span>
                </div>
            </template>

            <el-checkbox-group v-model="initBtnAuth" class="mt">
                <el-checkbox label="全部" value="all" />
                <el-checkbox label="添加" value="add" />
                <el-checkbox label="编辑" value="edit" />
                <el-checkbox label="删除" value="delete" />
            </el-checkbox-group>
        </el-card>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="$emit('close')">取消</el-button>
                <el-button type="primary" @click="handleConfirm">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>



</template>

<script setup lang="ts">
import { useUserStore } from '@/store/auth'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { transformMenu } from '@/utils/transformMenu'
import { setAuthApi } from '@/api/system'
import { ElMessage } from 'element-plus'


const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    },
    checkedKeys: {
        type: Array,
        required: true
    },
    btnAuth: {
        type: Array,
        required: true
    },
    acount: {
        type: String,
        required: true
    }
})
const userStore = useUserStore()
const { menu } = storeToRefs(userStore)
// treeData数据格式要求 label表示数据名称，children表示子节点
const treeData = ref(transformMenu(menu.value))

//动态设置勾选
// setCheckedKeys tree方法设置目前选中的节点，使用此方法必须设置 node - key 属性(keys, leafOnly) 接收两个参数: 1. 一个需要被选中的多节点 key 的数组 (key使用的是url，在utils transformMenu中)（一维数组，不存在层级嵌套的关系,即如果有children 需要的是children里对象 的url，找最小的url）2. 布尔类型的值 如果设置为 true，将只设置选中的叶子节点状态。 默认值是 false

// 获取元素
const treeRef = ref()

const handleOpen = () => {
    // console.log(props.checkedKeys)
    treeRef.value.setCheckedKeys(props.checkedKeys)
    initBtnAuth.value = props.btnAuth
}
const emit = defineEmits(['close', 'reload'])
const handleClose = () => {
    emit("close")
}
//按钮级权限
const initBtnAuth = ref<any[]>([])

//提交按钮
const handleConfirm = async () => {
    // getCheckedKeys 若节点可用被选中 (show-checkbox 为 true), 它将返回当前选中节点 key 的数组
    // checkedKeys是最初权限的，重新点击修改后的应该通过getCheckedKeys获得
    // console.log(treeRef.value.getCheckedKeys(true))
    const res = await setAuthApi(props.acount, treeRef.value.getCheckedKeys(true), initBtnAuth.value)
    if (res.code == 200) {
        ElMessage({
            message: res.message,
            type: 'success',
        });
    }
    emit("close") //关闭弹窗
    emit("reload")
}
</script>