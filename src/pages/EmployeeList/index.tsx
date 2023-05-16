/*
 * @Author: Undercake
 * @Date: 2023-05-14 02:47:35
 * @LastEditTime: 2023-05-16 08:19:56
 * @FilePath: /ah-admin-react/src/pages/EmployeeList/index.tsx
 * @Description: employee list page
 */
import Card from '@/components/Card';
import ListTable, { type editList, type rows, type editGroupList } from "@/components/ListTable";
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
    avatar: { type: 'avatar', name: '头像' },
    name: { type: 'string', name: '姓名' },
    gender: { type: 'options', name: '性别', value: { 0: '男', 1: '女' } },
    phone: { type: 'string', name: '手机号' },
    age: { type: 'string', name: '年龄' },
    intro: { type: 'string', name: '简介' },
    note: { type: 'string', name: '备注' },
}

const current_date = new Date();

function EmployeeList() {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [count, setCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openEdit = (id: number) => {
        console.log(id);
    }

    const editList: editList = {
        edit: { label: '编辑', color: 'primary', onClick: openEdit },
        delete: { label: '删除', color: 'error', onClick: openEdit },
    };

    const editGroupList: editGroupList = {
        delete: { label: '删除', color: 'error', onClick: (ids: number[]) => { console.log(ids); } },
    };

    const getData = () => {
        const url = urls.employee_list + (page > 0 ? `/page/${page}` : '') + (rowsPerPage > 10 ? `/item/${rowsPerPage}` : '');
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

    return (
        <Card variant="outlined" sx={{ minWidth: 275 }} className='p-10 dark:bg-gray-900 dark:color dark:text-gray-100'>
            <ListTable
                rows={rows}
                data={data}
                count={count}
                page={page}
                rowsPerPage={rowsPerPage}
                editList={editList}
                editGroupList={editGroupList}
                onChangePage={setPage}
                onChangeRowsPerPage={e => { setPage(1); setRowsPerPage(e) }}
            />
        </Card>);
}

export default EmployeeList;