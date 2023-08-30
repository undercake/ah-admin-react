/*
 * @Author: Undercake
 * @Date: 2023-08-30 17:18:35
 * @LastEditTime: 2023-08-30 17:39:37
 * @FilePath: /ah-admin-react/src/components/Login/QRLogin.tsx
 * @Description: 
 */
import { Box } from "@mui/material";
import { urls } from "../../config";

function QRLogin() {
    return ( <Box>
        <img src={urls.login_qr} style={{width: '20rem'}} alt='' />
    </Box> );
}

export default QRLogin;