/*
 * @Author: Undercake
 * @Date: 2023-08-09 10:48:36
 * @LastEditTime: 2023-08-09 12:44:09
 * @FilePath: /ah-admin-react/src/components/LoadingButton/index.tsx
 * @Description: 
 */

import LoadingButton from '@mui/lab/LoadingButton';
import { useState, type ReactNode, useEffect } from 'react';

function LB({ children = null, sx, loading = false, ...e } : { children?: ReactNode, [key: string]: any, sx?: any, loading?: boolean}) {

    return <LoadingButton
    sx={{
        '.dark &.loading': {
            color: 'white',
            backgroundColor: '#666',
            cursor: 'not-allowed!important',
        },
        ...sx
    }}
    classes={{
        loading: 'loading'
    }}
    loading={loading}
    {...e}>
        {children}
    </LoadingButton>;
}

export default LB;