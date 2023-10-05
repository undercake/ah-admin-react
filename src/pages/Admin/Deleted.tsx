  /*
 * @Author      : Undercake
 * @Date        : 2023-05-14 02: 47: 35
 * @LastEditTime: 2023-10-05 16:28:51
 * @FilePath: /ah-admin-react/src/pages/Admin/Deleted.tsx
 * @Description : Customer list page
 */
import Card from '../../components/Card';
import ListTable, { type editList, type rows, type Actions } from "../../components/ListTable";
import { useEffect, useState } from 'react';
import axios, { type resListData } from '../../utils/Axios';
import { urls } from '../../config';
import type Admin from './Admin';

const rows: rows = {
    full_name  : { type: 'string', name: '姓名' },
    phone : { type: 'string', name: '手机号' },
    note  : { type: 'string', name: '备注' },
    deleted: { type: 'others', name: '删除时间', value: (v: string) => new Date(v).toLocaleString() },
}

const current_date = new Date();

function CustomerList() {
    const [data, setData]               = useState<Admin[]>([]);
    const [page, setPage]               = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [count, setCount]             = useState(0);

    const getData = () => {
        const url = urls.admin_deleted + (page > 0 ? `/page/${page}` : '') + (rowsPerPage > 10 ? `/item/${rowsPerPage}` : '');
          // @ts-ignore
        axios.get(url).then((res: resListData<Admin>) => {
              // @ts-ignore
            setData(res.data.map((d: Admin) => ({ ...d, age: parseInt((current_date - new Date(d.birth_date)) / 31557600000) })));
            setRowsPerPage(res.count_per_page);
            setPage(res.current_page);
            setCount(res.count)
        });
    }

    useEffect(getData, [page, rowsPerPage]);

    const handleDelete = (id: number) => {
        axios.delete(urls.admin_deep_del + `/id/${id}`).then(getData);
    }

    const handleDeleteList = (ids: number[]) => {
        axios.post(urls.admin_deep_del, { ids }).then(getData);
    }

    const handleRec = (id: number) => {
        axios.post(urls.admin_rec + `/id/${id}`).then(getData);
    }

    const handleRecList = (ids: number[]) => {
        axios.post(urls.admin_rec, { ids }).then(getData);
    }

    const editList: editList = [
        { label: '删除', color: 'error', onClick: handleDelete, showConfirm: true, comment: <span style={{fontWeight: 'bold', color: 'red'}}>警告：删除后不可恢复！</span> },
        { label: '恢复', color: 'success', onClick: handleRec, showConfirm: true },
    ];

    const selectedActions: Actions[] = [
        {
            name: '彻底删除',
            color: 'error',
            showConfirm: true,
            onClick: handleDeleteList,
            icon: <i className="fa-solid fa-trash" />,
            comment:<span style={{fontWeight: 'bold', color: 'red'}}>删除后不可恢复！</span>
        },
        {
            name: '批量恢复',
            color: 'success',
            showConfirm: true,
            onClick: handleRecList,
            icon: <i className="fa-solid fa-rotate-right" />
        },
    ];

    const nonSelectedActions: Actions[] = [
        { name: '刷新', color: 'primary', onClick: () => getData(), icon: <i className="fa-solid fa-arrows-rotate" /> },
    ];

    return (
        <Card variant = "outlined" sx = {{ minWidth: 275 }} className = 'p-10 dark:bg-gray-1080 dark:color dark:text-gray-100'>
            <ListTable
                rows                = {rows}
                data                = {data}
                count               = {count}
                page                = {page}
                rowsPerPage         = {rowsPerPage}
                editList            = {editList}
                onChangePage        = {setPage}
                onChangeRowsPerPage = {e => { setPage(1); setRowsPerPage(e) }}
                selectedActions     = {selectedActions}
                nonSelectedActions  = {nonSelectedActions}
            />
        </Card>);
}

export default CustomerList;