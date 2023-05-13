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
        name: '*',
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
    {
        name     : 'Login',
        path     : '/login',
        component: () => import(/* webpackChunkName: "Login" */ './pages/login')
    },
    {
        name     : 'MyPass',
        path     : '/my_pass',
        component: () => import(/* webpackChunkName: "MyPass" */ './pages/my_pass')
    },
];
export default routes;
