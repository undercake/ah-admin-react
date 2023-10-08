import Core, { type types, type CoreState } from '../../../components/EditDialogs/Core';
import { pinyin } from "pinyin-pro";
import { Component } from 'react';
import { urls } from '../../../config';
import axios from '../../../utils/Axios';
import type Employee from '../../../pages/Employee/Employee.d';
import mittBus from '../../../utils/MittBus';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { CheckMobile, CheckIDCode } from '../../../utils/InputCheck';
import YupSubmitHandler from '../../../utils/SubmitHandler';

type Props = {
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
            DelFlag     : 0,
        },
        colors: {
        },
        helperText: {
        },
        errors: []
    };

    updatePym = (input: string) => this.setState({
        formData: 
        {
            ...this.state.formData,
            pym: pinyin(input, { mode: "surname", pattern: "first", toneType: "none", nonZh: "removed", v: true }).replaceAll(" ", "")
        }
    });

    updateBirthday = (input: string) => {
        if (input.length !== 18) return;
        const formData = { ...this.state.formData, IDCode: input, Birthday: this.convertTime(input, input) };
        this.setState({ formData });
    }

    types: types = {
        ItemCode    : { type: 'input', required: false, label: '编号' },
        FullName    : { type: 'input', required: true, label: '姓名', related: [this.updatePym] },
        pym         : { type: 'input', required: true, label: '拼音码' },
        Tel         : { type: 'input', required: true, label: '电话' },
        HomeTel     : { type: 'input', required: false, label: '家庭电话' },
        WarrantorTel: { type: 'input', required: false, label: '担保人电话' },
        Sex         : { type: 'select', required: false, label: '性别', options: [{ label: '男', value: '男' }, { label: '女', value: '女' }] },
        IDCode      : { type: 'input', required: false, label: '身份证号', related: [this.updateBirthday] },
        Address     : { type: 'input', required: false, label: '地址' },
        Birthday    : { type: 'date', required: false, label: '出生日期' },
        Workday     : { type: 'date', required: false, label: '参工日期' },
        ItemLevel   : { type: 'input', required: false, label: '员工等级' },
        Department  : { type: 'input', required: false, label: '所在部门' },
        Comment     : { type: 'textfield', required: false, label: '说明' },
        BlameRecord : { type: 'input', required: false, label: '过失记录' },
    }

    testParams: (value: string, path: string, fun: (v: string) => any, msg?: string) => Promise<boolean>
    =          (value: string, path: string, fun: (v: string) => any, msg = '')      => {
            return new Promise((resolve, reject) => {
                if (value === '') return resolve(true);
                const rs = fun(value);
                if (rs[0]) return resolve(true);
                else return reject({ message: `${msg}${rs[1]}`, params: { path } });
            })
        }

    schema = Yup.object().shape({
        FullName   : Yup.string().required('用户名不能为空'),
        pym        : Yup.string().required('拼音码不能为空').max(10, '拼音码过长'),
        ItemCode   : Yup.string().max(30, '编号过长'),
        Address    : Yup.string().max(60, '地址过长'),
        ItemLevel  : Yup.string().max(30, '员工等级过长'),
        BlameRecord: Yup.string().max(30, '过失记录过长'),
        Department : Yup.string().max(60, '所在部门过长'),
        Comment    : Yup.string().max(250, '说明过长'),
        Sex        : Yup.string().oneOf(['男', '女'], '性别只能为男或女'),
        Tel        : Yup.string().test('Tel', '格式不正确', (value, testContext) => {
            return this.testParams(value as string, 'Tel', CheckMobile, '电话');
        }),
        HomeTel: Yup.string().test('HomeTel', '格式不正确', (value, testContext) => {
            return this.testParams(value as string, 'HomeTel', CheckMobile, '家庭电话');
        }),
        WarrantorTel: Yup.string().test('WarrantorTel', '格式不正确', (value, testContext) => {
            console.log({ value, testContext });
            return this.testParams(value as string, 'WarrantorTel', CheckMobile, '担保人电话');
        }),
        IDCode: Yup.string().test('IDCode', '格式不正确', (value, testContext) => {
            console.log({ value, testContext });
            return this.testParams(value as string, 'IDCode', CheckIDCode, '身份证号');
        }),
    });

    componentDidMount(): void {
        setTimeout(() => {
            this.setState({ open: true });
        }, 10);
        this.props.id > 0 && axios.get(`${urls.employee_detail}/id/${this.props.id}`).then((res) => {
            console.log(res);
              // @ts-ignore
            this.setState({
                formData: {
                    ...res.data,
                    Workday : this.convertTime(res.data.Workday.trim()),
                    Birthday: this.convertTime(res.data.Birthday.trim(), res.data.IDCode, res.data.CreateDate),
                }
            });
        });
    }

    convertTime = (time: string, idCode: string = '', createDate = '') => {
        if (idCode !== '') {
            let birthDay = idCode.slice(6, 14);
                birthDay = `${birthDay.slice(0, 4)}-${birthDay.slice(4, 6)}-${birthDay.slice(6, 8)}`;
            return birthDay;
        }
        time.replaceAll('.', '-');
        dayjs.extend(require('dayjs/plugin/objectSupport'));
        const date                             = dayjs(createDate.split(' ')[0]);
        if    (time.match(/^\d{4}$/)) time     = `${time}-1-1`;
        if    (time.match(/\d{4}-\d{2}/)) time = `${time}-1`;
        if (time.match(/(^\d{2}$)/) || time.match(/(^\d{2}岁$)/)) {
              // @ts-ignore
            const timeObj = date.subtract(parseInt(time), 'year').toObject();
                  time    = `${timeObj.years}-${timeObj.months}-${timeObj.date}`;
        }
        return time;
    }

    onOpen = () => console.log('open');

    onClose = (e: Event, reason: string) => {
        const is_close = this.props.handleClose(e, reason);
        is_close && this.setState({ open: false })
    }

    handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const url = `${urls.employee_alter}/id/${this.props.id}`;
        const {
            ItemCode,
            FullName,
            pym,
            Tel,
            HomeTel,
            WarrantorTel,
            Sex,
            IDCode,
            Address,
            Birthday,
            Workday,
            ItemLevel,
            Department,
            Comment,
            BlameRecord
        } = this.state.formData;
        YupSubmitHandler({
            schema  : this.schema,
            setState: this.setState,
            url,
            data: {
                ItemCode,
                FullName,
                pym,
                Tel,
                HomeTel,
                WarrantorTel,
                Sex,
                IDCode,
                Address,
                Birthday,
                Workday,
                ItemLevel,
                Department,
                Comment,
                BlameRecord
            },
            tips: {
                姓名不能为空     : 'FullName',
                姓名长度不正确    : 'FullName',
                地址长度过长     : 'Address',
                电话格式不正确    : 'Tel',
                担保人电话格式不正确 : 'WarrantorTel',
                家庭电话格式不正确  : 'HomeTel',
                出生日期长度过长   : 'Birthday',
                参工日期长度过长   : 'Workday',
                过失记录长度过长   : 'BlameRecord',
                说明长度过长     : 'Comment',
                拼音码必填      : 'pym',
                拼音码不能包含其他字符: 'pym',
                拼音码过长      : 'pym',
                身份证格式不正确   : 'IDCode',
                编号过长       : 'ItemCode',
                员工等级过长     : 'ItemLevel'
            },
            onSuccess: d => {
                this.setState({ open: false });
                this.props.handleClose(e, 'submit');
                mittBus.emit('msgEmit', {
                    type: 'success',
                    msg : '修改成功！'
                })
            }
        });
    }

    onChange = (val: string | number, name: string) => {
        const formData = { ...this.state.formData, [name]: val };
          // @ts-ignore
        this.setState({ formData, colors: {}, helperText: {}, errors: [] });
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