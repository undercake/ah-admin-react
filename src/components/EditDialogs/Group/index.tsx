// @flow
import { type ChangeEvent, Component } from 'react';
import { type Group, type Right } from '../../../pages/Admin/Admin.d';
import Core, { type CoreProps, type CoreState, type types } from '../Core';
import * as Yup from 'yup';
import axios from '../../../utils/Axios';
import { urls } from '../../../config';
import Card from '../../Card';
import Typography  from '@mui/material/Typography';
import Switch from '@mui/material/Switch';

interface Rights extends Right {
    children: Right[];
}

interface State extends CoreState<Group> {
    rights: Rights[];
    selectedRights: number[];
}

export default class Grp extends Component<CoreProps, State>{
    state:State = {
        open    : false,
        formData: {
            id            : 0,
            rights        : '',
            name          : '',
            group_describe: '',
        },
        helperText    : {},
        colors        : {},
        errors        : [],
        loading       : false,
        error         : false,
        rights        : [],
        selectedRights: []
    };

    types: types = {
        name          : { type: 'input', required: true, label: '组名' },
        group_describe: { type: 'textfield', required: false, label: '描述' },
    }

    schema = Yup.object().shape({
        name: Yup.string().required('组名为必填'),
        group_describe: Yup.string().max(400, '描述需少于400字'),
    });

    componentDidMount(): void {
        this.setOpen();
        this.getData();
    }

    setOpen = () => this.setState({ open: true});

    onClose = (e: Event, reason: string) => {
        const is_close = this.props.handleClose(e, reason);
        is_close && this.setState({ open: false })
    }

    handleSubmit = (w: SubmitEvent) => {
        w.preventDefault();
        console.log(this.state.formData);
    }

    onChange = (val: string | number, name: string) => {
        const formData = { ...this.state.formData, [name]: val };
          // @ts-ignore
        this.setState({ formData, colors: {}, helperText: {}, errors: [] });
    }

    processRights = (data: Right[]) => {
        const rights: Rights[] = [];
        data.forEach((r: Right) => {
            if (r.parent === 0) {
                rights.push({ ...r, children: [] });
            }
        });
        data.forEach((r: Right) => {
            if (r.parent !== 0) {
                rights.forEach((rr: Rights) => {
                    if (rr.id === r.parent) {
                        rr.children.push(r);
                    }
                });
            }
        });
        console.log({ rights });
        this.setState({ rights });
    }

    getData = () => {
        this.setState({ loading: true, error: false });
        // @ts-ignore
        axios.get(urls.rights_list).then((res: {code: number, data: Right[]}) => {
            res.code === 0 && this.processRights(res.data);
            if (this.props.id > 0 ) return axios.get(`${urls.group_detail}/id/${this.props.id}`);
        })
        // @ts-ignore
        .then((d:{code: number, data: Group}) => {
            if (d.code === 0) {
                const {id, rights, name, group_describe} = d.data;
                this.setState({ formData: { id, rights, name, group_describe } });
            }
        })
        .catch(e => {
            console.log(e);
            this.setState({ error: true });
        })
        .finally(() => {
            this.setState({ loading: false });
        })
    }

    handleRightsChange = (e:ChangeEvent<HTMLInputElement>)=>{
        const { name, checked } = e.target;
        const id = parseInt(name.split('-')[1]);
        const selectedRights = new Set(this.state.selectedRights);
        if (checked) {
            selectedRights.add(id);
        } else {
            selectedRights.delete(id);
        }
        this.setState({ selectedRights: [...selectedRights] });
    }

    render() {
        const { colors, formData, helperText, errors } = this.state;
        return (
            <Core
                open         = {this.state.open}
                onClose      = {this.onClose}
                onOpen       = {this.setOpen}
                handleSubmit = {this.handleSubmit}
                onChange     = {this.onChange}
                colors       = {colors}
                formData     = {formData}
                refresh      = {this.getData}
                helperText   = {helperText}
                types        = {this.types}
                errors       = {errors}
                error        = {this.state.error}
                loading      = {this.state.loading}
            >
                {this.state.rights.map((r: Rights, i) => <Card className='flex flex-row flex-wrap grid-cols-2 justify-items-stretch' sx={{minWidth: '600px', margin: '1rem .5rem'}} key={i}>
                    <Typography
                        sx={{ mb: 1.5, width: '100%' }}
                        className='basis-full'
                        variant='h5'
                        >
                        {r.name}
                    </Typography>
                    {r.children.map((rr: Right, ii) => <Typography
                        key={`${i}-${ii}`}
                        variant="body2"
                        sx={{ mb: 1.5 }}
                        className='basis-1/2'
                        >
                        {rr.name}
                        <Switch
                            checked={this.state.selectedRights.includes(rr.id)}
                            onChange={this.handleRightsChange}
                            name={`${i}-${ii}`}
                            />
                    </Typography>)}
                </Card>)}
            </Core>);
    };
};