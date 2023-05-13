import axios from 'axios';
import { urls } from '@/config';

import mittBus from './MittBus';

export interface ResponseData {
    code: number;
    message?: string;
    data?: any;
}

// 携带 cookie，对目前的项目没有什么作用，因为我们是 token 鉴权
axios.defaults.withCredentials = true;
// 请求头，headers 信息
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
// 默认 post 请求，使用 application/json 形式
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 请求拦截器，内部根据返回值，重新组装，统一管理。
axios.interceptors.response.use((res) => {
    if (typeof res.data !== 'object') {
        return Promise.reject({ msg: '服务端异常！', res });
    }
    if ('code' in res.data && res.data.code != 0 && res.config.url != urls.isLogged) {
        if (res.data.message) return Promise.reject({ msg: res.data.message, res });
        if (res.data.code == -2) {
            mittBus.emit('is_login', false);
        }
        return Promise.reject({ msg: res.data.message, data: res.data });
    }

    return Promise.resolve(res.data);
});

export default axios;
