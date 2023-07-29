'use client';

import { ComponentType } from 'react';

interface RouteConfig {
    name: string;
    path: string;
    component: () => Promise<{ default: ComponentType<any> }>;
    children?: RouteConfig[];
}

const routes: RouteConfig[] = [
    {
        name     : '*',
        path     : '*',
        component: () => import(/* webpackChunkName: "any" */ './pages/_404')
    },
    {
        name     : 'Home',
        path     : '/dashboard',
        component: () => import(/* webpackChunkName: "Home" */ './pages/dashboard')
    },
    {
        name     : 'IndexHome',
        path     : '/',
        component: () => import(/* webpackChunkName: "IndexHome" */ './pages/dashboard')
    },
    {
        name     : 'Index',
        path     : '/index',
        component: () => import(/* webpackChunkName: "Index" */ './pages/dashboard')
    },
    // {
    //     name     : 'Login',
    //     path     : '/login',
    //     component: () => import(/* webpackChunkName: "Login" */ './pages/login')
    // },
    {
        name     : 'MyPass',
        path     : '/my_pass',
        component: () => import(/* webpackChunkName: "MyPass" */ './pages/MyPass')
    },
    {
        name     : 'EmployeeList',
        path     : '/employee_list',
        component: () => import(/* webpackChunkName: "EmployeeList" */ './pages/Employee/list')
    },
    {
        name     : 'EmployeeDeleted',
        path     : '/employee_deleted',
        component: () => import(/* webpackChunkName: "EmployeeDeleted" */ './pages/Employee/deleted')
    },
    {
        // 散户
        name     : 'CustomerOther',
        path     : '/customer_other',
        component: () => import(/* webpackChunkName: "CustomerOther" */ './pages/Customer/others')
    },
    {
        // 合同户
        name     : 'CustomerContract',
        path     : '/customer_contract',
        component: () => import(/* webpackChunkName: "CustomerList" */ './pages/Customer/lists')
    },
    {
        // 合同户
        name     : 'CustomerOutdated',
        path     : '/customer_outdated',
        component: () => import(/* webpackChunkName: "CustomerOutdated" */ './pages/Customer/outdated')
    },
    {
        name     : 'CustomerDeleted',
        path     : '/customer_deleted',
        component: () => import(/* webpackChunkName: "CustomerDeleted" */ './pages/Customer/deleted')
    },
    {
        name     : 'AdminList',
        path     : '/admin_list',
        component: () => import(/* webpackChunkName: "AdminList" */ './pages/AdminList')
    },
    {
        name     : 'AdminDeleted',
        path     : '/admin_deleted',
        component: () => import(/* webpackChunkName: "AdminDeleted" */ './pages/AdminDeleted')
    },
];
export default routes;
