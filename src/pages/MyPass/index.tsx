import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Info from './info';
import Pass from './pass';

function MyPass() {
    return (
        <>
            <Card variant="outlined" sx={{ minWidth: 275 }} className='p-10 dark:bg-gray-1080 dark:color dark:text-gray-100'>
                <Typography variant="h5" component="div">
                    修改登录信息
                </Typography>
                <Info className="w-96" />
            </Card>
            <Card variant="outlined" sx={{ minWidth: 275, marginTop: '1rem' }} className='p-10 dark:bg-gray-1080 dark:color dark:text-gray-100'>
                <Typography variant="h5" component="div">
                    修改密码
                </Typography>
                <Pass className="w-96" />
            </Card>
        </>
    );
}

export default MyPass;