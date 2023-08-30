/*
 * @Author: Undercake
 * @Date: 2023-04-26 13:48:46
 * @LastEditTime: 2023-08-30 15:53:16
 * @FilePath: /ah-admin-react/src/Layout/Header.tsx
 * @Description: header
 */

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import { deepOrange } from '@mui/material/colors';
import SwitchDark from './SwitchDark';
import { onPathChange, get } from '../utils/Router';
import { getRouteName } from '../utils/Rights';
import { useEffect, useState } from 'react';
import { urls } from '../config';
import axios from '../utils/Axios';
import { fileURLToPath } from 'url';

function Header({ handleDrawerOpen, noMenu = false }: { handleDrawerOpen: () => void, noMenu?: boolean }) {
    const [title, setTitle] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [avatarProps, setAvatarProps] = useState<Object>({sx:{bgcolor: deepOrange[500]}});
    const [avatarChildren, setAvatarChildren] = useState<string|null>(null);
    useEffect(() => {
        onPathChange((path) => {
            const t = getRouteName(path);
            setTitle(t);
            document.title = `阿惠家政管理系统-${t}`;
        });
        setTitle(getRouteName(get()));

        axios.get(urls.my_get).then((res) => {
            console.log({res})
            const { full_name, wx_id } = res.data;
            setUserName(full_name);
            wx_id === 0 ? setAvatarChildren(null) : setAvatarChildren(null)
        });
    }, []);
    return (
        <AppBar className="dark:bg-gray-1080 dark:color dark:text-gray-100 py-3 px-6" color="inherit" sx={{ boxShadow: 0 }}>
            <Toolbar className='flex'>
                <Box className="flex-none flex w-56">
                    <Box className="flex-auto">
                        <Avatar {...avatarProps}>{avatarChildren}</Avatar>
                        {userName}
                    </Box>
                    {noMenu ? null :
                        <Avatar className='bg-purple-light hover:bg-purple-lighter text-purple-dark hover:text-purple-light cursor-pointer mr-10' color="inherit" variant="rounded" onClick={handleDrawerOpen} sx={{ borderRadius: '.7rem', width: '34px', height: '34px' }}>
                            <MenuIcon />
                        </Avatar>}
                </Box>
                <Typography className='flex-auto text-center pr-40' variant="h6" noWrap component="div">
                    {title}
                </Typography>
                <SwitchDark />
            </Toolbar>
        </AppBar>
    );
}

export default Header;
