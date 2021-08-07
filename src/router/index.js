import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/permission/Login";
import Register from "@/views/permission/Register";
import HomeLayout from "@/layout/HomeLayout";
import {ACCESS_TOKEN} from "@/store/mutation-types"
import ls from "@/utils/lsUtil";
import store from '@/store/index'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/register',
        component: Register
    },
    {
        path: '/home',
        component: HomeLayout,
        children: [
            {
                path: '/user',
                component: () => import('@/views/superadmin/user/User')
            },
            {
                path: '/product/type',
                component: () => import('@/views/superadmin/product/ProductType')
            },
            {
                path: '/product/info',
                component: () => import('@/views/superadmin/product/Product')
            },
            {
                path: '/order/info',
                component: () => import('@/views/superadmin/order/OrderInfo')
            },
            {
                path: '/factory',
                component: () => import('@/views/superadmin/factory/FactoryInfo')
            },
            {
                path: '/equipment/info',
                component: () => import('@/views/superadmin/equipment/Equipment')
            },
            {
                path: '/equipment/type',
                component: () => import('@/views/superadmin/equipment/EquipmentType')
            },
            {
                path: '/equipment/me',
                component: () => import('@/views/manager/factory/MyEquipment')
            },
            {
                path: '/order/tender',
                component: () => import('@/views/manager/order/OrderTender')
            },
            {
                path: '/order/plan',
                component: () => import('@/views/manager/order/OrderPlan')
            },
            {
                path: '/order/me',
                component: () => import('@/views/congsinee/order/MyOrder')
            }
        ]
    }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

router.beforeEach((to, from, next) => {
    const token = ls.get_value(ACCESS_TOKEN)
    if (to.path === '/login') {
        if (token) {
            store.commit(ACCESS_TOKEN, token)
            return next('/home')
        } else {
            return next()
        }
    }
    if (to.path === '/register') return next();
    if (!token) return next('/login')
    return next()
})

export default router
