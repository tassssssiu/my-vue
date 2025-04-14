<!-- 这里是左侧导航栏的整体结构，因为不确定导航栏里层是否还会有导航，因此在这里使用 递归 进行操作 -->
<!-- 是放在 主页面布局 default.layout里面的 -->
<template>
    <div class="logo">
        <img :src="logo" width="34px" height="34px">
        <h1>动力港</h1>
    </div>
    <!-- element 框架里 menu 里router 属性  是否启用 vue-router 模式。 启用该模式会在激活导航时以 index 作为 path 进行路由跳转 使用 default-active 来设置加载时的激活项。 -->
    <!-- default-active	页面加载时默认激活菜单的 index -->
    <!-- ​route：当前路由的信息对象，包含路径、参数、查询等，是响应式的，只读的。 -->
    <!-- router：路由实例，提供导航方法和配置访问，是稳定的，可以在任何组件中访问，用于控制路由行为。 -->
    <el-menu :router="true" :default-active="$route.path">
        <menu-item v-for="item in menuitems" :item='item' :key="item.url"></menu-item>
    </el-menu>
</template>
<script setup lang="ts">
import { useUserStore } from '@/store/auth';
import MenuItem from '@/components/navMenu/MenuItem.vue'
import logo from "@/assets/logo.png"
const userStore = useUserStore()
const menuitems = userStore.menu
</script>
<style scoped lang="less">
.logo {
    display: flex;
    justify-content: center;
    height: 50px;
    align-items: center;
    padding: 10px 0;

    img {
        margin-left: -25px;
    }

    h1 {
        color: #333;
        margin-left: 10px;
        font-size: 22px
    }

    .el-menu {
        border: none;
    }

}
</style>