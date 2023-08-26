/*
 * @Author: Undercake
 * @Date: 2023-04-29 08:48:09
 * @LastEditTime: 2023-08-26 15:19:51
 * @FilePath: /ah-admin-react-from-next/src/utils/checkLogin.ts
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
    console.log('heart_beat');
    // @ts-ignore
    axios.get(urls.heartbeat).then((d:{message:string;last_sync: string;})=>{
        console.log('heart_beat', d);
        MittBus.emit('lastSync', d.last_sync);
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