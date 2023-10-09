import axios from 'axios';
import { urls } from '../config';

import mittBus from './MittBus';

export interface ResponseData {
    code: number;
    message?: string;
    data?: any;
}

export interface resData<T = any> {
    code: number;
    message?: string;
    data: T;
}
export interface resListData<T = any> extends ResponseData {
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
axios.interceptors.response.use(
    (res) => {
        let data = res;
        if (('status' in res) && ('statusText' in res)) data = res.data;

        if (typeof data !== 'object') {
            mittBus.emit('msgEmit', { type: 'error', msg: '服务端异常！' });
            return Promise.reject({ msg: '服务端异常！', data, res: res  });
        }

        if ('is_login' in data && !data.is_login) {
            mittBus.emit('is_login', false);
            mittBus.emit('msgEmit', { type: 'error', msg: '您尚未登陆' });
            return Promise.reject({ msg: '未登录', data, res: res  });
        }
        if ('code' in data && data.code !== 0 && ('config' in res && res.config.url !== urls.isLogged)) {
            mittBus.emit('msgEmit', { msg: res.data.message, type: 'error' });
            // @ts-ignore
            if (data.message) return Promise.reject({ msg: data.message, res });
            if (data.code === -2) {
                mittBus.emit('msgEmit', { type: 'error', msg: '您尚未登陆' });
                mittBus.emit('is_login', false);
            }
            return Promise.reject({ msg: res.data.message, data: res.data, res: res });
        }

        return Promise.resolve(data);
    },
    (error, ...e) => {
        // 处理失败响应
        let msg = '';
        if (error.response?.status === 404) {
            // 处理 404 错误
            msg = '页面未找到'
        } else if (error.code === 'ECONNABORTED') {
            // 处理超时错误
            msg = '请求超时，请重试'
        } else if (error.response?.status === 500) {
            // 处理 500 错误
            msg = '服务器错误，请稍后重试'
        } else if (error.response?.status === 503) {
            // 处理 503 错误
            msg = '服务器错误，请稍后重试'
        } else {
            // 其他错误
            msg = '网络错误，请稍后重试'
        }
        mittBus.emit('msgEmit', { type: 'error', msg });
        return Promise.reject({error, e});
    }
);

export default axios;