/*
 * @Author: Undercake
 * @Date: 2023-08-09 13:46:25
 * @LastEditTime: 2023-08-09 14:58:43
 * @FilePath: /ah-admin-react/src/components/DetailDialogs/Customer/HistoryList.tsx
 * @Description: customer history list
 */
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import type HistoryList from './index'

function HisList({
    list,
    page,
    setPage,
    pageError,
    pageLoading
} : {
    list: HistoryList[],
    page: number,
    setPage: any,
    pageError: boolean,
    pageLoading: boolean
}) {
    return <Table>
        <TableHead>
            <TableRow>
                {['服务时间', '服务内容', '说明', '任务状态', '接线时间'].map((item, index) => <TableCell key={index}>{item}</TableCell>)}
            </TableRow>
        </TableHead>
        <TableBody>
            {list.map((item, index) => <TableRow key={index}>
                <TableCell>{item.NeedServiceTime}</TableCell>
                <TableCell>{item.ServiceContentName}</TableCell>
                <TableCell>{item.Comment}</TableCell>
                <TableCell>{item.TaskStatus}</TableCell>
                <TableCell>{item.PhoneDate}</TableCell>
            </TableRow>)}
        </TableBody>
    </Table>;
}

export default HisList;