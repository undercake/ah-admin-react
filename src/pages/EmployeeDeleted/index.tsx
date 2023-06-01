/*
 * @Author: Undercake
 * @Date: 2023-05-14 02:47:35
 * @LastEditTime: 2023-06-01 06:10:10
 * @FilePath: /ah-admin-react/src/pages/EmployeeDeleted/index.tsx
 * @Description: employee list page
 */
import Card from '@/components/Card';
import ListTable, { type editList, type rows, type Actions } from "@/components/ListTable";
import { useEffect, useState } from 'react';
import axios, { type resListData } from '@/utils/Axios';
import { urls } from '@/config';

interface Employee {
    id: number;
    avatar: string;
    name: string;
    gender: number;
    phone: string;
    birth_date: string;
    intro: string;
    note: string;
    address: string;
    create_time: string;
    deleted: number;
    grade: number;
    id_code: string;
    img: string;
    origin: string;
    pinyin: string;
    pym: string;
    work_date: string;
    workee: string;
    wx_id: number
}

const rows: rows = {
    name: { type: 'string', name: '姓名' },
    gender: { type: 'options', name: '性别', value: { 0: '男', 1: '女' } },
    phone: { type: 'string', name: '手机号' },
    age: { type: 'string', name: '年龄' },
    note: { type: 'string', name: '备注' },
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
        <Card variant="outlined" sx={{ minWidth: 275 }} className='p-10 dark:bg-gray-900 dark:color dark:text-gray-100'>
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