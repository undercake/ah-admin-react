/*
 * @Author: Undercake
 * @Date: 2023-08-07 13:41:03
 * @LastEditTime: 2023-08-13 17:34:39
 * @FilePath: /ah-admin-react/src/components/DetailDialogs/Core/index.tsx
 * @Description: 
 */
import { type ReactNode, useEffect, useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import Header from "@/components/EditDialogs/Core/Header";

type colors = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined;
interface types {
    [key: string]: {
        type     : 'input' | 'select' | 'date' | 'datetime' | 'time' | 'image' | 'avatar' | 'textfield';
        required : boolean;
        label    : string;
        options ?: { label: string, value: string | number }[];
        related ?: ((v: string) => void)[];
    };
}
interface props {
    children    ?: ReactNode;
    onClose      : any;
    onOpen       : any;
    open         : boolean;
    title       ?: string;
}
function EditCore({
    children = null,
    onClose,
    onOpen,
    open,
    title = '顾客详情'
}: props) {
    return (
        <SwipeableDrawer
              // className='dark:bg-gray-900 dark:text-gray-100 p-4'
            PaperProps = {{ className: 'dark:bg-gray-900 dark:text-gray-100 p-4' }}
            anchor     = 'bottom'
            open       = {open}
            onClose    = {onClose}
            onOpen     = {onOpen}
        >
            <Header onClick = {(e: Event) => { onClose(e, 'button') }} title = {title} />
            <Box component="div" sx = {{ pt: 1, maxHeight: '40rem',overflow: 'hidden'}}>
                {children}
            </Box>
        </SwipeableDrawer>
    );
}

export default EditCore;