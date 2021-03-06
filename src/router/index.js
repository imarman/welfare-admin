import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/401',
    component: () => import('@/views/401'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/teacher',
    component: Layout,
    redirect: '/teacher/list',
    name: 'Teacher',
    meta: { title: '????????????', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'list',
        name: 'TeacherList',
        component: () => import('@/views/teacher/list'),
        meta: { title: '????????????', icon: 'user' }
      },
      {
        path: '/manager-list',
        name: 'ManagerList',
        component: () => import('@/views/manager/list'),
        meta: { title: '???????????????', icon: 'tree' }
      }
    ]
  },
  {
    path: '/campus',
    component: Layout,
    redirect: '/campus/list',
    name: 'Campus',
    meta: { title: '????????????', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'list',
        name: 'CampusList',
        component: () => import('@/views/campus/list'),
        meta: { title: '????????????', icon: 'user' }
      }
    ]
  },
  {
    path: '/welfare',
    component: Layout,
    redirect: '/welfare/list',
    name: 'Welfare',
    meta: { title: '????????????', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'list',
        name: 'WelfareList',
        component: () => import('@/views/welfare/list'),
        meta: { title: '????????????', icon: 'user' }
      },
      {
        path: '/category',
        name: 'Category',
        component: () => import('@/views/welfare/category'),
        // hidden: true,
        meta: { title: '??????????????????', icon: 'tree' }
      }
    ]
  },
  {
    path: '/audit',
    component: Layout,
    redirect: '/audit/list',
    name: 'Audit',
    meta: { title: '????????????', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'list',
        name: 'AuditList',
        component: () => import('@/views/audit/list'),
        meta: { title: '????????????', icon: 'user' }
      }
      // {
      //   path: '/manager-list2',
      //   name: 'ManagerList2',
      //   component: () => import('@/views/campus/list'),
      //   // hidden: true,
      //   meta: { title: '????????????', icon: 'tree' }
      // }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'User',
    meta: { title: '????????????', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'info',
        name: 'UserInfo',
        component: () => import('@/views/user/info'),
        meta: { title: '????????????', icon: 'user' }
      },
      {
        path: '/change',
        name: 'UserPwd',
        component: () => import('@/views/user/pwd'),
        // hidden: true,
        meta: { title: '????????????', icon: 'tree' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
