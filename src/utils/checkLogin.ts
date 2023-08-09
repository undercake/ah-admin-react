/*
 * @Author: Undercake
 * @Date: 2023-04-29 08:48:09
 * @LastEditTime: 2023-08-05 17:26:56
 * @FilePath: /ah-admin-react/src/utils/checkLogin.ts
 * @Description: check if login
 */
import { urls } from '@/config';
import axios from './Axios';
import MittBus from '@/utils/MittBus';

interface ICheckLogin {
    (fun: Function | undefined): void;
}

let is_login = false;

const checkLogin: ICheckLogin = (fun: Function | undefined) => {
    axios.get(urls.isLogged).then((res: any) => {
        fun && fun(res.is_login);
    });
};

const heart_beat = ()=>{
    console.log('heart_beat');
    axios.get(urls.heartbeat).then(console.log).catch(console.log);
}

MittBus.on('is_login', (i: boolean) => is_login = i);

checkLogin((e: boolean) => is_login = e);

setInterval(() => {
    is_login && heart_beat();
}, 1440 / 4 * 1000);

export default checkLogin;