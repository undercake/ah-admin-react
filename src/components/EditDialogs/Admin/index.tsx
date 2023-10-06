  /*
* @Author      : Undercake
* @Date        : 2023-08-14 17: 27: 03
 * @LastEditTime: 2023-10-06 15:21:14
 * @FilePath: /ah-admin-react/src/components/EditDialogs/Admin/index.tsx
* @Description : 
*/

import { useEffect, useState } from 'react';
import Core, { type types } from '../Core';
import { urls } from '../../../config';
import axios from '../../../utils/Axios';
import mittBus from '../../../utils/MittBus';
import type Admin from '../../../pages/Admin/Admin';
import * as Yup from 'yup';
import { CheckMobile } from '../../../utils/InputCheck';

type Props = {
    handleClose: (a: Event, b: string) => boolean;
    id         : number;
};
type color = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined;

type colors = {
    [key: string]: color;
};
type helperText = {
    [key: string]: string;
};

function AdminEditor({ id, handleClose }: Props) {
    const [options, setOptions] = useState<{ label: string, value: string | number }[]>([]);
    const types: types          = {
        full_name : { type: 'input', required: true, label: '姓名' },
        user_name : { type: 'input', required: true, label: '登录名' },
        mobile    : { type: 'input', required: false, label: '电话' },
        user_group: { type: 'select', required: true, label: '用户组', options },
        email     : { type: 'input', required: false, label: 'Email' }
    }
    const [colors, setColors]         = useState<colors>({});
    const [helperText, setHelperText] = useState<helperText>({});
    const [open, setOpen]             = useState<boolean>(true);
    const [errors, setErrors]         = useState<string[]>([]);
    const [loading, setLoading]       = useState<boolean>(true);
    const [error, setError]           = useState<boolean>(false);
    const [formData, setFormData]     = useState<Admin>({
        full_name : '',
        group_name: '',
        id        : 0,
        mobile    : '',
        user_group: 0,
        user_name : '',
        email     : '',
    });

    useEffect(() => {
        setOpen(true);
        getGrp();
        if (id === 0) {
            setLoading(false);
            return;
        }
        setLoading(true);
        getData();
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const schema = Yup.object().shape({
        full_name: Yup.string().required('姓名为必填'),
        user_name: Yup.string().required('登录名不能为空').matches(/^[a-zA-Z0-9]{2,}$/, '登录名只能为字母和数字组合,长度需大于2位'),
          // @ts-ignore
        mobile: Yup.string().test('mobile', '手机号格式不正确', (val: string) => {
            return new Promise((resolve, reject) => {
                if (val === '') return resolve(true);
                const [checked, message] = CheckMobile(val);
                if (checked) return resolve(true);
                return reject({ message, params: { path: 'mobile' } });
            });
        }),
        user_group: Yup.number().min(1, '管理员角色必填').required('管理员角色只能为整数'),
        email     : Yup.string().email('邮箱格式不正确'),
    });

    const getGrp = () => {
        axios.get(urls.group_list_all)
              // @ts-ignore
            .then((d: { code: number, data: { id: number, name: string }[] }) => {
                if (d.code === 0) {
                    const options = d.data.map(item => ({ label: item.name, value: item.id }));
                    options.unshift({ label: '请选择', value: 0 });
                    setOptions(options);
                }
            })
            .catch(err => {
                setError(true);
                console.log(err);
            })
    }

    const getData = () => {
        setLoading(true);
        setError(false);
        axios.get(`${urls.admin_detail}/id/${id}`)
              // @ts-ignore
            .then((d: { code: number, data: Admin }) => {
                if (d.code === 0) {
                    setFormData(d.data);
                }
            })
            .catch(err => {
                setError(true);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const onClose = (e: Event, reason: string) => {
        if (handleClose(e, reason)) {
            setOpen(false);
        }
    }

    const onOpen = () => {
        setOpen(true);
    }

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const { full_name, user_name, mobile, user_group, email = '' } = formData;
        const url                                                      = `${urls.admin_alter}/id/${id}`;
        console.log({ full_name, user_name, mobile, user_group, email })
        schema
            .validate({ full_name, user_name, mobile, user_group, email })
            .then(() => axios.post(url, { full_name, user_name, mobile, user_group, email }))
              // @ts-ignore
            .then((d: { code: number, rs: number }) => {
                if (d.code === 0) {
                    setOpen(false);
                    handleClose(e, 'submit');
                    mittBus.emit('msgEmit', {
                        type: 'success',
                        msg : '修改成功！'
                    })
                }
            })
            .catch(err => {
                console.log(err);
                if (err.params) {
                    setColors({ [err.params.path]: 'error' });
                    setErrors([err.params.path]);
                    setHelperText({ [err.params.path]: err.message });
                    mittBus.emit('msgEmit', {
                        type: 'warning',
                        msg : err.message
                    });
                }
                if (err.msg === undefined) return;
                const tips = {
                    姓名为必填        : 'full_name',
                    登录名不能为空      : 'user_name',
                    登录名只能为字母和数字组合: 'user_name',
                    管理员角色必填      : 'user_group',
                    管理员角色只能为整数   : 'user_group',
                    邮箱格式不正确      : 'email',
                    手机号格式不正确     : 'mobile'
                };
                  // @ts-ignore
                const tip = tips[err.msg];
                setColors({ [tip]: 'error' });
                setHelperText({ [tip]: err.msg });
                setErrors([tip]);
            })
    }

    const onChange = (val: string | number, name: string) => {
        setFormData({ ...formData, [name]: val });
    }


    return <Core
                    open         = {open}
                    onClose      = {onClose}
                    onOpen       = {onOpen}
                    handleSubmit = {handleSubmit}
                    onChange     = {onChange}
                    colors       = {colors}
                    formData     = {formData}
                    helperText   = {helperText}
                    types        = {types}
                    errors       = {errors}
                    loading      = {loading}
                    error        = {error}
                    refresh      = {getData}
                    refreshText  = '刷新'
                />;
}

export default AdminEditor;