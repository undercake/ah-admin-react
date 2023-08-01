/*
 * @Author: Undercake
 * @Date: 2023-07-30 15:39:05
 * @LastEditTime: 2023-07-30 17:36:21
 * @FilePath: /ah-admin-react/src/components/Status/Error.tsx
 * @Description: 
 */
import Box from '@mui/material/Box';
import type Core from './core.d';
function Error({
    className = '',
    fontSize = '1rem',
}: Core) {
    return (
    <Box
        className={className}
        sx={{
            fontSize: fontSize,
        }}
    >
        <i className="fa-duotone fa-circle-exclamation" />
    </Box>);
}

export default Error;