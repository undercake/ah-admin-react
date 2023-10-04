import Core, { type types, type CoreState } from '../../../components/EditDialogs/Core';
import { pinyin } from "pinyin-pro";
import { Component } from 'react';
import { urls } from '../../../config';
import axios from '../../../utils/Axios';
import type Employee from '../../../pages/Employee/Employee.d';
import mittBus from '../../../utils/MittBus';


type colors = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined;
type Props  = {
    handleClose: (a: Event, b: string) => boolean;
    id         : number;
};


interface State extends CoreState {
    formData: Employee;
};

export class EmployeeEditor extends Component<Props, State>{
    state = {
        open    : false,
        formData: {
            id          : 0,
            EmployeeOID : '',
            ItemCode    : '',   // 编号
            FullName    : '',   // 姓名
            Sex         : '',
            Tel         : '',
            Birthday    : '',
            Comment     : '',   // 说明
            Workday     : '',   //参工日期
            Department  : '',
            Address     : '',
            IDCode      : '',
            HomeTel     : '',
            WarrantorTel: '',
            ItemLevel   : '',   //员工等级
            BlameRecord : '',   // 过失记录
            pym         : '',
        },
        colors: {
        },
        helperText: {
        },
        errors: []
    };

    updatePym = (input: string) => this.setState({ formData: { ...this.state.formData, pym: pinyin(input, { mode: "surname", pattern: "first", toneType: "none", nonZh: "removed", v: true }).replaceAll(" ", "") } });

    types: types = {
        ItemCode    : { type: 'input', required: false, label: '编号' },
        FullName    : { type: 'input', required: true, label: '姓名', related: [this.updatePym] },
        pym         : { type: 'input', required: false, label: '拼音码' },
        Tel         : { type: 'input', required: true, label: '电话' },
        HomeTel     : { type: 'input', required: false, label: '家庭电话' },
        WarrantorTel: { type: 'input', required: false, label: '担保人电话' },
        Sex         : { type: 'select', required: false, label: '性别', options: [{ label: '男', value: '男' }, { label: '女', value: '女' }] },
        IDCode      : { type: 'input', required: true, label: '身份证号' },
        Address     : { type: 'input', required: false, label: '地址' },
        Birthday    : { type: 'input', required: false, label: '出生日期' },
        Workday     : { type: 'input', required: false, label: '参工日期' },
        ItemLevel   : { type: 'input', required: false, label: '员工等级' },
        Department  : { type: 'input', required: false, label: '所在部门' },
        Comment     : { type: 'textfield', required: false, label: '说明' },
    }

    componentDidMount(): void {
        setTimeout(() => {
            this.setState({ open: true });
        }, 10);
        this.props.id > 0 && axios.get(`${urls.employee_detail}/id/${this.props.id}`).then((res) => {
            console.log(res);
              // @ts-ignore
            this.setState({ formData: res.data });
        });
    }


    onOpen = () => console.log('open');

    onClose = (e: Event, reason: string) => {
        const is_close = this.props.handleClose(e, reason);
        is_close && this.setState({ open: false })  //(false);
    }

    handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const url = `${urls.employee_alter}/id/${this.props.id}`;
        axios.post(url, {
            ...this.state.formData
        })
              // @ts-ignore
            .then((d: { code: number, rs: number }) => {
                if (d.code === 0) {
                    this.setState({ open: false });
                    this.props.handleClose(e, 'submit');
                    mittBus.emit('msgEmit', {
                        type: 'success',
                        msg : '修改成功！'
                    })
                }
            })
            .catch(err => {
                if (err.msg === undefined) return;
                const tips = {
                    姓名不能为空: 'FullName',
                    姓名长度不正确: 'FullName',
                    地址长度过长: 'Address',
                    电话格式不正确: 'Tel',
                    担保人电话格式不正确: 'WarrantorTel',
                    家庭电话格式不正确: 'HomeTel',
                    出生日期长度过长: 'Birthday',
                    参工日期长度过长: 'Workday',
                    过失记录长度过长: 'BlameRecord',
                    说明长度过长: 'Comment',
                    拼音码必填: 'pym',
                    拼音码不能包含其他字符: 'pym',
                    拼音码过长: 'pym',
                    身份证格式不正确: 'IDCode',
                    编号过长: 'ItemCode',
                    员工等级过长: 'ItemLevel'
                };
                // @ts-ignore
                const tip = tips[err.msg];
                this.setState({
                    colors    : { [tip]: 'error' },
                    helperText: { [tip]: err.msg },
                    errors    : [tip]
                });
            })
    }

    onChange = (val: string | number, name: string) => {
        const formData = { ...this.state.formData, [name]: val };
          // @ts-ignore
        this.setState({ formData });
    }

    render() {
        const { colors, formData, helperText, errors } = this.state;
        return (
            <Core
                open         = {this.state.open}
                onClose      = {this.onClose}
                onOpen       = {this.onOpen}
                handleSubmit = {this.handleSubmit}
                onChange     = {this.onChange}
                colors       = {colors}
                formData     = {formData}
                helperText   = {helperText}
                types        = {this.types}
                errors       = {errors}
            />
        );
    };
};

export default EmployeeEditor;