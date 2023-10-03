import Core from '../../../components/EditDialogs/Core';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormInput from '../../../components/FormComponents/FormInput';
import FormSelect from '../../../components/FormComponents/Select';
import DatePicker from '../../../components/FormComponents/DatePicker';
import { pinyin } from "pinyin-pro";
import { Component, FormEventHandler } from 'react';
import { urls } from '../../../config';
import axios from '../../../utils/Axios';

interface Employee {
    id         : number;
    avatar     : string;                                 // 头像
    name       : string;                                 // 姓名
    gender     : 0 | 1;                                  // 性别
    phone      : string;                                 // 电话
    birth_date : string;                                 // 生日
    intro      : string;                                 // 简介
    note       : string;                                 // 备注
    address    : string;                                 // 地址
    create_time: string;                                 // 创建时间
    deleted    : number;                                 // 是否删除
    grade      : 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;  // 学历等级
    id_code    : string;                                 // 身份证号
    img        : string;                                 // 简介图片
    origin     : string;                                 // 籍贯
    pinyin     : string;                                 // 拼音
    pym        : string;                                 // 拼音码
    work_date  : string;                                 // 工作时间
    workee     : string;                                 // 工作单位
    wx_id      : number;                                 // 微信id
}

type colors = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined;
  // @flow
type Props = {
    handleClose: any;
    id         : number;
};

interface types {
    [key: string]: {
        type     : 'input' | 'select' | 'date' | 'datetime' | 'time' | 'image' | 'avatar' | 'textfield';
        required : boolean;
        label    : string;
        options ?: { label: string, value: string | number }[];
        related ?: ((v: string) => void)[];
    };
}

interface State {
    open    : boolean;
    formData: Employee;
    colors  : {
        name   : colors;
        phone  : colors;
        id_code: colors;
        address: colors;
        intro  : colors;
        note   : colors;
    };
    helperText: {
        name   : string;
        phone  : string;
        id_code: string;
        address: string;
        intro  : string;
        note   : string;
    };
};

export class EmployeeEditor extends Component<Props, State>{
    state = {
        open    : false,
        formData: {
            id         : 0,
            avatar     : '',
            name       : '',
            id_code    : '',
            address    : '',
            intro      : '',
            note       : '',
            phone      : '',
            gender     : 0 as 0 | 1,
            birth_date : '',
            create_time: '',
            deleted    : 0,
            grade      : 0 as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
            img        : '',
            origin     : '',
            pinyin     : '',
            pym        : '',
            work_date  : '',
            workee     : '',
            wx_id      : 0,
        },
        colors: {
            name   : 'primary' as colors,
            phone  : 'primary' as colors,
            id_code: 'primary' as colors,
            address: 'primary' as colors,
            intro  : 'primary' as colors,
            note   : 'primary' as colors,
        },
        helperText: {
            name   : '',
            phone  : '',
            id_code: '',
            address: '',
            intro  : '',
            note   : '',
        },
    };

    updatePinyin = (input: string) => this.setState({ formData: { ...this.state.formData, pinyin: pinyin(input, { mode: "surname", toneType: "none", nonZh: "removed", v: true }).replaceAll(" ", "") } });
    updatePym    = (input: string) => this.setState({ formData: { ...this.state.formData, pym: pinyin(input, { mode: "surname", pattern: "first", toneType: "none", nonZh: "removed", v: true }).replaceAll(" ", "") } });

    types: types = {
        avatar    : { type: 'avatar', required: false, label: '头像' },
        name      : { type: 'input', required: true, label: '姓名', related: [this.updatePinyin, this.updatePym] },
        phone     : { type: 'input', required: true, label: '电话' },
        gender    : { type: 'select', required: false, options: [{ label: '男', value: 0 }, { label: '女', value: 1 }], label: '性别' },
        id_code   : { type: 'input', required: true, label: '身份证号' },
        address   : { type: 'input', required: false, label: '地址' },
        birth_date: { type: 'date', required: false, label: '出生日期' },
        work_date : { type: 'date', required: false, label: '工作时间' },
        img       : { type: 'image', required: false, label: '简介图片' },
        grade     : { type: 'select', required: false, label: '学历', options: [{ value: 0, label: '未知' }, { value: 1, label: '小学' }, { value: 2, label: '初中' }, { value: 3, label: '高中' }, { value: 4, label: '中专' }, { value: 5, label: '技校' }, { value: 6, label: '大专' }, { value: 7, label: '本科' }, { value: 8, label: '硕士' }, { value: 9, label: '博士' }] },
        note      : { type: 'input', required: false, label: '备注' },
        origin    : { type: 'input', required: false, label: '籍贯' },
        pinyin    : { type: 'input', required: false, label: '拼音' },
        pym       : { type: 'input', required: false, label: '拼音码' },
        intro     : { type: 'textfield', required: false, label: '简介' },
    }

    componentDidMount(): void {
        setTimeout(() => {
            this.setState({ open: true });
        }, 10);
        this.props.id > 0 && axios.get(`${urls.employee_detail}/id/${this.props.id}`).then((res) => {
              // @ts-ignore
            this.setState({ formData: res.detail });
        });
    }


    onOpen = () => console.log('open');

    onClose = (e: Event, reason: string) => {
        const is_close = this.props.handleClose(e, reason);
        is_close && this.setState({ open: false })  //(false);
    }

    handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
    }

    onChange = (val: string | number, name: string) => {
        const formData = { ...this.state.formData, [name]: val };
          // @ts-ignore
        this.setState({ formData });
    }

    render() {
        const { colors, formData, helperText } = this.state;
        return (
            <Core
                open    = {this.state.open}
                onClose = {this.onClose}
                onOpen  = {this.onOpen}
                handleSubmit={this.handleSubmit}
                onChange={this.onChange}
                colors={colors}
                formData={formData}
                helperText={helperText}
                types={this.types}
            />
        );
    };
};

export default EmployeeEditor;