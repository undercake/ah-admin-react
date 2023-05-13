import { useState, Component, FormEventHandler } from 'react'; import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormInput from '@/components/FormInput';
import axios from '@/utils/Axios';
import { urls } from '@/config';

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
        axios.get(urls.my_get).then((res) => {
            console.log(res);
            const { full_name, user_name, mobile, email } = res.data;
            this.setState({ nickname: full_name, userName: user_name, mobile, email });
        });
    }

    handleSubmit = (e: SubmitEvent) => {
        console.log(e);
        e.preventDefault();
        const { nickname, userName, mobile, email } = this.state;
        axios.post(urls.my_set, { full_name: nickname, user_name: userName, mobile, email }).then((res) => {
            console.log(res);
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
                    size='small'
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
                    size='small'
                />
                <FormInput
                    label='手机号'
                    电子邮箱
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
                    size='small'
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
                    size='small'
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    className='bg-purple-dark hover:bg-purple-lighter'
                    color="secondary"
                    size="large"
                    sx={{ mt: 3, mb: 2, border: 0, boxShadow: 0, '&:hover': { border: 0, boxShadow: 0 } }}
                >
                    提交
                </Button>
            </Box>
        );
    }
}

export default Info;