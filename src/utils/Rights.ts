import axios from './Axios';
import { urls } from '@/config'; // 导入接口网址列表
import { localSet, localGet } from './index';

interface req_data {
    code: 0 | -1 | -2 | -3;
    message?: string;
    rs?: number | string;
}

// !权限相关
export interface right {
    detail  : string;
    icon    : string;
    id      : number;
    name    : string;
    parent  : number;
    path    : string;
    sort    : number;
    type    : 0 | 1 | 2 | 3 | 4;
    children: Array<right>;
}

interface rights extends req_data {
    rights: right[];
}

interface group {
    path: string;
    name: string;
}
let groups: group[]           = [];
let timer: 0 | NodeJS.Timeout = 0;
let gur_arr: Function[]       = [];
let user_rights: right[]      = [];
let all_rights: right[]       = [];

const getRights = (): void => {
    groups = [
        { path: '/index', name: '主页' },
        { path: '/my_pass', name: '修改我的信息' }
    ];
    all_rights.forEach((e) => {
        if (!e) return;
        const { path, name } = e;
        groups.push({ path, name });
    });
};

const initRights = (e = 0): void => {
    if (groups.length > 1 && e === 0) return;
    if (all_rights.length < 1) return getUserRights(getRights);
    getRights();
};

const getUserRights = (fun: Function = () => {}) => {
    gur_arr.push(fun);
    timer === 0 &&
        (timer = setTimeout(
            () =>
                axios
                    .get(urls.getUserSideMenu)
                    .then(
                        // @ts-ignore
                        (data: rights) => {
                            user_rights = [];
                            all_rights = [];
                            data.rights.forEach((r) => (all_rights[r.id] = { ...r }));
                            all_rights.forEach((r) => r.parent == 0 && (user_rights[r.id] = { ...r }));
                            all_rights.forEach((r) => r.parent != 0 && user_rights[r.parent] && user_rights[r.parent].children.push({ ...r }));
                            for (let n = 0; n < user_rights.length; n++) {
                                user_rights[n] && user_rights[n].children.sort((a, b) => a.sort - b.sort);
                            }
                            user_rights.sort((a, b) => a.sort - b.sort);
                            clearTimeout(timer);
                            timer = 0;
                            initRights(1);
                            gur_arr.forEach((f) => f(user_rights));
                            gur_arr = [];
                        }
                    )
                    .catch((e: any) => {
                        clearTimeout(timer);
                        timer = 0;
                    }),
            1000
        ));
};

const returnList = (data: right[]) => {
    if (data == undefined || data.length < 1) return [];
    data = data
        .filter((e) => e)
        .map((e) => {
            const { children } = e;
            return {
                ...e,
                children: children.length > 0 ? children.filter((c) => c.type == 0) : []
            };
        });
        data.push({
            path: '/my_pass',
            name: '修改我的信息',
            children: [],
            icon: 'fa-solid fa-wrench',
            type: 0,
            id: 0,
            parent: 0,
            sort: 9999,
            detail: ''
        },
        { path: '/index', name: '主页', children: [], icon: 'fa-solid fa-house', type: 0, id: 0, parent: 0, sort: 0, detail: '' })
        data.sort((a, b) => a.sort - b.sort);
        return data;
};

export const getLists = (fun: Function = () => {}, force: boolean = false) => {
    if (user_rights.length < 1 || force)
        getUserRights((d: right[]) => {
            fun(returnList(d));
        });
    else fun(returnList(user_rights));
};

export const hasRights = (p: string) => {
    groups.length < 1 && initRights();
    let $rtn = false;
    for (const k in groups) {
        if (groups[k].path == p) {
            $rtn = true;
            break;
        }
    }
    return $rtn;
};

export const getRouteName = (p: string): string => {
    groups.length < 1 && initRights();
    let $rtn = '阿惠家政管理后台';
    for (const k in groups) {
        if (groups[k].path == p) {
            $rtn = groups[k].name;
            break;
        }
    }
    return $rtn;
};
