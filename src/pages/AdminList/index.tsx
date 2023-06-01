/*
 * @Author: Undercake
 * @Date: 2023-05-14 02:47:35
 * @LastEditTime: 2023-06-01 09:33:35
 * @FilePath: /ah-admin-react/src/pages/AdminList/index.tsx
 * @Description: Admin list page
 */
import Card from '@/components/Card';
import ListTable, { type editList, type rows, type editGroupList, type Actions } from "@/components/ListTable";
import { useEffect, useState } from 'react';
import axios, { type resListData } from '@/utils/Axios';
import ExportExcel from '@/utils/ExportExcel';
import { urls } from '@/config';
// import AdminEditor from '@/components/EditDialogs/Admin';

interface Admin {
    full_name : string;
    group_name: string;
    id        : number;
    mobile    : string;
    user_group: number;
    user_name : string;
}

const rows: rows = {
    full_name: { type: 'string', name: '姓名' },
    user_name: { type: 'string', name: '登录名' },
    // gender: { type: 'options', name: '性别', value: { 0: '男', 1: '女' } },
    mobile: { type: 'string', name: '手机号' },
    // age: { type: 'string', name: '年龄' },
    // intro: { type: 'string', name: '简介' },
    // note: { type: 'string', name: '备注' },
}

const current_date = new Date();

function AdminList() {
    const [data, setData] = useState<Admin[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [count, setCount] = useState(0);
    const [editId, setEditId] = useState(-1);
    const [searchStr, setSearchStr] = useState('');

    const getData = () => {
        const url = urls.admin_list + (page > 0 ? `/page/${page}` : '') + (rowsPerPage > 10 ? `/item/${rowsPerPage}` : '');
        // @ts-ignore
        const $axios = searchStr.trim() == "" ? axios.get(url) : axios.post(url, { search: searchStr });
        // @ts-ignore
        $axios.then((res: resListData<Admin>) => {
            // @ts-ignore
            setData(res.data.map((d: Admin) => ({ ...d, age: parseInt((current_date - new Date(d.birth_date)) / 31557600000) })));
            setRowsPerPage(res.count_per_page);
            setPage(res.current_page);
            setCount(res.count)
            console.log(res);
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
        axios.delete(urls.admin_delete + `/id/${id}`).then(getData);
    }

    const handleDeleteList = (ids: number[]) => {
        axios.post(urls.admin_delete, { ids }).then(getData);
    }

    const handleExportExcel = (ids: number[]) => {
        console.log(ids);
        const exportData: (string | number)[][] = [];
        data.forEach(({ id, name, phone, id_code, birth_date, address, workee, note, gender, intro }) => {
            if (ids.includes(id))
                exportData.push([id, name, ["男", "女"][gender], phone, address, id_code, birth_date == '0000-00-00' ? '' : birth_date, intro, workee, note]);
        });
        exportData.unshift(['ID', '姓名', '性别', '电话', '地址', '身份证号码', '出生年月', '描述', '工作内容', '备注']);
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
                showSearch
                onSearch={handleSearch}
                searchStr={searchStr}
                searchLabel='搜索员工'
            />
            {/* {editId >= 0 ? <AdminEditor
                handleClose={handleEditorClose}
                id={editId}
            /> : null} */}
        </Card>);
}

export default AdminList;