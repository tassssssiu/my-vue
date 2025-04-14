// 快签页 的数据存储
import { defineStore } from "pinia";
import { ref } from 'vue'
import type { MenuItemType } from '@/types/user/index'
export const useTabStore = defineStore('tabs', () => {
    //添加快签页
    const tabs = ref<MenuItemType[]>([])
    //定义一个当前高亮
    const currentTab = ref<{ name: string, url: string }>({ name: '数据看板', url: '/dashboard' })

    //点击左边menu可以添加快签页的方法
    const addTab = (name: string, url: string, icon: string) => {
        //判断是否原始快捷签 里面是否包含想要添加的 如果有则不添加
        //在 Vue 3 的 Composition API 里，ref() 返回的是一个响应式对象， ref 的本质是一个对象，其中真正的值存储在 value 属性里。
        if (!tabs.value.some((tab) => tab.url === url)) {
            tabs.value.push({ name, url, icon })
        }
    }
    //改当前高亮
    const setCurrentTab = (name: string, url: string) => {
        //等价于currentTab.value = { name: name, url: url }
        currentTab.value = { name, url }
    }

    //删除数组
    const removeTab = (name: string) => {
        const index = tabs.value.findIndex(item => item.name === name)
        tabs.value = tabs.value.filter(tab => tab.name !== name)
        //如果删除的是高亮的
        if (currentTab.value.name === name) {
            if (tabs.value.length > 0) {
                if (index === 0) {
                    currentTab.value = {
                        name: tabs.value[0].name,
                        url: tabs.value[0].url
                    }
                } else {
                    currentTab.value = {
                        name: tabs.value[index - 1].name,
                        url: tabs.value[index - 1].url
                    }
                }
            } else {
                currentTab.value = { name: '', url: '' }
            }
        }

    }
    return { tabs, addTab, currentTab, setCurrentTab, removeTab }



})