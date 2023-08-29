import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Card from '@mui/material/Card';
import Header from './Header';
import Side from './Side';
import Massager from './Massager';
import Login from '../components/Login';
import checkLogin from '../utils/checkLogin';
import MittBus from '../utils/MittBus';
import {hashChange} from '../utils/Router';
import RouteView from '../components/RouteView';
import Route from '../Routes';
import ScrollView from '../components/ScrollView';
import Loading from '../components/Status/Loading';
// import { urls } from '../config';
import './styles/main.scss';
import { CompoundComponentContext } from '@mui/base/utils/useCompound';
// import axios from '../utils/Axios';

interface CastLoginProps {
    handleLogin: () => void;
}

interface LayoutProps {
    children?: React.ReactNode;
}

function Layout(props: LayoutProps) {
    const [open, setOpen] = useState(true);

    const [is_login, setIsLogin] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const china_to_show = ["❤富强❤", "❤民主❤", "❤文明❤", "❤和谐❤", "❤自由❤", "❤平等❤", "❤公正❤", "❤法治❤", "❤爱国❤", "❤敬业❤", "❤诚信❤", "❤友善❤"];
    let index = 0;
    const click_to_show = (e: any) => {
            let showSpan = document.createElement('span');
            showSpan.innerHTML = china_to_show[index++ % china_to_show.length];
            showSpan.style.position = 'fixed';
            showSpan.style.top = e.clientY + 'px';
            showSpan.style.left = e.clientX + 'px';
            console.log(e.clientX, e.clientY);
            let color_list = ["#ff3333", "#ff8000", "#f9f906", "#b9f20d", "#00ff00", "#00ff80", "#00ffff", "#007fff", "#0000ff", "#7f00ff", "#ff00ff", "#ff0080"];
          showSpan.style.color = color_list[Math.floor(Math.random() * color_list.length)];
        document.body.appendChild(showSpan);
        let t = showSpan.offsetTop;
        let tim = setInterval(function() {
            showSpan.style.top = showSpan.offsetTop - 1 + 'px';
            if (Math.abs(t - showSpan.offsetTop) > 100) {
                clearInterval(tim);
                document.body.removeChild(showSpan);
            }
        }, 10)
    }

    useEffect(() => {
        MittBus.on('is_login', (i: boolean) => setIsLogin(i));
        checkLogin((e: boolean) => {setIsLogin(e); setLoading(false)});
        window && window.addEventListener('click', click_to_show);
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
                        <Side open={open} />

                        <Box
                            component="main"
                            className="mt-22 layout-main-container bg-gray-200 dark:bg-gray-800 overflow-hidden overflow-y-hidden"
                            sx={{ flexGrow: 1, p: 3 }}
                        >
                            <ScrollView style={{ height: 'calc(100vh - 8rem)', overflowY: 'auto', borderRadius: '1rem' }}>
                                {/* <RouteView DefaultComponent={Loading} /> */}
                                <Route />
                            </ScrollView>
                        </Box>
                    </Box>
                </>
            ) : (
                <>
                    <Box sx={{ width: '100wh', height: '100vh' }} className="pt-10 bg-gray-200 dark:bg-gray-1080">
                        <CssBaseline />
                        <Header handleDrawerOpen={handleDrawerOpen} noMenu />
                        <Box sx={{ width: 500 }} className="mx-auto">
                        {loading ? <Loading /> :
                            <Card
                                className="mt-20 mx-auto bg-white dark:bg-gray-800 dark:text-gray-50 p-8"
                                sx={{ borderRadius: '1rem', boxShadow: 0 }}
                            >
                                <Login onLogin={() => setIsLogin(true)} />
                            </Card>
                            }
                        </Box>
                    </Box>
                </>
            )}
            <Massager />
        </>
    );
}
export default Layout;