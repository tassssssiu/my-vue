//z这里是最基本的创建路由
//vue-router 类型是 RouteRecordRaw
//注意是createWebHistory 而不是官网上的createMemoryHistory
// 如果是前端单页应用(SPA)，并且有服务器支持 → createWebHistory()
// 如果是 SSR / WebView / Electron / 单元测试 → createMemoryHistory()
// 如果是纯静态网页(没有后端支持)，推荐 createWebHashHistory()，因为它不会导致刷新 404。
import { createWebHistory, createRouter } from 'vue-router'
import routes from './basicRouteMap'

//RouteRecordRaw表示单个路由对象 而RouteRecordRaw[]则表示多个路由对象的数组，即整个应用的路由表


const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router