<!-- 这个文件是Menu文件里<el-menu>标签内部的内容 -->
<template>
    <el-sub-menu v-if="item.children" :index="'item.url'">
        <template #title>
            <el-icon>
                <!-- item.icon是一个图标字符串.直接  {{ item.icon }} 渲染得到的是字符串而并非组件- ->
                <--一个用于渲染动态组件或元素的“元组件” 要渲染的实际组件由 is决定  Vue3里提供的   -->
                <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
        </template>
        <!-- 这里在进行递归 -->
        <my-menu v-for="child in item.children" :item='child' :key="child.url"></my-menu>
    </el-sub-menu>

    <el-menu-item v-else :index="item.url" @click="add(item.name, item.url, item.icon)" v-show="!(item.name == '订单详情')">
        <el-icon>
            <component :is="item.icon"></component>
        </el-icon>
        <span>{{ item.name }}</span>
    </el-menu-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { MenuItemType } from '@/types/user/index'
import { useTabStore } from '@/store/tabs'
//在vue里进行递归，需要name属性 
export default defineComponent({
    name: 'MyMenu',
    props: {
        item: {
            type: Object as PropType<MenuItemType>,
            required: true
        }
    },
    setup() {
        const tabStore = useTabStore()
        const { addTab, setCurrentTab } = tabStore
        const add = (name: string, url: string, icon: string) => {
            addTab(name, url, icon)
            setCurrentTab(name, url)
        }
        return { add }
    }

})
</script>