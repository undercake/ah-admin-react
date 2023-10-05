import { Component, FormEventHandler } from 'react'; import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormInput from '../../components/FormComponents/FormInput';
import axios from '../../utils/Axios';
import { urls } from '../../config';
import md5 from 'md5';
import * as Yup from 'yup';
import mittBus from '../../utils/MittBus';

type colors = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined;

// @flow
interface InfoProps {
    className?: string;
}

interface InfoState {
    oldPass               : string;
    newPass               : string;
    repeatPass            : string;
    oldPassColor         ?: colors;
    oldPassHelper        ?: string;
    oldPassHelperColor   ?: colors;
    newPassColor         ?: colors;
    newPassHelper        ?: string;
    newPassHelperColor   ?: colors;
    repeatPassColor      ?: colors;
    repeatPassHelper     ?: string;
    repeatPassHelperColor?: colors;
    [key: string]         : any;
}

const size = 'small';

class Info extends Component<InfoProps, InfoState> {
    state: InfoState = {
        oldPass              : '',
        newPass              : '',
        repeatPass           : '',
        oldPassHelper        : '',
        newPassHelper        : '',
        repeatPassHelper     : '',
        oldPassColor         : 'primary',
        oldPassHelperColor   : 'primary',
        newPassColor         : 'primary',
        newPassHelperColor   : 'primary',
        repeatPassColor      : 'primary',
        repeatPassHelperColor: 'primary',
    };

    schema = Yup.object().shape({
        oldPass   : Yup.string().min(6, '原密码不能小于6位').max(66, '原密码不能长于66位').required('原密码不能为空'),
        newPass   : Yup.string().min(6, '新密码不能小于6位').max(66, '新密码不能长于66位').required('新密码不能为空'),
        repeatPass: Yup.string().min(6, '重复密码不能小于6位').max(66, '重复密码不能长于66位').required('重复密码不能为空'),
    });

    handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const { oldPass, newPass, repeatPass } = this.state;
        this.schema.validate({ oldPass, newPass, repeatPass }).then(() =>
                axios.post(urls.my_set_pass, { oldpass: md5(oldPass), newpass: md5(newPass), newpass_repeat: md5(repeatPass) }))
            .then((res) => {
                mittBus.emit('emitMsg', { status: 'success', msg: '修改成功' });
                console.log(res);
            });
    }

    render() {
        return (
            <Box component="form" onSubmit={this.handleSubmit as unknown as FormEventHandler<HTMLFormElement>} noValidate sx={{ mt: 1 }} className={this.props.className}>
                <FormInput
                    label='原密码'
                    id='my-pass-oldPass'
                    sx={{ mt: 3 }}
                    color={this.state.oldPassColor}
                    helperColor={this.state.oldPassHelperColor}
                    type='password'
                    name="oldPass"
                    required
                    fullWidth
                    variant="outlined"
                    helperText={this.state.oldPassHelper}
                    error={this.state.oldPassHelperColor === 'error'}
                    onChange={(e) => this.setState({ oldPass: e.target.value })}
                    autoComplete="none"
                    inputProps={{ maxLength: 6 }}
                    value={this.state.oldPass}
                    size={size}
                />
                <FormInput
                    label='新密码'
                    id='my-pass-newPass'
                    sx={{ mt: 3 }}
                    color={this.state.newPassColor}
                    helperColor={this.state.newPassHelperColor}
                    type='password'
                    name="newPass"
                    required
                    fullWidth
                    variant="outlined"
                    helperText={this.state.newPassHelper}
                    error={this.state.newPassHelperColor === 'error'}
                    onChange={(e) => this.setState({ newPass: e.target.value })}
                    autoComplete="none"
                    inputProps={{ maxLength: 6 }}
                    value={this.state.newPass}
                    size={size}
                />
                <FormInput
                    label='重复密码'
                    id='my-pass-repeatPass'
                    sx={{ mt: 3 }}
                    color={this.state.repeatPassColor}
                    helperColor={this.state.repeatPassHelperColor}
                    type='password'
                    name="repeatPass"
                    required
                    fullWidth
                    variant="outlined"
                    helperText={this.state.repeatPassHelper}
                    error={this.state.repeatPassHelperColor === 'error'}
                    onChange={(e) => this.setState({ repeatPass: e.target.value })}
                    autoComplete="none"
                    inputProps={{ maxLength: 6 }}
                    value={this.state.repeatPass}
                    size={size}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    className='bg-purple-dark hover:bg-purple-lighter'
                    color="secondary"
                    size={size}
                    sx={{ mt: 3, mb: 2, border: 0, boxShadow: 0, '&:hover': { border: 0, boxShadow: 0 } }}
                >
                    提交
                </Button>
            </Box>
        );
    }
}

export default Info;