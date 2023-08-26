/*
 * @Author: Undercake
 * @Date: 2023-08-14 17:27:03
 * @LastEditTime: 2023-08-22 16:59:43
 * @FilePath: /ah-admin-react-from-next/src/components/EditDialogs/Admin/index.tsx
 * @Description: 
 */

import { useEffect, useState } from 'react';
import Core from '../Core';
type Props = {
    handleClose: (a:Event, b:string)=>boolean;
    id         : number;
};
function Admin({id, handleClose}:Props) {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        setOpen(true);
    }, []);
    const onClose = (e: Event, reason: string) => {
        if (handleClose(e, reason)) {
            setOpen(false);
        }
    }

    const onOpen = () => {
        setOpen(true);
    }

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        console.log('submit');
    }

    const onChange = (val: string | number, name: string) => {
        console.log(val, name);
    }

    const colors = {};
    const formData = {};
    const helperText = {};
    const types = {};

    return <Core
        open    = {open}
        onClose = {onClose}
        onOpen  = {onOpen}
        handleSubmit={handleSubmit}
        onChange={onChange}
        colors={colors}
        formData={formData}
        helperText={helperText}
        types={types}
    />;
}

export default Admin;