/*
 * @Author: Undercake
 * @Date: 2023-08-07 13:41:03
 * @LastEditTime: 2023-08-09 09:40:43
 * @FilePath: /ah-admin-react/src/components/DetailDialogs/Core/index.tsx
 * @Description: 
 */
import { type ReactNode, useEffect, useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ScrollView from '@/components/ScrollView';
import Header from "@/components/EditDialogs/Core/Header";
import FormInput from '@/components/FormComponents/FormInput';
import FormSelect from '@/components/FormComponents/Select';
import DatePicker from '@/components/FormComponents/DatePicker';
import { FormEventHandler } from 'react';

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
    title = '详情'
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
            <ScrollView>
                <Box component="div" sx = {{ pt: 1, maxWidth: '50rem' }}>
                    {children}
                </Box>
            </ScrollView>
        </SwipeableDrawer>
    );
}

export default EditCore;