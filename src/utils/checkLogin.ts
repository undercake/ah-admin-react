/*
 * @Author: Undercake
 * @Date: 2023-04-29 08:48:09
 * @LastEditTime: 2023-05-02 10:50:23
 * @FilePath: /ah-admin-react/src/utils/checkLogin.ts
 * @Description: check if login
 */
import { urls } from '../config';
import axios from './Axios';

interface ICheckLogin {
    (fun: Function | undefined): void;
}

const checkLogin: ICheckLogin = (fun: Function | undefined) => {
    axios.get(urls.isLogged).then((res: any) => {
        fun && fun(res.is_login);
    });
};

export default checkLogin;
