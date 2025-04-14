// 用户登录 pinia数据存储和处理文件
import { defineStore } from "pinia";
import { loginApi } from "@/api/user";


interface LoginParams {
    username: string;
    password: string
}


export const useUserStore = defineStore('user', {
    state: () => ({
        //刷新的时候pinia数据丢失，从本地存储中进行取值，不刷新的时候会从pinia值中取值  即pinia中从pinia中进行取值 没有从本地存储中进行取值
        token: sessionStorage.getItem('token') || '',
        //非空断言 告诉Typescript 一定不是null或者undefine
        roles: sessionStorage.getItem('roles') ? JSON.parse(sessionStorage.getItem('roles')!) : [],
        username: sessionStorage.getItem('username') || '',
        menu: sessionStorage.getItem('menu') ? JSON.parse(sessionStorage.getItem('menu')!) : []
    }),
    actions: {
        async login(data: LoginParams) {
            // async login(data: LoginParams, router: any) {
            try {
                const { data: { token, user: { username, roles }, menulist } } = await loginApi(data)
                this.token = token
                this.roles = roles
                this.username = username
                this.menu = menulist
                //sessionStorage仅在当前对话中使用，关闭浏览器和标签页即清除
                //为什么数据存在本地后还需要存在pinia 因为一本地的数据不是响应式的 二是存在pinia需要更少的性能
                sessionStorage.setItem('token', token)
                sessionStorage.setItem('roles', JSON.stringify(roles))
                sessionStorage.setItem('username', username)
                sessionStorage.setItem('menu', JSON.stringify(menulist))
                //编程时导航进行登录判断跳转用的方法
                // router.push('/')
            }
            catch (error) {
                console.log("登录失败:", error);
                // 这里可以处理错误，比如显示提示信息
            }
        },
        //退出登录的逻辑
        logout() {
            this.token = ''
            this.roles = ''
            this.username = ''
            this.menu = ''
            sessionStorage.clear()
        }
    }
})


