"use client"
/*
 * @Author: Undercake
 * @Date: 2023-04-29 15:06:33
 * @LastEditTime: 2023-08-19 14:26:52
 * @FilePath: /ah-admin-react/src/utils/Router.ts
 * @Description: Router 相关
 */
import mittBus from './MittBus';

export const hashChange = () => {
        mittBus.emit('hashchange', get());
    }

// if (typeof window !== undefined) {
//     window.addEventListener('hashchange', hashChange);
// }

export const get = ():string => window && window.location.hash.replace('#', '');
export const push = (path: string) => (window && (window.location.hash = `#${path}`));
export const onPathChange = (fun:(e:string)=>any = (e:string) => {}) => {
    mittBus.on('hashchange', fun);
}