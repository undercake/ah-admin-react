/*
 * @Author: Undercake
 * @Date: 2023-08-09 13:46:25
 * @LastEditTime: 2023-08-22 16:58:04
 * @FilePath: /ah-admin-react-from-next/src/components/DetailDialogs/Customer/HistoryList.tsx
 * @Description: customer history list
 */
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import IconButton  from '@mui/material/IconButton';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Card from '../../../components/Card';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import ScrollView from '../../../components/ScrollView';
import {type HistoryData} from './index'

function HisList({
    list,
    page,
    setPage,
    pageError,
    pageLoading,
    total = 0,
    ...e
} : {
    list: HistoryData[],
    page: number,
    setPage: any,
    pageError: boolean,
    pageLoading: boolean,
    [key: string]: any
}) {
    return <Card {...e}>
        <Table sx={{'.dark & .MuiTableCell-root':{color: '#fff'}}}>
            <TableHead>
                <TableRow>
                    <TableCell sx={{textAlign: 'center', fontSize: '1.25rem', fontWeight: 'bold'}} colSpan={5}>
                        服务历史
                    </TableCell>
                </TableRow>
                <TableRow>
                    {[
                        {width:200, content: '服务时间'},
                        {width:200, content: '服务内容'},
                        {width:700, content: '说明'},
                        {width:200, content: '任务状态'},
                        {width:200, content: '接线时间'}
                        ].map((item, index) => <TableCell width={item.width} key={index}>{item.content}</TableCell>)}
                </TableRow>
            </TableHead>
        </Table>
        <ScrollView sx={{height: '20rem'}}>
            <Table sx={{'.dark & .MuiTableCell-root':{color: '#fff'}}}>
                <TableBody>
                    {list.map((item: HistoryData, index) => <TableRow key={index}>
                        <TableCell>{item.NeedServiceTime}</TableCell>
                        <TableCell>{item.ServiceContentName}</TableCell>
                        <TableCell>{item.Comment}</TableCell>
                        <TableCell>{({0:'空闲（待分配）',100: '已经分配（待派单）',200:'执行完毕'})[item.TaskStatus]}</TableCell>
                        <TableCell>{item.PhoneDate}</TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
        </ScrollView>
        <Box component="div" sx={{marginTop: '1rem'}}>
            <IconButton sx={{'.dark &': {color:'#fff'}, '.dark &.Mui-disabled': {color: '#666'}}} disabled={page <= 1} className='border rounded' onClick={()=>setPage(page - 1)}><i className="fa-solid fa-angle-left" /></IconButton>
            <IconButton sx={{'.dark &': {color:'#fff'}, '.dark &.Mui-disabled': {color: '#666'}}} disabled={page > total / 20} className='border rounded' onClick={()=>setPage(page + 1)}><i className="fa-solid fa-angle-right" /></IconButton>
        </Box>
    </Card>;
}

export default HisList;