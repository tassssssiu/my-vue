//导航守卫逻辑
//直接把导航守卫文件引入 main.ts 因为全局都需要使用
import router from './index'
import { useUserStore } from '@/store/auth'

router.beforeEach((to) => {
    const userStore = useUserStore()
    const isLogin = userStore.token
    if (!isLogin) {
        //未登录页
        if (to.path !== '/login') {
            return { path: '/login' }
        }
    } else {
        //如果是已经登录了，则不让你返回到登录页
        if (to.path === '/login') {
            return { path: '/' }
        }
        //数组的some方法 some() 方法测试数组中是否至少有一个元素通过了由提供的函数实现的测试。如果在数组中找到一个元素使得提供的函数返回 true，则返回 true；否则返回 false。它不会修改数组。
        //类型断言    使用 as 进行类型断言 这种写法是告诉 TypeScript 你保证 needAuth 是字符串，但不会做运行时检查
        if (to.meta?.needAuth && !userStore.roles.some((role: string) => (to.meta.needAuth as string).includes(role))) {
            return { path: '/' }
        }
    }

})
