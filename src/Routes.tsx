'use client';
import { HashRouter, Route, Routes, useRoutes, type LazyRouteFunction, type NonIndexRouteObject, type IndexRouteObject } from "react-router-dom";

import { lazy } from 'react';

export interface RouteConfig {
    name: string;
    path: string;
    // Component: lazy(() => Promise<{ default: ComponentType<any> }>;)
    Component: React.LazyExoticComponent<() => JSX.Element>;
    children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
    {
        name: '*',
        path: '*',
        // @ts-ignore
        Component: lazy(() => import(/* webpackChunkName: "_404" */ './pages/_404'))
    },
    {
        name: 'Home',
        path: '/dashboard',
        // @ts-ignore
        Component: lazy(() => import(/* webpackChunkName: "Home" */ './pages/dashboard'))
    },
    // {
    //     name: 'IndexHome',
    //     path: '/',
    //     // @ts-ignore
    //     Component: lazy(() => import(/* webpackChunkName: "IndexHome" */ './pages/dashboard'))
    // },
    {
        name: 'Index',
        path: '/index',
        // @ts-ignore
        Component: lazy(() => import(/* webpackChunkName: "Index" */ './pages/dashboard'))
    },
    // {
    //     name     : 'Login',
    //     path     : '/login',
    //     Component: lazy(() => import(/* webpackChunkName: "Login" */ './pages/login'))
    // },
    {
        name: 'MyPass',
        path: '/my_pass',
        // @ts-ignore
        Component: lazy(() => import(/* webpackChunkName: "MyPass" */ './pages/MyPass'))
    },
    {
        name: 'EmployeeList',
        path: '/employee_list',
        // @ts-ignore
        Component: lazy(() => import(/* webpackChunkName: "EmployeeList" */ './pages/Employee/list'))
    },
    {
        name: 'EmployeeDeleted',
        path: '/employee_deleted',
        // @ts-ignore
        Component: lazy(() => import(/* webpackChunkName: "EmployeeDeleted" */ './pages/Employee/deleted'))
    },
    {
        // 散户
        name: 'CustomerOther',
        path: '/customer_other',
        // @ts-ignore
        Component: lazy(() => import(/* webpackChunkName: "CustomerOther" */ './pages/Customer/others'))
    },
    {
        // 合同户
        name: 'CustomerContract',
        path: '/customer_contract',
        // @ts-ignore
        Component: lazy(() => import(/* webpackChunkName: "CustomerList" */ './pages/Customer/lists'))
    },
    {
        // 过期合同户
        name: 'CustomerOutdated',
        path: '/customer_outdated',
        // @ts-ignore
        Component: lazy(() => import(/* webpackChunkName: "CustomerOutdated" */ './pages/Customer/outdated'))
    },
    {
        name: 'CustomerDeleted',
        path: '/customer_deleted',
        // @ts-ignore
        Component: lazy(() => import(/* webpackChunkName: "CustomerDeleted" */ './pages/Customer/deleted'))
    },
    {
        name: 'AdminList',
        path: '/admin_list',
        // @ts-ignore
        Component: lazy(() => import(/* webpackChunkName: "AdminList" */ './pages/Admin/List'))
    },
    {
        name: 'AdminDeleted',
        path: '/admin_deleted',
        // @ts-ignore
        Component: lazy(() => import(/* webpackChunkName: "AdminDeleted" */ './pages/Admin/Deleted'))
    },
    {
        name: 'AdminGroup',
        path: '/admin_group',
        // @ts-ignore
        Component: lazy(() => import(/* webpackChunkName: "AdminGroup" */ './pages/Admin/Group'))
    },
];

function Routero() {
    return useRoutes(routes);

        // <Route path = '/dashboard' index Component   = {lazy(() => import(/* webpackChunkName: "Home" */ './pages/dashboard'))} />
        // <Route path = '/my_pass' Component           = {lazy(() => import(/* webpackChunkName: "MyPass" */ './pages/MyPass'))} />
        // <Route path = '/employee_list' Component     = {lazy(() => import(/* webpackChunkName: "EmployeeList" */ './pages/Employee/list'))} />
        // <Route path = '/employee_deleted' Component  = {lazy(() => import(/* webpackChunkName: "EmployeeDeleted" */ './pages/Employee/deleted'))} />
        // <Route path = '/customer_other' Component    = {lazy(() => import(/* webpackChunkName: "CustomerOther" */ './pages/Customer/others'))} />
        // <Route path = '/customer_contract' Component = {lazy(() => import(/* webpackChunkName: "CustomerList" */ './pages/Customer/lists'))} />
        // <Route path = '/customer_outdated' Component = {lazy(() => import(/* webpackChunkName: "CustomerOutdated" */ './pages/Customer/outdated'))} />
        // <Route path = '/customer_deleted' Component  = {lazy(() => import(/* webpackChunkName: "CustomerOutdated" */ './pages/Customer/outdated'))} />
        // <Route path = '/admin_list' Component        = {lazy(() => import(/* webpackChunkName: "AdminList" */ './pages/Admin/List'))} />
        // <Route path = '/admin_deleted' Component     = {lazy(() => import(/* webpackChunkName: "AdminDeleted" */ './pages/Admin/Deleted'))} />
        // <Route path = '/admin_group' Component       = {lazy(() => import(/* webpackChunkName: "AdminGroup" */ './pages/Admin/Group'))} />
    return <Routes>
            {routes.map((route, index) => {
                return <Route
                    key={index}
                    path={route.path}
                    // @ts-ignore
                    Component={lazy(route.Component)}
                />;
            })}
        </Routes>;
}

export default Routero;
