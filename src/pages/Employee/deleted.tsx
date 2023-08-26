/*
 * @Author: Undercake
 * @Date: 2023-05-14 02:47:35
 * @LastEditTime: 2023-08-22 17:05:14
 * @FilePath: /ah-admin-react-from-next/src/pages/Employee/deleted.tsx
 * @Description: employee list page
 */
import Card from '../../components/Card';
import ListTable, { type editList, type rows, type Actions } from "../../components/ListTable";
import { useEffect, useState } from 'react';
import axios, { type resListData } from '../../utils/Axios';
import { urls } from '../../config';
import type Employee from './Employee.d';

const rows: rows = {
    FullName: { type: 'string', name: '姓名' },
    Sex: { type: 'string', name: '性别'},
    Department: { type: 'string', name: '部门' },
    Tel: { type: 'string', name: '手机号' },
    Workday: { type: 'string', name: '参工日期' },
    Comment: { type: 'string', name: '说明' },
    BlameRecord: { type: 'string', name: '过失记录' },
}

const current_date = new Date();

function EmployeeList() {
    const [data, setData] = useState<Employee[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [count, setCount] = useState(0);

    const getData = () => {
        const url = urls.employee_deleted + (page > 0 ? `/page/${page}` : '') + (rowsPerPage > 10 ? `/item/${rowsPerPage}` : '');
        // @ts-ignore
        axios.get(url).then((res: resListData<Employee>) => {
            // @ts-ignore
            setData(res.data.map((d: Employee) => ({ ...d, age: parseInt((current_date - new Date(d.birth_date)) / 31557600000) })));
            setRowsPerPage(res.count_per_page);
            setPage(res.current_page);
            setCount(res.count)
            console.log(res);
        });
    }

    useEffect(getData, [page, rowsPerPage]);

    const handleDelete = (id: number) => {
        axios.delete(urls.employee_deep_del + `/id/${id}`).then(getData);
    }

    const handleDeleteList = (ids: number[]) => {
        axios.post(urls.employee_deep_del, { ids }).then(getData);
    }

    const handleRec = (id: number) => {
        axios.get(urls.employee_rec + `/id/${id}`).then(getData);
    }

    const handleRecList = (ids: number[]) => {
        axios.post(urls.employee_rec, { ids }).then(getData);
    }

    const editList: editList = [
        { label: '删除', color: 'error', onClick: handleDelete, showConfirm: true },
        { label: '恢复', color: 'success', onClick: handleRec },
    ];

    const selectedActions: Actions[] = [
        { name: '批量删除', color: 'error', showConfirm: true, onClick: handleDeleteList, icon: <i className="fa-solid fa-trash" /> },
        { name: '批量恢复', color: 'success', showConfirm: true, onClick: handleRecList, icon: <i className="fa-solid fa-rotate-right" /> },
    ];

    const nonSelectedActions: Actions[] = [
        { name: '刷新', color: 'primary', onClick: () => getData(), icon: <i className="fa-solid fa-arrows-rotate" /> },
    ];

    return (
        <Card variant="outlined" sx={{ minWidth: 275 }} className='p-10 dark:bg-gray-1080 dark:color dark:text-gray-100'>
            <ListTable
                rows={rows}
                data={data}
                count={count}
                page={page}
                rowsPerPage={rowsPerPage}
                editList={editList}
                onChangePage={setPage}
                onChangeRowsPerPage={e => { setPage(1); setRowsPerPage(e) }}
                selectedActions={selectedActions}
                nonSelectedActions={nonSelectedActions}
            />
        </Card>);
}

export default EmployeeList;