/*
 * @Author: Undercake
 * @Date: 2023-05-14 02:47:35
 * @LastEditTime: 2023-08-15 10:41:46
 * @FilePath: /ah-admin-react/src/pages/Employee/list.tsx
 * @Description: employee list page
 */
import Card from '@/components/Card';
import ListTable, { type editList, type rows, type editGroupList, type Actions } from "@/components/ListTable";
import { useEffect, useState } from 'react';
import axios, { type resListData } from '@/utils/Axios';
import ExportExcel from '@/utils/ExportExcel';
import { urls } from '@/config';
import EmployeeEditor from '@/components/EditDialogs/Employee';
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
    const [editId, setEditId] = useState(-1);
    const [searchStr, setSearchStr] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const getData = () => {
        setLoading(true);
        setError(false);
        const url = urls.employee_list + (page > 0 ? `/page/${page}` : '') + (rowsPerPage > 10 ? `/item/${rowsPerPage}` : '');
        // @ts-ignore
        const $axios = searchStr.trim() == "" ? axios.get(url) : axios.post(url, { search: searchStr });
        // @ts-ignore
        $axios.then((res: resListData<Employee>) => {
            // @ts-ignore
            setData(res.data.map((d: Employee) => ({ ...d, age: parseInt((current_date - new Date(d.birth_date)) / 31557600000) })));
            setRowsPerPage(res.count_per_page);
            setPage(res.current_page);
            setCount(res.count)
            console.log(res);
        }).catch((e) => {
            console.log(e);
            setError(true);
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleEditorClose = (e: Event, reason: string) => {
        console.log(e, reason);
        (reason == 'button' || reason == 'submit') && setTimeout(() => {
            setEditId(-1);
        }, 300);
        return reason == 'button' || reason == 'submit';
    }

    useEffect(getData, [page, rowsPerPage, searchStr]);

    const openEdit = (id: number) => {
        console.log(id);
        setEditId(id);
    }

    const handleDelete = (id: number) => {
        axios.delete(urls.employee_delete + `/id/${id}`).then(getData);
    }

    const handleDeleteList = (ids: number[]) => {
        axios.post(urls.employee_delete, { ids }).then(getData);
    }

    const handleExportExcel = (ids: number[]) => {
        console.log(ids);
        const exportData: (string | number)[][] = [];
        data.forEach(({ id, FullName, Tel, IDCode, Birthday, Address, Department, Comment, Sex }) => {
            if (ids.includes(id))
                exportData.push([id, FullName, Sex, Tel, Address, IDCode, Birthday == '0000-00-00' ? '' : Birthday, Comment, Department, Comment]);
        });
        exportData.unshift(['ID', '姓名', '性别', '电话', '地址', '身份证号码', '出生日期', '说明', '部门', '说明']);
        ExportExcel(exportData, `员工列表-${page}.xlsx`);
    }

    const handleSearch = (e: string) => {
        setSearchStr(e);
        setPage(1);
    }

    const editList: editList = [
        { label: '编辑', color: 'info', onClick: openEdit },
        { label: '删除', color: 'error', onClick: handleDelete, showConfirm: true },
    ];

    const selectedActions: Actions[] = [
        { name: '导出Excel', color: 'primary', onClick: handleExportExcel, icon: <i className="fa fa-solid fa-file-export" /> },
        { name: '批量删除', color: 'error', showConfirm: true, onClick: handleDeleteList, icon: <i className="fa-solid fa-trash" /> },
    ];

    const nonSelectedActions: Actions[] = [
        { name: '添加', color: 'primary', onClick: () => openEdit(0), icon: <i className='fa-solid fa-plus' /> },
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
                showSearch
                onSearch={handleSearch}
                searchStr={searchStr}
                searchLabel='搜索员工'
                loading={loading}
                error={error}
            />
            {editId >= 0 ? <EmployeeEditor
                handleClose={handleEditorClose}
                id={editId}
            /> : null}
        </Card>);
}

export default EmployeeList;