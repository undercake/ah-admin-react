/*
 * @Author: Undercake
 * @Date: 2023-07-30 14:57:44
 * @LastEditTime: 2023-08-09 13:26:36
 * @FilePath: /ah-admin-react/src/components/Status/Loading.tsx
 * @Description: Loading component
 */

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function Loading ({sx = {}, color='secondary'} : {sx?: any, color?: 'primary' | 'secondary' | 'inherit' | undefined}) {
    return <Box
    component='div'
    sx={{
        margin: 'auto',
        marginTop: '2rem',
        textAlign: 'center',
        width:'50px',
        height: '50px',
        ...sx
    }}>
        <CircularProgress color={color} />
    </Box>;
}