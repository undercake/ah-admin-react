/*
 * @Author: Undercake
 * @Date: 2023-05-02 11:16:35
 * @LastEditTime: 2023-05-04 09:49:09
 * @FilePath: /ah-admin-react/src/utils/MittBus.ts
 * @Description: 事件总线
 */
import mitt from 'mitt';
const mittBus = new (mitt as any)();
console.log('mittBus', mittBus);

export default mittBus;