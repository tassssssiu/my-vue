//这里写整个路由跳转表
//RouteRecordRaw表示单个路由对象 而RouteRecordRaw[]则表示多个路由对象的数组，即整个应用的路由表
import type { RouteRecordRaw } from 'vue-router'
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/layouts/DefaultLayout.vue'),
        //重定向 默认加载在dashbord页面
        redirect: '/dashboard',
        children: [{
            path: '/dashboard',
            name: 'dashboard',
            component: () => import("@/views/dashboard/DashBoard.vue")

        }, {
            path: '/chargingstation/monitor',
            name: 'monitor',
            component: () => import("@/views/chargingstation/Monitor.vue")
        },
        {
            path: '/chargingstation/revenue',
            name: 'revenue',
            component: () => import("@/views/chargingstation/Revenue.vue")
        },
        {
            path: 'chargingstation/fault',
            name: 'fault',
            component: () => import("@/views/chargingstation/Fault.vue")
        },
        {
            path: '/map',
            name: 'map',
            component: () => import("@/views/map/ElectronicMap.vue")
        },
        {
            path: 'operations/orders',
            name: 'orders',
            component: () => import("@/views/operations/Orders.vue"),
            meta: {
                // keep-alive可以缓存组件状态，让切换回来时组件保留原样。
                KeepAlive: true
            }
        },
        {
            path: '/operations/detail',
            name: 'detail',
            component: () => import("@/views/operations/Detail.vue")
        },
        {
            path: 'operations/total',
            name: 'total',
            component: () => import("@/views/operations/Total.vue")
        },
        {
            path: '/alarm',
            name: 'alarm',
            component: () => import("@/views/alarm/Alarm.vue")
        },
        {
            path: '/equipment',
            name: 'equipment',
            component: () => import("@/views/equipment/Equipment.vue")
        },
        {
            path: '/document',
            name: 'document',
            component: () => import("@/views/document/Document.vue"),
            // meta 附加在记录上的任意数据。
            meta: {
                needAuth: ['admin', 'manager']
            }
        },
        {
            path: '/system',
            name: 'system',
            component: () => import("@/views/system/System.vue"),
            meta: {
                needAuth: ['admin']
            }
        },
        {
            path: '/personal',
            name: 'personal',
            component: () => import("@/views/personal/Personal.vue")
        },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login.vue')
    },
    {
        //:pathMatch 是 Vue Router 动态路由参数，用于匹配 URL。
        //    (.*)* 是正则表达式：
        // (.*) 匹配所有路径，无论是否带有子路径（如 / abc 或 / foo / bar）。
        // * 允许匹配多个段，确保 / not / found / page 也能正确跳转到 404 页面。
        path: '/:pathMatch(.*)',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue')

    }
]
export default routes

