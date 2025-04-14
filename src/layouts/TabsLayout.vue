<template>
    <!-- v-model默认绑定的是高亮的数据 -->
    <el-tabs v-model="currentTab.name" class="demo-tabs" @tab-click="handleClick" type="card" closable
        @tab-remove="remove">
        <el-tab-pane v-for='item in tabs' :key="item.name" :label="item.name" :name="item.name">
            <template #label>
                <span class="custom-tabs-label">
                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span> &nbsp{{ item.name }}</span>
                </span>
            </template>
        </el-tab-pane>
    </el-tabs>
    <!-- <RouterView v-slot="{ Component }">：Vue Router 提供的插槽写法
        <KeepAlive>：Vue 内置的缓存组件机制
            :is="Component"：动态组件渲染
            v-if="$route.meta.KeepAlive"：通过路由元信息控制是否缓存 -->
    <RouterView v-slot="{ Component }">
        <KeepAlive>
            <component :is="Component" :key="$route.name" v-if="$route.meta.KeepAlive"></component>
        </KeepAlive>
        <component :is="Component" :key="$route.name" v-if="!$route.meta.KeepAlive"></component>
    </RouterView>
</template>
<script setup lang="ts">


import { useTabStore } from '@/store/tabs'
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/auth';
const tabStore = useTabStore()
const { tabs, currentTab } = storeToRefs(tabStore)
const { addTab, setCurrentTab, removeTab } = tabStore
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { menu } = storeToRefs(userStore)
//点击左边menu，如何让刷新的时候，快签页也保持在相同的位置。解决方法：先将tabs设置为空。一进页面，渲染相应的在快签页上。即问题转变为，如何获得对应的item渲染在快签页上。这里我们可以通过route.path得到url。问题又转变为 通过url，怎么确定是menu里哪个item（menu保存在pinia中，有所有的item）。item里还有children，故采用递归
function findObjectByUrl(arr: any[], url: string) {
    for (const item of arr) {
        if (item.url === url) {
            return item
        }
        if (item.children) {
            const found: any = findObjectByUrl(item.children, url)
            if (found) {
                return found
            }
        }
    }
    return null
}
// 通过url已经获得对应的item
const { name, url, icon } = findObjectByUrl(menu.value, route.path)
// 渲染item在快签页
addTab(name, url, icon)
// 设置item高亮
setCurrentTab(name, url)

// 这个代码 { index }: { index: number } 其实是 TypeScript 的解构赋值 + 类型注解，它的作用是 从对象中解构 index 属性，并对其添加类型注解。
//tab-click（handlecick）事件里面的对象有index属性 index 代表快捷页签的第几个
const handleClick = ({ index }: { index: number }) => {
    // console.log(index)

    router.push(tabs.value[index].url)
    //这里是为了 点击产生高亮
    setCurrentTab(tabs.value[index].name, tabs.value[index].url)
    //这里进行路由跳转

    // :default-active="$route.path" 为什么点击快签页 左侧menu也可以同时高亮 因为左侧 active设置的是路由路径
    //点击左侧menu 如何实现快签页的高亮 在menuitem里add方法里调用setcurrentTab方法
}
const remove = (TabPaneName: string) => {
    removeTab(TabPaneName)
    router.push(currentTab.value.url)
}
</script>

<style lang="less" scoped></style>