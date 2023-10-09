  /*
* @Author      : Undercake
* @Date        : 2023-08-14 17: 27: 03
 * @LastEditTime: 2023-10-09 15:20:39
 * @FilePath: /ah-admin-react/src/components/EditDialogs/Admin/index.tsx
* @Description : 
*/

import { Component } from 'react';
import Core, { type CoreState, type CoreProps, type types } from '../Core';
import { urls } from '../../../config';
import axios from '../../../utils/Axios';
import type Admin from '../../../pages/Admin/Admin';
import * as Yup from 'yup';
import { CheckMobile } from '../../../utils/InputCheck';
import YupSubmitHandler from '../../../utils/SubmitHandler';

interface State extends CoreState<Admin> {
    options: { label: string, value: string | number }[];
}

class AdminEditor extends Component<CoreProps, State> {
    state = {
        formData: {
            id        : 0,
            full_name : '',
            user_name : '',
            mobile    : '',
            user_group: 0,
            email     : '',
        },
        helperText: {},
        colors    : {},
        errors    : [],
        loading   : false,
        error     : false,
        open      : false,
        options   : [],
    };

    componentDidMount = () => {
        this.onOpen();
        this.getData();
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }

    types: types = {
        full_name : { type: 'input', required: true, label: '姓名' },
        user_name : { type: 'input', required: true, label: '登录名' },
        mobile    : { type: 'input', required: false, label: '电话' },
        user_group: { type: 'select', required: true, label: '用户组', options: this.state.options },
        email     : { type: 'input', required: false, label: 'Email' }
    }

    schema = Yup.object().shape({
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

    getData = () => {
        this.setState({ error: false, loading: true });
        axios.get(urls.group_list_all)
              // @ts-ignore
            .then((d: { code: number, data: { id: number, name: string }[] }) => {
                if (d.code === 0) {
                    const options = d.data.map(item => ({ label: item.name, value: item.id }));
                    options.unshift({ label: '请选择', value: 0 });
                    this.setState({ options });
                }
                if (this.props.id > 0)return axios.get(`${urls.admin_detail}/id/${this.props.id}`);
            })
              // @ts-ignore
            .then((d: { code: number, data: Admin }) => {
                if (d.code === 0) {
                    this.setState({ formData: d.data });
                }
            })
            .catch(err => {
                this.setState({ error: true });
                console.log(err);
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    }

    onClose = (e: Event, reason: string) => {
        if (this.props.handleClose(e, reason)) {
            this.setState({ open: false });
        }
    }

    onOpen = () => {
        this.setState({ open: true });
    }

    handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const { full_name, user_name, mobile, user_group, email = '' } = this.state.formData;
        YupSubmitHandler({
            schema  : this.schema,
            url     : this.props.id === 0 ? urls.admin_add               : `${urls.admin_alter}/id/${this.props.id}`,
            data    : { full_name, user_name, mobile, user_group, email },
            setState: this.setState.bind(this),
            tips    : {
                姓名为必填        : 'full_name',
                登录名不能为空      : 'user_name',
                登录名只能为字母和数字组合: 'user_name',
                管理员角色必填      : 'user_group',
                管理员角色只能为整数   : 'user_group',
                邮箱格式不正确      : 'email',
                手机号格式不正确     : 'mobile'
            },
            onSuccess: d => {
                this.setState({ open: false });
                this.props.handleClose(e, 'submit');
            }
        });
    }

    onChange = (val: string | number, name: string) => {
        this.setState({ formData: { ...this.state.formData, [name]: val } });
    }


    render() {
        return <Core
            open         = {this.state.open}
            onClose      = {this.onClose}
            onOpen       = {this.onOpen}
            handleSubmit = {this.handleSubmit}
            onChange     = {this.onChange}
            colors       = {this.state.colors}
            formData     = {this.state.formData}
            helperText   = {this.state.helperText}
            types        = {this.types}
            errors       = {this.state.errors}
            loading      = {this.state.loading}
            error        = {this.state.error}
            refresh      = {this.getData}
            refreshText  = '刷新'
        />;
    }
}

export default AdminEditor;