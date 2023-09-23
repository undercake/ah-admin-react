/*
 * @Author: Undercake
 * @Date: 2023-08-30 17:18:35
 * @LastEditTime: 2023-09-23 16:34:25
 * @FilePath: /ah-admin-react/src/components/Login/QRLogin.tsx
 * @Description: 
 */
import { Box } from "@mui/material";
import { urls } from "../../config";
import { useEffect, useState } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Popover from '@mui/material/Popover';
import ErrorIcon from '@mui/icons-material/Error';
import Typography from '@mui/material/Typography';
import axios from "../../utils/Axios";

let timer_is_scanned: number | NodeJS.Timeout = 0;
let timer_refresh_img: number | NodeJS.Timeout = 0;
let refreshCount: number = 0;
function QRLogin({ handleLogin, ...e }: { handleLogin: () => void,[key:string]:any }) {
    const [isScanned, setIsScanned] = useState(false);
    const [isExpired, setIsExpired] = useState(false);
    const [isError, setIsError] = useState(false);
    const [random, setRandom] = useState(Math.random());
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const open = Boolean(anchorEl);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const start_QR_login = () => {
        timer_is_scanned = setInterval(() => {
            isScanned ?
                // @ts-ignore
                axios.get(urls.login_qr_is_scanned).then((e: { code: number, status: boolean }) => {
                    // e.status && clearInterval(timer_is_scanned);
                    setIsScanned(e.status);
                }).catch(e => {
                    console.log(e);
                    setIsError(true);
                    clearInterval(timer_is_scanned);
                    clearInterval(timer_refresh_img);
                }) :
                // @ts-ignore
                axios.get(urls.login_qr_is_loggedin).then((e: { code: number, logged_in: boolean }) => {
                    e.logged_in && handleLogin();
                }).catch((e) => {
                    console.log(e);
                    setIsError(true);
                    clearInterval(timer_is_scanned);
                    clearInterval(timer_refresh_img);
                })
                ;
        }, 1000);
        timer_refresh_img = setInterval(() => {
            if (refreshCount > 3) {
                setIsExpired(true);
                clearInterval(timer_refresh_img);
            }
            // setRandom(Math.random());
            refreshCount++;
        }, 1400 * 1000);
        return function cleanup() {
            clearInterval(timer_is_scanned);
            clearInterval(timer_refresh_img);
        }
    }
    useEffect(start_QR_login, []);

    const sx = {
        fontSize: '5rem',
        background: '#fff',
        borderRadius: '50%'
    };

    return <Box sx={{ textAlign: 'center',paddingRight: '2rem', paddingTop: '.75rem', marginRight: '2rem', borderRight: '0.5px solid rgb(196, 203, 215)', height: '24.2rem' }} {...e}>
        <Typography className='mb-2' variant="h5" sx={{marginBottom: '.5rem'}}>
            扫码登陆
        </Typography>
        <img src={`${urls.login_qr}?__=${random}`} style={{ width: '16rem', margin: 'auto' }} alt='' />
        <Typography sx={{marginTop: '.5rem'}}>
            使用企业微信扫码登陆
        </Typography>

        {(isScanned || isExpired || isError) && <><div style={{
            width: '17rem',
            height: '16rem',
            position: 'relative',
            left: 0,
            top: '-18rem',
            background: 'rgba(0,0,0,.5)',
            backdropFilter: 'blur(6px)',
            textAlign: 'center',
            lineHeight: '16rem',
            cursor: 'pointer'
        }}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            onClick={(object) => {
                console.log(object)
                setIsExpired(false);
                setIsError(false);
                setIsScanned(false);
                setRandom(Math.random());
                start_QR_login();
            }}>
            {isScanned ? <CheckCircleIcon
                sx={sx}
                htmlColor='green'
            /> : <ErrorIcon
                sx={sx}
                htmlColor={isError ? 'red' : 'gray'}
            />}
        </div>
        <Popover
            id="mouse-over-popover"
            sx={{
                pointerEvents: 'none',
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
        >
                <Typography sx={{ p: 1 }}>点击刷新二维码</Typography>
            </Popover>
        </>}
    </Box>;
}

export default QRLogin;