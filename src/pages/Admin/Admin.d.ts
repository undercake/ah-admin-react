  /*
 * @Author      : Undercake
 * @Date        : 2023-10-04 15: 05: 54
 * @LastEditTime: 2023-10-09 15:25:28
 * @FilePath: /ah-admin-react/src/pages/Admin/Admin.d.ts
 * @Description : 
 */

import { number } from 'yup';

export default interface Admin {
    full_name : string;
    id        : number;
    mobile    : string;
    user_group: number;
    user_name : string;
    email     : string;
}

export interface Group {
    id            : number;
    rights        : string;
    name          : string;
    group_describe: string;
}

export interface Right {
    id    : number;
    parent: number;
    type  : 0 | 1;
    path  : string;
    name  : string;
    icon  : string;
    detail: string;
    sort  : numbe;
}
