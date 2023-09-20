
import { useEffect, useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Visibility from '@mui/icons-material/Visibility';        // 密码可见
import VisibilityOff from '@mui/icons-material/VisibilityOff';  // 密码不可见
import mittBus from '../../utils/MittBus';
import axios from '../../utils/Axios';
import FormInput from '../../components/FormComponents/FormInput';
import QRLogin from './QRLogin';
// import Image from 'next/image';
import md5 from 'md5';

import { urls } from '../../config';
import * as Yup from 'yup';

interface Props {
    onLogin: () => void;
}

type colors = 'error' | 'success' | 'warning' | 'info' | 'primary' | 'secondary';

const mainColor = 'primary';

function Copyright(props: any) {
    return (
        <Typography className="dark:text-gray-50" variant="body2" color="text.secondary" align="center" {...props}>
            Copyright © kmahjz.com.cn {new Date().getFullYear()}
        </Typography>
    );
}

const schema = Yup.object().shape({
    username: Yup.string().required('用户名不能为空'),
    password: Yup.string().min(6, '密码至少包含6个字符').required('密码不能为空'),
    verification: Yup.string().required('验证码不能为空').length(5, '验证码必须为5位')
});

function VerificationImg({ random, handleClick }: { random: string, handleClick: () => void }) {
    const [src, setSrc] = useState('/midas/cap/get?_=' + random);
    useEffect(() => {
        setSrc('/midas/cap/get?_=' + random);
    }, [random]);
    return (
        <img
            src={src}
            alt="verification"
            className="w-1/2 h-1/2"
            onClick={handleClick}
            width="250"
            height="62"
            style={{ cursor: 'pointer', marginRight: '-.78rem' }}
        // priority
        />
    );
}

function Login(props: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');                  // 用户名
    const [password, setPassword] = useState('');                  // 密码
    const [verification, setVerification] = useState('');                  // 验证码
    const [userHelperName, setUserHelperName] = useState('');                  // 用户名提示
    const [userHelperPassword, setUserHelperPassword] = useState('');                  // 密码提示
    const [userHelperVerification, setUserHelperVerification] = useState('');                  // 验证码提示
    const [userColorName, setUserColorName] = useState<colors>(mainColor);   // 用户名颜色
    const [userColorPassword, setUserColorPassword] = useState<colors>(mainColor);   // 密码颜色
    const [userColorVerification, setUserColorVerification] = useState<colors>(mainColor);   // 验证码颜色
    const [random, setRandom] = useState('' + Math.random());  // 验证码随机数
    const [isQRLogin, setisQRLogin] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();
    const handleLogin = () => {
        mittBus.emit('getLists', true);
        props.onLogin();
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const kvObj = Object.create(null);
        kvObj['username'] = [setUserHelperName, setUserColorName];
        kvObj['password'] = [setUserHelperPassword, setUserColorPassword];
        kvObj['verification'] = [setUserHelperVerification, setUserColorVerification];
        schema
            .validate({
                username,
                password,
                verification
            })
            .then(() => {
                return axios.post(urls.login, {
                    username,
                    passwordMd5: md5(password),
                    captcha: verification
                });
            })
            .then((res: any) => {
                if (res.code === 0) {
                    mittBus.emit('is_login', true);
                    handleLogin();
                }
            })
            .catch((err) => {
                if ('msg' in err) {
                    if (err.msg.indexOf('验证码') !== -1) {
                        setUserHelperVerification(err.msg);
                        setUserColorVerification('error');
                    }
                    if (err.msg.indexOf('密码') !== -1) {
                        setUserHelperPassword(err.msg);
                        setUserColorPassword('error');
                    }
                    if (err.msg.indexOf('账号') !== -1) {
                        setUserHelperName(err.msg);
                        setUserColorName('error');
                    }
                } else if ('params' in err && 'message' in err) {
                    const [setHelper, setUserColor] = kvObj[err.params.path];
                    setHelper(err.message);
                    setUserColor('error');
                }
            });
    };

    const handleClick = () => {
        setRandom('' + Math.random());
        setUserColorVerification(mainColor)
        setUserHelperVerification('');
        setVerification('');
    }

    return (
        <>
            <Box
                sx={{
                    marginTop: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                {/* <Avatar vatar sx={{ m: 1, width: '6.3rem', height: '6rem' }} variant='square' src='/static/logo.gif'>
                </Avatar>
                <Typography component="h1" variant="h5" sx={{ marginBottom: '1rem' }}>
                    阿惠家政
                </Typography>*/}
                {/* {
                    isQRLogin ?
                    <> */}
                <Box className='flex'>
                    <QRLogin className='basis-2/5' handleLogin={handleLogin}></QRLogin>
                    {/* <Button
                                color="primary"
                                size="medium"
                                variant="text"
                                onClick={()=>setisQRLogin(false)}
                            >
                                账号密码登录
                            </Button> */}
                    {/* </>:
                        <> */}
                    <Box component="form" className='flex-1' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Typography className='mb-2 text-center' variant="h5" sx={{ marginBottom: '.5rem' }}>
                            账号登录
                        </Typography>
                        <FormInput
                            label='用户名'
                            id='outlined-adornment-username'
                            color={userColorName}
                            helperColor={userColorName}
                            name="username"
                            required
                            fullWidth
                            size='large'
                            variant="outlined"
                            error={userColorName === 'error'}
                            helperText={userHelperName}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setUserHelperVerification('');
                                setUserColorVerification(mainColor);
                                setUserColorPassword(mainColor);
                            }}
                            inputProps={{ maxLength: 6 }}
                        />
                        <FormInput
                            label='密码'
                            id='outlined-adornment-password'
                            sx={{ mt: 3 }}
                            color={userColorPassword}
                            helperColor={userColorPassword}
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            required
                            fullWidth
                            size='large'
                            variant="outlined"
                            error={userColorPassword === 'error'}
                            helperText={userHelperPassword}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setUserHelperPassword('');
                                setUserColorPassword(mainColor);
                                setUserColorVerification(mainColor);
                            }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        className="dark:text-gray-50"
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            inputProps={{ maxLength: 6 }}
                        />
                        <FormInput
                            label='验证码'
                            id='outlined-adornment-verification'
                            sx={{ mt: 3 }}
                            color={userColorVerification}
                            helperColor={userColorVerification}
                            type='text'
                            name="password"
                            required
                            fullWidth
                            size='large'
                            variant="outlined"
                            helperText={userHelperVerification}
                            error={userColorVerification === 'error'}
                            onChange={(e) => {
                                setVerification(e.target.value);
                                setUserHelperVerification('');
                                setUserColorVerification(mainColor);
                            }}
                            autoComplete="none"
                            endAdornment={<VerificationImg random={random} handleClick={handleClick} />}
                            inputProps={{ maxLength: 6 }}
                            value={verification}
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
                            登录
                        </Button>
                    </Box>
                </Box>
                {/* <Button
                            color="primary"
                            size="medium"
                            variant="text"
                            onClick={()=>setisQRLogin(true)}
                        >
                            企业微信扫码登录
                        </Button> */}
                {/* </>
                } */}
            </Box>
            <Copyright sx={{ mt: 3, mb: 4 }} />
        </>
    );
}

export default Login;

