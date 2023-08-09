/*
 * @Author: Undercake
 * @Date: 2023-07-30 15:39:05
 * @LastEditTime: 2023-08-09 13:23:11
 * @FilePath: /ah-admin-react/src/components/Status/Empty.tsx
 * @Description: 
 */
import Box from '@mui/material/Box';
import type Core from './core.d';
function Empty({
    className = 'text-gray-500 dark:text-gray-200',
    fontSize = '4rem',
}: Core) {
    return (
    <Box
        className={className}
        sx={{
            fontSize: fontSize,
        }}
    >
        <i className="fa-duotone fa-ghost" />
    </Box>);
}

export default Empty;