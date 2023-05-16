/*
 * @Author: Undercake
 * @Date: 2023-05-02 11:16:35
 * @LastEditTime: 2023-05-14 02:55:49
 * @FilePath: /ah-admin-react/src/utils/MittBus.ts
 * @Description: 事件总线
 */
import mitt from 'mitt';
const mittBus = new (mitt as any)();

export default mittBus;