/*
 * @Author: Undercake
 * @Date: 2023-04-29 08:48:09
 * @LastEditTime: 2023-08-30 11:26:43
 * @FilePath: /ah-admin-react/src/utils/checkLogin.ts
 * @Description: check if login
 */
import { urls } from '../config';
import axios from './Axios';
import MittBus from '../utils/MittBus';

interface ICheckLogin {
    (fun: Function | undefined): void;
}

let is_login = false;

const checkLogin: ICheckLogin = (fun = ()=>{}) => {
    axios
    .get(urls.isLogged)
    .then((res: any) => fun(res.is_login))
    .catch((err: any) => fun(false));
};

const heart_beat = ()=>{
    // @ts-ignore
    axios.get(urls.heartbeat).then((d:{message:string;last_sync: string;})=>{
        MittBus.emit('lastSync', d.last_sync);
        // TODO: 完善提示
    }).catch(console.log);
}
// @ts-ignore
window.heart_beat = heart_beat;
MittBus.on('is_login', (i: boolean) => is_login = i);

checkLogin((e: boolean) => is_login = e);

setInterval(() => {
    is_login && heart_beat();
}, 1440 / 4 * 1000);

export default checkLogin;