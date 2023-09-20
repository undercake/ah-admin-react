import { useEffect, useState, forwardRef } from 'react';
import Stack from '@mui/material/Stack';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import mittBus from '../utils/MittBus';

interface Msg {
    type: 'success' | 'error' | 'warning' | 'info';
    msg: string;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

let timer: NodeJS.Timeout|0 = 0;

function Massager() {
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState<Msg>({ type: 'success', msg: '' });
    const [opacity, setOpacity] = useState(0);

    const handleClose = () => {
        setOpacity(0);
        setTimeout(() => {
            setOpen(false);
        }, 300);
    };
    useEffect(() => {
        mittBus.on('msgEmit', (msg: Msg) => {
            setTimeout(() => {
                setOpacity(1);
                }, 2);
            setMsg(msg);
            setOpen(true);
            clearTimeout(timer);
            timer = setTimeout(() => {
                handleClose();
            },
            13000);
        });
        mittBus.on('is_login', (i: boolean) => i && handleClose());
    }, []);
    return (
        <>
            {open ?
                <Stack sx={{ width: '100%', position: 'absolute', top: 0, left: 0, opacity, zIndex: 10000000,  '& svg': { margin: 'auto' } }} spacing={2} className='text-2xl transition-opacity duration-300'>
                    <Alert variant="filled" sx={{lineHeight: '3.75rem', fontSize:'1.25rem'}} severity={msg.type} className='cursor-pointer justify-center h-22' onClick={handleClose}>
                        {msg.msg}
                    </Alert>
                </Stack> : null}
        </>
    );
}

export default Massager;