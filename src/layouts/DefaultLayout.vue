<template>
    <el-container>
        <el-aside width="200px">
            <!-- 菜单栏 在components下 navMenu文件夹下-->
            <Menu></Menu>
        </el-aside>
        <el-container>
            <!-- 头部相关组件，在components下topheader文件夹下 -->
            <el-header class="elHeader">
                <TopHeader></TopHeader>
            </el-header>
            <el-main>

                <!-- 快捷签页 -->
                <!-- 主体 在views下面各个文件夹里  应该写在快捷签页里面用于切换路由-->
                <TabsLayout></TabsLayout>


            </el-main>
        </el-container>
    </el-container>
</template>


<script setup lang="ts">
import Menu from '@/components/navMenu/Menu.vue'
import TopHeader from '@/components/navMenu/TopHeader/TopHeader.vue';
import TabsLayout from '@/layouts/TabsLayout.vue'

</script>

<style lang="less" scoped>
.el-aside {
    height: 100vh;
    background-color: white;
    box-shadow: 10px 0 8px -2px rgba(0, 0, 0, 0.2);
}

.el-container {
    padding: 0 !important
}

.el-main {
    height: 80vh;
    overflow: auto;
}

.elHeader {
    padding: 0;
}
</style>