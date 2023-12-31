import { useState, Component, FormEventHandler } from 'react'; import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormInput from '../../components/FormComponents/FormInput';
import axios from '../../utils/Axios';
import { urls } from '../../config';
import type Admin from '../Admin/Admin';
import mittBus from '../../utils/MittBus';

type colors = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined;

// @flow
interface InfoProps {
    className?: string;
}

interface InfoState {
    nickname           ?: string;
    userName           ?: string;
    mobile             ?: string;
    email              ?: string;
    nicknameColor      ?: colors;
    nicknameHelper     ?: string;
    nicknameHelperColor?: colors;
    userNameColor      ?: colors;
    userNameHelper     ?: string;
    userNameHelperColor?: colors;
    mobileColor        ?: colors;
    mobileHelper       ?: string;
    mobileHelperColor  ?: colors;
    emailColor         ?: colors;
    emailHelper        ?: string;
    emailHelperColor   ?: colors;
    [key: string]       : any;
}

const size = 'small';

class Info extends Component<InfoProps, InfoState> {
    state: InfoState = {
        nickname           : '',
        userName           : '',
        mobile             : '',
        email              : '',
        nicknameHelper     : '',
        userNameHelper     : '',
        mobileHelper       : '',
        emailHelper        : '',
        nicknameColor      : 'primary',
        nicknameHelperColor: 'primary',
        userNameColor      : 'primary',
        userNameHelperColor: 'primary',
        mobileColor        : 'primary',
        mobileHelperColor  : 'primary',
        emailColor         : 'primary',
        emailHelperColor   : 'primary',
    };

    componentDidMount(): void {
        // @ts-ignore
        axios.get(urls.my_get).then((res: {code: number, data: Admin}) => {
            const { full_name, user_name, mobile, email } = res.data;
            this.setState({ nickname: full_name, userName: user_name, mobile, email });
        });
    }

    handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const { nickname, userName, mobile, email } = this.state;
        // TODO: 完善提示
        axios.post(urls.my_set, { full_name: nickname, user_name: userName, mobile, email })
        // @ts-ignore
        .then((res:{code:number}) => {
            console.log(res);
            res.code === 0 && mittBus.emit('msgEmit', { status: 'success', msg: '修改成功' });
        });
    }

    render() {
        return (
            <Box component="form" onSubmit={this.handleSubmit as unknown as FormEventHandler<HTMLFormElement>} noValidate sx={{ mt: 1 }} className={this.props.className}>
                <FormInput
                    label='昵称'
                    id='my-pass-nickname'
                    sx={{ mt: 3 }}
                    color={this.state.nicknameColor}
                    helperColor={this.state.nicknameHelperColor}
                    type='text'
                    name="nickname"
                    required
                    fullWidth
                    variant="outlined"
                    helperText={this.state.nicknameHelper}
                    error={this.state.nicknameHelperColor == 'error'}
                    onChange={(e) => this.setState({ nickname: e.target.value })}
                    autoComplete="none"
                    inputProps={{ maxLength: 6 }}
                    value={this.state.nickname}
                    size={size}
                />
                <FormInput
                    label='登录名'
                    id='my-pass-username'
                    sx={{ mt: 3 }}
                    color={this.state.userNameColor}
                    helperColor={this.state.userNameHelperColor}
                    type='text'
                    name="username"
                    required
                    fullWidth
                    variant="outlined"
                    helperText={this.state.userNameHelper}
                    error={this.state.userNameHelperColor == 'error'}
                    onChange={(e) => this.setState({ userName: e.target.value })}
                    autoComplete="none"
                    inputProps={{ maxLength: 6 }}
                    value={this.state.userName}
                    size={size}
                />
                <FormInput
                    label='手机号'
                    id='my-pass-mobile'
                    sx={{ mt: 3 }}
                    color={this.state.mobileColor}
                    helperColor={this.state.mobileHelperColor}
                    type='text'
                    name="mobile"
                    required
                    fullWidth
                    variant="outlined"
                    helperText={this.state.mobileHelper}
                    error={this.state.mobileHelperColor == 'error'}
                    onChange={(e) => this.setState({ mobile: e.target.value })}
                    autoComplete="none"
                    inputProps={{ maxLength: 6 }}
                    value={this.state.mobile}
                    size={size}
                />
                <FormInput
                    label='电子邮箱'
                    id='my-pass-email'
                    sx={{ mt: 3 }}
                    color={this.state.emailColor}
                    helperColor={this.state.emailHelperColor}
                    type='text'
                    name="email"
                    required
                    fullWidth
                    variant="outlined"
                    helperText={this.state.emailHelper}
                    error={this.state.emailHelperColor == 'error'}
                    onChange={(e) => this.setState({ email: e.target.value })}
                    autoComplete="none"
                    inputProps={{ maxLength: 6 }}
                    value={this.state.email}
                    size={size}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    // className='bg-purple-dark hover:bg-purple-lighter'
                    color="primary"
                    sx={{ mt: 3, mb: 2, border: 0, boxShadow: 0, '&:hover': { border: 0, boxShadow: 0 } }}
                    size={size}
                >
                    提交
                </Button>
            </Box>
        );
    }
}

export default Info;