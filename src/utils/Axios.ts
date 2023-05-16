import axios from 'axios';
import { urls } from '@/config';

import mittBus from './MittBus';

export interface ResponseData {
    code: number;
    message?: string;
    data?: any;
}
export interface resListData<T> extends ResponseData {
    count: number;
    count_per_page: number;
    current_page: number;
    data: T[];
}

// 携带 cookie
axios.defaults.withCredentials = true;
// 请求头，headers 信息
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
// 默认 post 请求，使用 application/json 形式
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 请求拦截器，内部根据返回值，重新组装，统一管理。
axios.interceptors.response.use((res) => {
    console.log('res', res);
    if ('is_login' in res && !res.is_login) {
        mittBus.emit('is_login', false);
        mittBus.emit('msgEmit', {type:'error', msg:'您尚未登陆'});
        return Promise.reject({ msg: '未登录', res });
    }
    if (typeof res.data !== 'object') {
        return Promise.reject({ msg: '服务端异常！', res });
    }
    if ('code' in res.data && res.data.code != 0 && res.config.url != urls.isLogged) {
        if (res.data.message) return Promise.reject({ msg: res.data.message, res });
        if (res.data.code == -2) {
            mittBus.emit('msgEmit', {type:'error', msg:'您尚未登陆'});
            mittBus.emit('is_login', false);
        }
        mittBus.emit('msgEmit', {msg: res.data.message, type: 'error'});
        return Promise.reject({ msg: res.data.message, data: res.data });
    }

    return Promise.resolve(res.data);
});

export default axios;
