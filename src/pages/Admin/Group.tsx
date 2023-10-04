/*
 * @Author: Undercake
 * @Date: 2023-08-14 17:18:11
 * @LastEditTime: 2023-10-04 16:54:17
 * @FilePath: /ah-admin-react/src/pages/Admin/Group.tsx
 * @Description: 
 */
import Card from '../../components/Card';
import ListTable, { type editList, type rows, type Actions } from "../../components/ListTable";
import { useEffect, useState } from 'react';
import axios, { type resListData } from '../../utils/Axios';
import { urls } from '../../config';

interface Group {
    id            : number;
    rights        : string;
    name          : string;
    group_describe: string;
}

const rows: rows = {
    name: { type: 'string', name: '组名' },
    rights: { type: 'others', name: '权限', value: (e:string) => `${e.split(',').length}项` },
}

function Group() {
    const [data, setData] = useState<Group[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [count, setCount] = useState(0);
    const [editId, setEditId] = useState(-1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const getData = () => {
        setLoading(true);
        setError(false);
        const url = urls.group_list + (page > 0 ? `/page/${page}` : '') + (rowsPerPage > 10 ? `/item/${rowsPerPage}` : '');
        // @ts-ignore
        axios.get(url).then((res: resListData<Group>) => {
            console.log(res);
            // @ts-ignore
            setData(res.data);
            setRowsPerPage(res.count_per_page);
            setPage(res.current_page);
            setCount(res.count)
            setLoading(false);
        }).catch(e => {
            console.log(e)
            setError(true);
            setLoading(false);
        });
    }

    useEffect(getData, [page, rowsPerPage]);

    const handleDelete = (id: number) => {
        axios.delete(urls.admin_delete + `/id/${id}`).then(getData);
    }

    const handleDeleteList = (ids: number[]) => {
        axios.post(urls.admin_delete, { ids }).then(getData);
    }

    const openEdit = (id: number) => {
        setEditId(id);
    }

    const editList: editList = [
        { label: '编辑', color: 'info', onClick: openEdit },
        { label: '删除', color: 'error', onClick: handleDelete, showConfirm: true },
    ];

    const selectedActions: Actions[] = [
        { name: '批量删除', color: 'error', showConfirm: true, onClick: handleDeleteList, icon: <i className="fa-solid fa-trash" /> },
    ];

    const nonSelectedActions: Actions[] = [
        { name: '添加', color: 'primary', onClick: () => openEdit(0), icon: <i className='fa-solid fa-plus' /> },
        { name: '刷新', color: 'primary', onClick: () => getData(), icon: <i className="fa-solid fa-arrows-rotate" /> },
    ];

    return <Card variant="outlined" sx={{ minWidth: 275 }} className='p-10 dark:bg-gray-1080 dark:color dark:text-gray-100'>
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
    </Card>;
}

export default Group;