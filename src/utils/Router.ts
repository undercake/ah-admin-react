/*
 * @Author: Undercake
 * @Date: 2023-04-29 15:06:33
 * @LastEditTime: 2023-05-14 02:53:09
 * @FilePath: /ah-admin-react/src/utils/Router.ts
 * @Description: Router 相关
 */
import mittBus from './MittBus';

window && window.addEventListener('hashchange', () => {
    mittBus.emit('hashchange', get());
});

export const get = ():string => window && window.location.hash.replace('#', '');
export const push = (path: string) => (window && (window.location.hash = `#${path}`));
export const onPathChange = (fun:(e:string)=>any = (e:string) => {}) => {
    mittBus.on('hashchange', fun);
}