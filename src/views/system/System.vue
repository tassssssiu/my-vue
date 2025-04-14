<!-- 系统设置页面只能管理员权限才能看到 -->
<template>
    <el-card>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-input v-model="searchParams.name" placeholder="请输入姓名">
                </el-input>
            </el-col>
            <el-col :span="6">
                <el-select placeholder="请选择部门" v-model="searchParams.department">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="总裁办" value="总裁办"></el-option>
                    <el-option label="技术部" value="技术部"></el-option>
                    <el-option label="市场部" value="市场部"></el-option>
                    <el-option label="维修部" value="维修部"></el-option>
                    <el-option label="运营部" value="运营部"></el-option>
                    <el-option label="客服部" value="客服部"></el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <el-button type="primary" @click="loadData">查询</el-button>
                <el-button>重置</el-button>
            </el-col>
        </el-row>
    </el-card>
    <el-card class="mt">
        <el-table :data="dataList" v-loading="loading" class="mt">
            <el-table-column type="index" label="序号" width="80" />
            <el-table-column prop="account" label="账号"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="phone" label="电话"></el-table-column>
            <el-table-column prop="idNo" label="身份证号"></el-table-column>
            <el-table-column prop="position" label="职位">
                <template #default="scope">
                    <el-tag>{{ scope.row.position }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="department" label="部门"></el-table-column>
            <el-table-column prop="pageAuthority" label="页面权限">
                <template #default="scope">
                    <el-tag type="success">{{ scope.row.pageAuthority }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="btnAuthority" label="按钮权限">
                <template #default="scope">
                    <el-tag type="info">{{ scope.row.btnAuthority }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="opera" label="操作" width="280">
                <template #default="scope">
                    <el-button type="primary" size="small"
                        @click="settingAuth(scope.row.pageAuthority, scope.row.account)">
                        权限设置
                    </el-button>
                    <el-button type="danger" size="small">
                        删除
                    </el-button>
                    <el-button type="danger" size="small">
                        禁用
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="fr mt mb" v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.pageSize"
            :page-sizes="[10, 20, 30, 40]" :background="true" layout="total, sizes, prev, pager, next, jumper"
            :total="totals" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>
    <AuthModal :visible="visible" :checked-keys="checkedKeys" @close="visible = false" :btn-auth="btnAuth"
        :acount="accountNo" @reload="loadData"></AuthModal>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useHttp } from '@/hooks/useHttp'
import AuthModal from './AuthModal.vue'
import { getAuthApi } from '@/api/system'
import type { MenuItemType } from '@/types/user';

const searchParams = ref({
    name: "",
    department: ""
})
const { dataList, loading, loadData, totals, pageInfo, handleSizeChange, handleCurrentChange } = useHttp("/permissionList", searchParams);

const visible = ref<boolean>(false)

// 权限设置
// list数据 不是setCheckedKeys（AuthModal）所需要的一维数组 进行转变
//这个函数使用了闭包   闭包 = 函数 + 外部变量的引用
function collectUrls(tree: MenuItemType[]) {
    // 新建一个最后需要的urls
    const urls: string[] = []
    // 进行递归 node:每一项数据 eg：数据看板
    function traverse(node: MenuItemType) {
        if (node.url && !node.children) {
            urls.push(node.url)
        }
        // 如果有children，对children进行forEach循环
        if (node.children) {
            node.children.forEach((child: MenuItemType) => traverse(child))
        }
    }
    // 对整个数组的每一项数据foreach循环    菜单项有6条 
    tree.forEach((item: MenuItemType) => traverse(item))
    return urls
}
//选中项的
const checkedKeys = ref<string[]>([])
const btnAuth = ref<string[]>([])
const accountNo = ref<string>('')
// 通过api调用获得当前页面权限， 父子传值 传到AUTHModal中  根据不用权限动态获取勾选
const settingAuth = async (pageAuthority: string, account: string) => {
    const { data: { list, btn } } = await getAuthApi(pageAuthority)
    checkedKeys.value = collectUrls(list)
    btnAuth.value = btn
    accountNo.value = account
    visible.value = true

}




</script>