/*
 * @Author: Undercake
 * @Date: 2023-07-30 14:57:44
 * @LastEditTime: 2023-07-30 15:30:46
 * @FilePath: /ah-admin-react/src/components/Loading.tsx
 * @Description: Loading component
 */

import CircularProgress from '@mui/material/CircularProgress';

export default function Loading () {
    return (<div style={{ margin: 'auto', marginTop: '2rem', textAlign: 'center', width:'50px', height: '50px' }}>
        <CircularProgress color="secondary" />
    </div>);
}