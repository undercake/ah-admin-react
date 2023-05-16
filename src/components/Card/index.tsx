/*
 * @Author: Undercake
 * @Date: 2023-05-14 07:05:38
 * @LastEditTime: 2023-05-15 09:13:12
 * @FilePath: /ah-admin-react/src/components/Card/index.tsx
 * @Description: rewrite Card component with typescript and tailwindcss
 */
import Ca from "@mui/material/Card";

function Card(props: any) {
    const { children, sx, className='', ...o } = props;
    return (<Ca
        sx={{...sx, borderRadius: '1rem',width: '100%', border: '1px solid rgb(238, 242, 246)', mb: 2, boxShadow: 'none', '&:hover': { boxShadow: 'rgba(32, 40, 45, 0.08) 0px 2px 14px 0px' } }}
        className={"mx-auto bg-white dark:bg-gray-800 dark:text-gray-50 p-8 " + className}
        {...o}
        >
            {children}
        </Ca>);
}

export default Card;