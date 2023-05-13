import { useEffect, useState, forwardRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import mittBus from '@/utils/MittBus';

interface Msg {
    type: 'success' | 'error' | 'warning' | 'info';
    msg: string;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Massager() {
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState<Msg>({ type: 'success', msg: '' });

    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        mittBus.on('msgEmit', (msg: Msg) => {
            setMsg(msg);
            setOpen(true);
            console.log(msg);
        });
    }, []);
    return (
        <>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} onClose={handleClose} message="I love snacks">
                <Alert onClose={handleClose} severity={msg.type} sx={{ width: '100%' }}>
                    {msg.msg}
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} onClose={handleClose} message="I love snacks">
                <Alert onClose={handleClose} severity={msg.type} sx={{ width: '100%' }}>
                    {msg.msg}
                </Alert>
            </Snackbar>
        </>
    );
}

export default Massager;
