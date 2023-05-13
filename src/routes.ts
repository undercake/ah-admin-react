"use client";

interface RouteConfig {
    name: string;
    path: string;
    component: Function;
    children?: RouteConfig[];
}

const routes: RouteConfig[] = [
    {
        name: '*',
        path: '*',
        component: () => require('./pages/_404')
    },
    {
        name: 'indexHome',
        path: '/',
        component: () => require('./pages/dashboard')
    },
    {
        name: 'index',
        path: '/index',
        component: () => require('./pages/dashboard')
    },
    {
        name: 'login',
        path: '/login',
        component: () => require('./pages/login')
    },
    {
        name: 'Home',
        path: '/dashboard',
        component: () => require('./pages/dashboard')
    }
];
export default routes;
