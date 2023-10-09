import { Component } from 'react';
import * as Yup from 'yup';
import Core, { type CoreState, type CoreProps} from '../../../components/EditDialogs/Core';
import { urls } from '../../../config';
import axios from '../../../utils/Axios';
import type Customer from '../../../pages/Customer/Customer.d';
import { telOrMobile } from "../../../utils/InputCheck";
import YupSubmitHandler from '../../../utils/SubmitHandler';

interface types {
    [key: string]: {
        type     : 'input' | 'number' | 'select' | 'date' | 'datetime' | 'time' | 'image' | 'avatar' | 'textfield';
        required : boolean;
        label    : string;
        options ?: { label: string, value: string | number }[];
        related ?: ((v: string) => void)[];
    };
}

export class CustomerEditor extends Component<CoreProps, CoreState<Customer>>{
    state = {
        open    : false,
        formData: {
            id               : 0,
            ClientInfoOID    : '',
            Address          : '',
            BeginDate        : '',
            BlackFlag        : 0 as 0 | 1,
            CreateDate       : '',
            DelFlag          : 0,
            EndDate          : '',
            F1               : 0 as 0 | 1 | 2,                       // 0普通 1VIP 2重要领导
            FullName         : '',
            HouseArea        : 0,
            ItemCode         : '',
            LastModiDate     : '',
            NormalServiceTime: '',
            SpecialNeed      : '',
            Tel1             : '',
            Tel2             : '',
            Tel3             : '',
            TotalCount       : 0,
            TotalMoney       : '',
            UserType         : 0 as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,   //7半月卡6月卡5季卡4年卡3包做2包周1钟点0暂无
            fRegion          : '',
            pym              : '',
        },
        colors    : {},
        helperText: {},
        errors    : [],
        loading   : false,
        error     : false,
    };

    types: types = {
        FullName         : { type: 'input', required: true, label: '姓名' },
        Tel1             : { type: 'input', required: true, label: '电话1' },
        Tel2             : { type: 'input', required: false, label: '电话2' },
        Tel3             : { type: 'input', required: false, label: '电话3' },
        F1               : { type: 'select', required: true, label: '重要程度', options: [{ label: '普通', value: 0 },{ label: 'VIP', value: 1 },{ label: '重要领导', value: 2 }] },
        HouseArea        : { type: 'number', required: false, label: '房屋面积' },
        Address          : { type: 'input', required: true, label: '地址' },
        NormalServiceTime: { type: 'input', required: false, label: '一般服务时间' },
        SpecialNeed      : { type: 'input', required: false, label: '特殊要求' },
        fRegion          : { type: 'input', required: false, label: '区域' },
    }

    componentDidMount(): void {
        this.onOpen();
        this.getData();
    }

    testParams: (value: string, path: string, fun:(v:string)=>any, msg?: string) => Promise<boolean>
    =          (value: string, path: string, fun:(v:string)=>any, msg = '')      => {
        return new Promise((resolve, reject) => {
                if(value === '') return resolve(true);
                const rs = fun(value);
                if (rs[0]) return resolve(true);
                else return reject({message: `${msg}${rs[1]}`, params: {path}});
            })
    }

    schema = Yup.object().shape({
        FullName: Yup.string().required('姓名不能为空'),
        Tel1    : Yup.string().required('电话1不能为空').test('Tel1', '格式错误', (v:string) => this.testParams(v, 'Tel1', telOrMobile, '电话1')),
            // @ts-ignore
        Tel2: Yup.string().test('Tel2', '格式错误', (v:string) => this.testParams(v, 'Tel2', telOrMobile, '电话2')),
            // @ts-ignore
        Tel3             : Yup.string().test('Tel3', '格式错误', (v:string) => this.testParams(v, 'Tel3', telOrMobile, '电话3')),
        HouseArea        : Yup.number().min(0, '房屋面积不能小于0'),
        F1               : Yup.number().required('重要程度不能为空').min(0, '重要程度选择错误').max(2, '重要程度选择错误'),
        Address          : Yup.string().required('地址不能为空').max(100, '地址不能超过100个字符'),
        NormalServiceTime: Yup.string().max(20, '一般服务时间不能超过20个字符'),
        SpecialNeed      : Yup.string().max(30, '特殊要求不能超过30个字符'),
        fRegion          : Yup.string().max(20, '区域不能超过20个字符')
    })

    getData = () => {
        this.setState({ error: false });
        if (this.props.id === 0) return;
        this.setState({ loading: true });
        axios.get(`${urls.customer_detail}/id/${this.props.id}`)
            .then((res) => {
                      // @ts-ignore
                this.setState({ formData: res.data });
                this.setState({ loading: false, error: false });
            })
            .catch((err) => {
                this.setState({ loading: false, error: true });
                console.error(err);
            });
    }

    onOpen = () => setTimeout(() => {
        this.setState({ open: true });
    }, 10);

    onClose = (e: Event, reason: string) => {
        const is_close = this.props.handleClose(e, reason);
        is_close && this.setState({ open: false });
    }

    handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const {FullName, Tel1, Tel2, Tel3, F1, Address, NormalServiceTime, SpecialNeed, fRegion, HouseArea} = this.state.formData;
        YupSubmitHandler({
            schema   : this.schema,
            setState : this.setState.bind(this),
            url      : this.props.id === 0 ? urls.customer_add : `${urls.customer_alter}/id/${this.props.id}`,
            data     : {FullName, Tel1, Tel2, Tel3, F1, Address, NormalServiceTime, SpecialNeed, fRegion, HouseArea},
            tips     : {
                姓名不能为空: 'FullName',
                '姓名只能为汉字、字母、数字和下划线_及破折号': 'FullName',
                姓名长度过长: 'FullName',
                电话1不能为空: 'Tel1',
                电话1格式不正确: 'Tel1',
                电话2格式不正确: 'Tel2',
                电话3格式不正确: 'Tel3',
                地址不能为空: 'Address',
                地址长度过长: 'Address',
                区域长度过长: 'fRegion',
                用户类型不能为空: 'UserType',
                用户类型格式不正确: 'UserType',
                重要程度不能为空: 'F1',
                重要程度格式不正确: 'F1',
                房屋面积必须为整数: 'HouseArea',
                服务时间长度过长: 'NormalServiceTime',
                特殊需求长度过长: 'SpecialNeed',
            },
            onSuccess: d => {
                    this.setState({ open: false });
                    this.props.handleClose(e, 'submit');
                }
            });
        }

    onChange = (val: string | number, name: string) => {
        const formData = { ...this.state.formData, [name]: val };
        this.setState({ formData, colors: {}, helperText: {}, errors: [] });
    }

    render() {
        return (
            <Core
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
                error        = {this.state.error}
                loading      = {this.state.loading}
            />
        );
    };
};

export default CustomerEditor;