'use client';
import { ComponentClass, useEffect, useState, lazy, Suspense, ComponentType } from 'react';
import Routes from 'next-routes';
import { onPathChange, get } from '@/utils/Router';
import routes from '@/routes';

// @ts-ignore
const routeX = Routes();

interface RouteViewProps {
    DefaultComponent?: ComponentType<any>;
}

function RouteView({DefaultComponent = () => <span />}: RouteViewProps) {
    const [hash, setHash]   = useState('');
    const [ready, setReady] = useState(false);

    const handleHashChange = (e: string) => {
        setReady(true);
        setHash(e);
    };

    useEffect(() => {
        routeX.routes = [];
        routes.forEach((route) => routeX.add(route.name, route.path));
        onPathChange(handleHashChange)
        handleHashChange(get());
        // eslint-disable-next-line
    }, []);

    const testRouteX = (path: string): Array<any> | false => {
        for (let i = 0; i < routeX.routes.length; i++) {
            const r = routeX.routes[i];
            if (r.match(path)) {
                return [r, r.match(path)];
            }
        }
        return false;
    };

    const RenderRoute = () => {
        const innerHash = hash.replace('#', '');
        const rs = testRouteX(innerHash == '' ? '/' : innerHash);
        let currentRoute;
        if (!rs) {
            currentRoute = routes.find((route) => route.name == '*');
        }
        else currentRoute = routes.find((route) => route.name === rs[0].name);

        if (currentRoute) {
            let Component: React.FC<any> | ComponentClass;
            Component = lazy(currentRoute.component);
            const props = rs ? { ...rs[1] } : {};
            return <Suspense fallback={<DefaultComponent />}>
                <Component {...props} />
            </Suspense>
        }
        return null;
    };

    return <>{ready ? <RenderRoute /> : <DefaultComponent />}</>;
}

export default RouteView;
