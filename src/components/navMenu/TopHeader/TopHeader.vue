<template>
    <div class="header">
        <div class="personal">
            <!-- element组件库的bell icon  el-badge 给消息提示-->
            <el-badge :is-dot="info > 0" class="item">
                <el-icon>
                    <Bell />
                </el-icon>
            </el-badge>
            <!-- 头像 -->
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <!-- 下拉菜单 -->
            <!-- command方法	elmeent DropDown 下拉菜单 当下拉项被点击时触发，参数是从下拉菜单中发送的命令 -->
            <el-dropdown @command="handlecommand">
                <span class="el-dropdown-link">
                    欢迎你，{{ username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <!-- command属性 派发到command回调函数的指令参数 -->
                        <el-dropdown-item icon="User" command="user">个人中心</el-dropdown-item>
                        <el-dropdown-item icon="SwitchButton" command="logout">退出登录</el-dropdown-item>

                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/auth';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
const info = ref(5)
const userStore = useUserStore()
// storetorefs保持响应式
const { username } = storeToRefs(userStore)
const router = useRouter()

const handlecommand = (command: string) => {
    if (command === 'user') {
        router.push('/personal')
    } else {
        userStore.logout()
        //登录信息的数据都是存在于pinia中的，对数据进行修改应该在pinia中进行 故logout函数是写在 store auth.ts里的
        router.push('/login')
    }
}
</script>

<style lang="less" scoped>
.header {
    background-color: white;
    height: 60px;
    align-items: center;
    padding: 0 20px;

    .personal {
        float: right;
        height: 60px;
        display: flex;
        align-items: center;

        .el-dropdown-link {
            margin-left: 20px;
        }

        .item {
            margin-top: 10px;
            margin-right: 20px;
        }
    }
}
</style>