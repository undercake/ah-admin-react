'use client';
import React, { ComponentClass, ReactElement, useEffect, useState } from 'react';
import Routes from 'next-routes';
import { onPathChange, get } from '@/utils/Router';

// @ts-ignore
const routeX = Routes();

interface RouteConfig {
    name: string;
    path: string;
    component: Function;
    children?: RouteConfig[];
}

interface RouteViewProps {
    config: RouteConfig[];
    defaultComponent?: React.Component<any> | React.FC<any> | ReactElement | Element | HTMLElement | null;
}

function RouteView(props: RouteViewProps) {
    const [hash, setHash] = useState('');
    const [ready, setReady] = useState(false);

    const { config, defaultComponent = null } = props;

    const handleHashChange = (e:string) => {
        setReady(true);
        setHash(e);
    };

    useEffect(() => {
        config.forEach((route) => routeX.add(route.name, route.path));
        onPathChange(handleHashChange)
        handleHashChange(get());
        // eslint-disable-next-line
    }, []);

    const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        const href = event.currentTarget.getAttribute('href');
        if (href) {
            window.location.hash = href;
            setHash(href);
        }
    };

    const testRouteX = (path: string): Array<any> | false => {
        for (let i = 0; i < routeX.routes.length; i++) {
            const r = routeX.routes[i];
            if (r.match(path)) {
                return [r, r.match(path)];
            }
        }
        return false;
    };

    const renderRoute = () => {
        const innerHash = hash.replace('#', '');
        const rs = testRouteX(innerHash == '' ? '/' : innerHash);
        let currentRoute;
        if (!rs) {
            currentRoute = config.find((route) => route.name == '*');
        }
        else currentRoute = config.find((route) => route.name === rs[0].name);

        if (currentRoute) {
            const Component: React.FC<any> | ComponentClass = currentRoute.component().default;
            const props = rs ? {...rs[1]} : {};
            return <Component { ...props } />;
        }
        return null;
    };

    return <>{ready ? renderRoute() : defaultComponent}</>;
}

export default RouteView;
