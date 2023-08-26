'use client';
import { ComponentClass, useEffect, useState, lazy, Suspense, ComponentType } from 'react';
// import Routes from 'next-routes';
import { onPathChange, get } from '../utils/Router';
import { routes, type RouteConfig } from '../Routes';

const routeX:RouteConfig[] = [];

interface RouteViewProps {
    DefaultComponent?: ComponentType<any>;
}

function RouteView({DefaultComponent = () => <span />}: RouteViewProps) {
    const [hash, setHash]   = useState('');
    const [ready, setReady] = useState(false);

    const handleHashChange = (e: string) => {
        setReady(false);
        console.log({e});
        setTimeout(() => setReady(true), 300);
        setHash(e);
    };

    useEffect(() => {
        onPathChange(handleHashChange)
        handleHashChange(get());
        // eslint-disable-next-line
    }, []);

    const testRouteX = (path: string): RouteConfig | false => {
        for (let i = 0; i < routeX.length; i++) {
            const r = routes[i].path === path;
            if (r) return routes[i];
        }
        return false;
    };

    const RenderRoute = () => {
        const innerHash = hash.replace('#', '');
        const rs = testRouteX(innerHash === '' ? '/' : innerHash);
        let currentRoute;
        if (!rs) {
            currentRoute = routes.find((route) => route.name === '*');
        }
        else currentRoute = routes.find((route) => route.name === rs/*[0]*/.name);

        if (currentRoute) {
            let Component: React.FC<any> | ComponentClass;
            // @ts-ignore
            Component = currentRoute.component;
            const props = /*rs ? { ...rs[1] } :*/ {};
            return <Component {...props} />
        }
        return null;
    };

    return <>{ready ? <RenderRoute /> : <DefaultComponent />}</>;
}

export default RouteView;


/*
1.营业执照副本 照片
2.证明公司规模的文件 简介、照片等
3.政务、政府  资质、证明、荣誉 图片  分章节
阿惠家政 胡锦涛 等领导接见的照片
4.大客户的服务证明，特别是政府类的
6.红色家政的资质证明， 云南省唯一红色家政， 相关图片等； 
董事长荣誉

*/