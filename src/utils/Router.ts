/*
 * @Author: Undercake
 * @Date: 2023-04-29 15:06:33
 * @LastEditTime: 2023-08-30 11:25:21
 * @FilePath: /ah-admin-react/src/utils/Router.ts
 * @Description: Router 相关
 */
import mittBus from './MittBus';

export const hashChange = (e = null) => {
        mittBus.emit('hashchange', e ?? get());
    }
// if (typeof window !== undefined) {
//     window.addEventListener('hashchange', hashChange);
// }

export const get = ():string => window && window.location.hash.replace('#', '');
export const push = (path: string) => {
    window.location.hash = `#${path}`;
    hashChange();
}
export const onPathChange = (fun:(e:string)=>any = (e:string) => {}) => {
    mittBus.on('hashchange', fun);
}
// @ts-ignore
window.onhashchange = hashChange;
// @ts-ignore
window.addEventListener('hashchange', hashChange);