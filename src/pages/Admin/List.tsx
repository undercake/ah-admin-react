/*
 * @Author: Undercake
 * @Date: 2023-05-14 02:47:35
 * @LastEditTime: 2023-10-09 13:57:54
 * @FilePath: /ah-admin-react/src/pages/Admin/List.tsx
 * @Description: Admin list page
 */
import Card from '../../components/Card';
import ListTable, { type editList, type rows, type Actions } from "../../components/ListTable";
import { useEffect, useState } from 'react';
import axios, { type resListData } from '../../utils/Axios';
import { urls } from '../../config';
import type Admin from './Admin';
import AdminEditor from '../../components/EditDialogs/Admin';
import { hasRights } from '../../utils/Rights';

const current_date = new Date();

function AdminList() {
    const [data, setData] = useState<Admin[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [count, setCount] = useState(0);
    const [editId, setEditId] = useState(-1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const rows: rows = {
        full_name: { type: 'string', name: '姓名' },
        user_name: { type: 'string', name: '登录名' },
        mobile: { type: 'string', name: '手机号' },
        group_name: { type: 'string', name: '角色' },
    }

    const getData = () => {
        setLoading(true);
        setError(false);
        const url = urls.admin_list + (page > 0 ? `/page/${page}` : '') + (rowsPerPage > 10 ? `/item/${rowsPerPage}` : '');
        // @ts-ignore
        axios.get(url).then((res: resListData<Admin>) => {
            // @ts-ignore
            setData(res.data.map((d: Admin) => ({ ...d, age: parseInt((current_date - new Date(d.birth_date)) / 31557600000) })));
            setRowsPerPage(res.count_per_page);
            setPage(res.current_page);
            setCount(res.count)
            setLoading(false);
        }).catch(e => {
            setError(true);
            setLoading(false);
        });
    }

    const handleEditorClose = (e: Event, reason: string) => {
        (reason === 'button' || reason === 'submit') && setTimeout(() => {
            setEditId(-1);
            getData();
        }, 300);
        return reason === 'button' || reason === 'submit';
    }

    useEffect(getData, [page, rowsPerPage]);

    const openEdit = (id: number) => {
        setEditId(id);
    }

    const handleDelete = (id: number) => {
        axios.delete(urls.admin_delete + `/id/${id}`).then(getData);
    }

    const handleDeleteList = (ids: number[]) => {
        axios.post(urls.admin_delete, { ids }).then(getData);
    }

    const editList: editList = [
        hasRights('/employee/alter') ? { label: '编辑', color: 'info', onClick: openEdit } : undefined,
        hasRights('/employee/delete') ? { label: '删除', color: 'error', onClick: handleDelete, showConfirm: true } : undefined,
    ];

    const selectedActions: (Actions|undefined)[] = [
        hasRights('/employee/delete') ? { name: '批量删除', color: 'error', showConfirm: true, onClick: handleDeleteList, icon: <i className="fa-solid fa-trash" /> }: undefined,
    ];

    const nonSelectedActions: (Actions|undefined)[] = [
        hasRights('/employee/add') ? { name: '添加', color: 'primary', onClick: () => openEdit(0), icon: <i className='fa-solid fa-plus' /> } : undefined,
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
                loading={loading}
                error={error}
            />
            {editId >= 0 ? <AdminEditor
                handleClose={handleEditorClose}
                id={editId}
            /> : null}
        </Card>);
}

export default AdminList;