import { useEffect } from 'react';
import SwitchDark from '@/Layout/SwitchDark';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CLogin from '@/components/Login';
import checkLogin from '@/utils/checkLogin';
import { push } from '@/utils/Router';
// import './login.css'

export default function Login() {
    const handleLogin = () => push('/');

    useEffect(() => {
        checkLogin((e: boolean) => e && handleLogin());
        // eslint-disable-next-line
    }, []);
    return (
        <Box sx={{width:'100wh', height: '100vh'}} className='pt-10 bg-gray-200 dark:bg-gray-900'>
            <Box sx={{ width: 500 }} className="mx-auto">
                <Card className="mx-auto bg-white dark:bg-gray-800 dark:text-gray-50 p-8" sx={{ borderRadius: '1rem', boxShadow: 0 }}>
                    {/* <CssBaseline /> */}
                    <SwitchDark />
                    <CLogin onLogin={handleLogin} />
                </Card>
            </Box>
        </Box>
    );
}
