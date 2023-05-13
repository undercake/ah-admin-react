/*
 * @Author: Undercake
 * @Date: 2023-04-27 09:20:55
 * @LastEditTime: 2023-05-04 11:21:26
 * @FilePath: /ah-admin-react/src/components/RouteLink.tsx
 * @Description:
 */
import { ReactElement } from 'react';
import { push } from '@/utils/Router';
function Link({
    to,
    Component = ({children, ...p})=><a {...p}>{children}</a>,
    children
}: {
    to: string;
    name: string;
    Component: React.Component<any> | React.FC<any> | ReactElement ;
    children: ReactElement | Element | HTMLElement | null;
}) {
    return <Component onClick={()=>push(to)}>{children}</Component>;
}

export default Link;
