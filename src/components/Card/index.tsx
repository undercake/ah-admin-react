/*
 * @Author: Undercake
 * @Date: 2023-05-14 07:05:38
 * @LastEditTime: 2023-10-09 16:46:11
 * @FilePath: /ah-admin-react/src/components/Card/index.tsx
 * @Description: rewrite Card component with typescript and tailwindcss
 */
import Ca from "@mui/material/Card";
import { type ReactNode } from "react";

function Card({ children, sx, className='', ...o } : { children: ReactNode, sx?: any, shadow?: 'light'|'normal'|'heavy', className?: string, [key: string]: any }) {
// const shadow = {
//         light:{
//             light: 'rgba(32, 40, 45, 0.08) 0px 2px 14px 0px',
//             normal: 'rgba(32, 40, 45, 0.08) 0px 2px 14px 0px',
//             heavy: 'rgba(32, 40, 45, 0.08) 0px 2px 14px 0px',
//         },
//         dark: {
//             light: 'rgba(32, 40, 45, 0.08) 0px 2px 14px 0px',
//             normal: 'rgba(32, 40, 45, 0.08) 0px 2px 14px 0px',
//             heavy: 'rgba(32, 40, 45, 0.08) 0px 2px 14px 0px',
//         }
// }
    return (<Ca
        sx={{
            borderRadius: '1rem',
            width: '100%',
            border: '1px solid rgb(238, 242, 246)',
            mb: 2,
            boxShadow: 'none',
            '&:hover': {
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);'
            },
            '.dark &': {
                border: '1px solid rgb(32, 40, 45)',
                // boxShadow: 'none',
                '&:hover': {
                    // boxShadow: 'rgba(32, 40, 45, 0.08) 0px 2px 14px 0px'
                },
            },
            ...sx
        }}
        className={"mx-auto bg-white dark:bg-gray-1080 dark:text-gray-50 p-8 shadow-xl " + className}
        {...o}
        >
            {children}
        </Ca>);
}

export default Card;