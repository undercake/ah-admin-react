/*
 * @Author: Undercake
 * @Date: 2023-05-17 03:24:41
 * @LastEditTime: 2023-08-26 15:07:07
 * @FilePath: /ah-admin-react-from-next/src/components/EditDialogs/Core/Header.tsx
 * @Description: edit core Drawer Header
 */

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import Typography from "@mui/material/Typography";
import { MouseEventHandler } from "react";

function Header({ className = '', sx = {}, onClick, title = '修改' }: { className?: string, sx?: any, title?: string, onClick: (e: Event) => void }) {
    return (
        <Box className="flex w-full mb-2 shadow-md" sx={{marginLeft:'-1rem', marginRight: '-1rem', paddingLeft: '1rem', paddingRight: '1rem'}}>
            <IconButton
                className={'cursor-pointer mr-10 ' + className}
                sx={{
                    borderRadius: '.7rem',
                    width: '34px',
                    height: '34px',
                    '.dark & svg':{
                        color: '#ccc'
                    },
                    ...sx}}
                onClick={onClick as unknown as MouseEventHandler<HTMLButtonElement>}
            >
                <CloseIcon />
            </IconButton>
            <Typography noWrap component="div" className="px-4" sx={{lineHeight: '2.2rem'}}>
                {title}
            </Typography>
        </Box>
    );
}

export default Header;