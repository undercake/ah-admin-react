import Core from '../../../components/EditDialogs/Core';
import { pinyin } from "pinyin-pro";
import { Component } from 'react';
import { urls } from '../../../config';
import axios from '../../../utils/Axios';
import type Employee from '../../../pages/Employee/Employee.d';


type colors = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined;
type Props = {
    handleClose: (a:Event, b:string)=>boolean;
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

    updatePym    = (input: string) => this.setState({ formData: { ...this.state.formData, pym: pinyin(input, { mode: "surname", pattern: "first", toneType: "none", nonZh: "removed", v: true }).replaceAll(" ", "") } });

    types: types = {
        FullName  : { type: 'input', required: true, label: '姓名', related: [this.updatePym] },
        Tel       : { type: 'input', required: true, label: '电话' },
        Sex       : { type: 'select', required: false, label: '性别', options:[{ label: '男', value: '男' }, { label: '女', value: '女' }] },
        IDCode    : { type: 'input', required: true, label: '身份证号' },
        Address   : { type: 'input', required: false, label: '地址' },
        Birthday  : { type: 'input', required: false, label: '出生日期' },
        Workday   : { type: 'input', required: false, label: '参工日期' },
        ItemLevel : { type: 'input', required: false, label: '员工等级' },
        Department: { type: 'input', required: false, label: '所在部门' },
        pym       : { type: 'input', required: false, label: '拼音码' },
        Comment   : { type: 'textfield', required: false, label: '说明' },
    }

    componentDidMount(): void {
        console.log('EmployeeEditor');
        setTimeout(() => {
            this.setState({ open: true });
        }, 10);
        this.props.id > 0 && axios.get(`${urls.employee_detail}/id/${this.props.id}`).then((res) => {
            console.log(res);
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
        console.log(e);
    }

    onChange = (val: string | number, name: string) => {
        const formData = { ...this.state.formData, [name]: val };
        console.log(formData, name, val);
          // @ts-ignore
        this.setState({ formData });
        console.log(this.state.formData);
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