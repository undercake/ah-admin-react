import { useEffect, useState } from 'react';
// import { styled } from '@mui/material/styles';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Header from './Header';
import Side from './Side';
import Massager from './Massager';
import SwitchDark from './SwitchDark';
import Login from '@/components/Login';
import checkLogin from '@/utils/checkLogin';
import MittBus from '@/utils/MittBus';
import PerfectScrollbar from 'react-perfect-scrollbar';
import routes from '@/routes';
import RouteView from '@/components/RouteView';
import './styles/main.scss';

const loading = (
    <div style={{ margin: 'auto', marginTop: '1rem', textAlign: 'center' }}>
        <CircularProgress color="secondary" />
    </div>
);

interface CastLoginProps {
    handleLogin: () => void;
}

interface LayoutProps {
    children?: React.ReactNode;
}

function CastLogin(props: CastLoginProps) {
    return (
        <Box sx={{ width: 500, boxShadow: 0 }} className="mx-auto mt-3 bg-white dark:bg-gray-800 dark:text-gray-50 rounded-4xl">
            <Card sx={{ boxShadow: 0 }} className="ps-8 pe-8 bg-white dark:bg-gray-800 dark:text-gray-50">
                <Login onLogin={props.handleLogin} />
            </Card>
        </Box>
    );
}

export default function Layout(props: LayoutProps) {
    const [open, setOpen] = useState(true);

    const [is_login, setIsLogin] = useState<boolean>(true);

    useEffect(() => {
        MittBus.on('is_login', (i: boolean) => setIsLogin(i));
        checkLogin((e: boolean) => setIsLogin(e));
        // eslint-disable-next-line
    }, []);

    const handleDrawerOpen = () => {
        setOpen(!open);
    };

    return (
        <>
            {is_login ? (
                <>
                    {/* @ts-ignore */}
                    <Box sx={{ display: 'flex' }}>
                        <CssBaseline />
                        <Header handleDrawerOpen={handleDrawerOpen} />

                        <PerfectScrollbar
                            component="div"
                            style={{
                                height: 'calc(100vh - 56px)',
                                paddingLeft: '10px',
                                paddingRight: '10px'
                            }}
                        >
                            <Side open={open} />
                        </PerfectScrollbar>

                        <Box
                            component="main"
                            className="mt-20 layout-main-container bg-gray-200 dark:bg-gray-800 overflow-hidden overflow-y-scroll"
                            sx={{ flexGrow: 1, p: 3 }}
                        >
                            {/* {is_login ? props.children : <CastLogin handleLogin={() => setIsLogin(true)} />} */}
                            <RouteView config={routes} defaultComponent={loading} />
                        </Box>
                    </Box>
                    <Massager />
                </>
            ) : (
                <>
                    <Box sx={{ width: '100wh', height: '100vh' }} className="pt-10 bg-gray-200 dark:bg-gray-900">
                        <CssBaseline />
                        <Header handleDrawerOpen={handleDrawerOpen} />
                        <Box sx={{ width: 500 }} className="mx-auto">
                            <Card
                                className="mx-auto bg-white dark:bg-gray-800 dark:text-gray-50 p-8"
                                sx={{ borderRadius: '1rem', boxShadow: 0 }}
                            >
                                <SwitchDark />
                                <Login onLogin={() => setIsLogin(true)} />
                            </Card>
                        </Box>
                    </Box>
                </>
            )}
        </>
    );
}
