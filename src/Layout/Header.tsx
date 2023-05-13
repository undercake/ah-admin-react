/*
 * @Author: Undercake
 * @Date: 2023-04-26 13:48:46
 * @LastEditTime: 2023-05-05 15:49:04
 * @FilePath: /ah-admin-react/src/components/Layout/Header.tsx
 * @Description: header
 */

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';

import SwitchDark from './SwitchDark';

function Header({ handleDrawerOpen, noMenu = false }: { handleDrawerOpen: () => void, noMenu?: boolean }) {
    return (
        <AppBar className="dark:bg-gray-900 dark:color dark:text-gray-100 py-3 px-6" color="inherit" sx={{ boxShadow: 0 }}>
            <Toolbar>
                <Box className="flex w-56">
                    <Box className="flex-auto"></Box>
                    {noMenu ? null :
                        <Avatar className='bg-purple-light hover:bg-purple-lighter text-purple-dark hover:text-purple-light cursor-pointer mr-10' color="inherit" variant="rounded" onClick={handleDrawerOpen} sx={{ borderRadius: '.7rem', width: '34px', height: '34px' }}>
                            <MenuIcon />
                        </Avatar>}
                </Box>
                <Typography variant="h6" noWrap component="div">
                    Mini variant drawer
                </Typography>
                <SwitchDark />
            </Toolbar>
        </AppBar>
    );
}

export default Header;
