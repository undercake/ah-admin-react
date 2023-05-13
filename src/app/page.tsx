'use client';
/*
 * @Author: Undercake
 * @Date: 2023-04-23 17:02:57
 * @LastEditTime: 2023-05-07 11:16:31
 * @FilePath: /ah-admin-react/src/app/page.tsx
 * @Description: page
 */
import CircularProgress from '@mui/material/CircularProgress';
import Layout from '@/Layout';
import 'tailwindcss/tailwind.css';
import '../styles/globals.scss';

const loading = (<div style={{margin:'auto',marginTop:'1rem', textAlign:'center'}}>
    <CircularProgress color="secondary" />
</div>);

export default function Home() {
    return (
        <>
            <Layout />
        </>
    );
}
