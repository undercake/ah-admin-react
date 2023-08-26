/*
 * @Author: Undercake
 * @Date: 2023-04-29 15:06:33
 * @LastEditTime: 2023-08-25 17:50:31
 * @FilePath: /ah-admin-react-from-next/src/utils/Router.ts
 * @Description: Router 相关
 */
import mittBus from './MittBus';

export const hashChange = (e = null) => {
    console.log('hashchange')
        mittBus.emit('hashchange', e ?? get());
    }
// if (typeof window !== undefined) {
//     window.addEventListener('hashchange', hashChange);
// }

export const get = ():string => window && window.location.hash.replace('#', '');
export const push = (path: string) => {
    window.location.hash = `#${path}`;
    console.log('push', path);
    hashChange();
}
export const onPathChange = (fun:(e:string)=>any = (e:string) => {}) => {
    mittBus.on('hashchange', fun);
}
console.log(mittBus);
// @ts-ignore
window.onhashchange = hashChange;
// @ts-ignore
window.addEventListener('hashchange', hashChange);