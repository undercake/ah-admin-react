  /*
* @Author      : Undercake
* @Date        : 2023-05-14 02: 47: 35
 * @LastEditTime: 2023-08-19 16:10:54
 * @FilePath: /ah-admin-react/src/pages/Customer/lists.tsx
* @Description : employee list page
*/
import Card from '@/components/Card';
import ListTable, { type editList, type rows, type editGroupList, type Actions } from "@/components/ListTable";
import { useEffect, useState } from 'react';
import axios, { type resListData } from '@/utils/Axios';
import ExportExcel from '@/utils/ExportExcel';
import { urls } from '@/config';
import type Customer from './Customer'
import CustomerDetail from '@/components/DetailDialogs/Customer';

const rows: rows = {
    FullName  : { type: 'string', name: '顾客姓名' },
    HouseArea : { type: 'string', name: '住房面积' },
    Tel1      : {type: 'string',name: ''},
    Tel2      : {type: 'string',name: '电话'},
    Tel3      : {type: 'string',name: ''},
    Address   : { type: 'string', name: '地址' },
    UserType  : { type: 'options', name: '服务类型', value: ['暂无', '钟点', '包周', '包做', '年卡', '季卡', '月卡', '半月卡'] },
    BeginDate : { type: 'string', name: '开始时间' },
    EndDate   : { type: 'string', name: '到期时间' },
    CreateDate: { type: 'string', name: '录入时间' },
}

const current_date = new Date();

function List({type = 0} : {type?: number}) {
    const [data, setData]               = useState<Customer[]>([]);
    const [page, setPage]               = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [count, setCount]             = useState(0);
    const [editId, setEditId]           = useState(-1);
    const [detailId, setDetailId]       = useState(-1);
    const [searchStr, setSearchStr]     = useState('');
    const [Loading, setLoading]         = useState(true);
    const [error, setError]             = useState(false);

    const getData = () => {
        setLoading(true);
        setError(false);
        const cus_urls:string[] = [
            urls.customer_list,
            urls.customer_other,
            urls.customer_past
        ];
        console.log(cus_urls[type])
        const url = cus_urls[type] + (page > 0 ? `/page/${page}` : '') + (rowsPerPage > 10 ? `/item/${rowsPerPage}` : '');
          // @ts-ignore
        const $axios = searchStr.trim() == "" ? axios.get(url) : axios.post(urls.customer_search + (page > 0 ? `/page/${page}` : '') + (rowsPerPage > 10 ? `/item/${rowsPerPage}` : ''), { search: searchStr });
          // @ts-ignore
        $axios.then((res: resListData<Customer>) => {
              // @ts-ignore
            setData(res.data.map((d: Customer) => ({ ...d, age: parseInt((current_date - new Date(d.birth_date)) / 31557600000) })));
            setRowsPerPage(res.count_per_page);
            setPage(res.current_page);
            setCount(res.count)
            console.log(res);
            setLoading(false);
            setError(false);
        }).catch((e) => {
            console.log(e);
            setLoading(false);
            setError(true);
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

    const openDetail = (id: number) => {
        console.log(id);
        setDetailId(id);
    }

    const handleDelete = (id: number) => {
        axios.delete(urls.customer_delete + `/id/${id}`).then(getData);
    }

    const handleDeleteList = (ids: number[]) => {
        axios.post(urls.customer_delete, { ids }).then(getData);
    }

    const handleExportExcel = (ids: number[]) => {
        console.log(ids);
        const exportData: (string | number)[][] = [];
        data.forEach(({id, FullName, Tel1, Tel2, Tel3, TotalCount, HouseArea, TotalMoney, UserType, Address, BeginDate, EndDate, F1, CreateDate }) => {
            console.log({id, FullName, Tel1, Tel2, Tel3, TotalCount, HouseArea, TotalMoney, UserType, Address, BeginDate, EndDate, F1, CreateDate })
            const baseData:any[] = [
                    FullName,
                    `${Tel1} ${Tel2} ${Tel3}`,
                    Address,
                    HouseArea,
                    ['普通客户', 'VIP', '重要领导'][F1]
                ];
            if(type !== 1) {
                baseData.push(TotalCount,
                    TotalMoney,
                    BeginDate && (BeginDate.startsWith('0000') || BeginDate.startsWith('2222')) ? '' : BeginDate,
                    EndDate && (EndDate.startsWith('0000') || EndDate.startsWith('2222')) ? '' : EndDate,
                    ['暂无', '钟点', '包周', '包做', '年卡', '季卡', '月卡', '半月卡'][UserType]
                );
            }
            baseData.push(CreateDate);
            if (ids.includes(id))
                exportData.push(baseData);
        });
        const baseTitle = ['姓名', '电话', '地址', '面积', '客户级别'];
        type !== 1 && baseTitle.push('剩余次数', '余额', '开始时间', '到期时间', '客户类型');
        baseTitle.push('录入日期');
        exportData.unshift(baseTitle);
        ExportExcel(exportData, `${['合同户', '散户', '过期合同户'][type]}列表-${page}.xlsx`);
    }

    const handleSearch = (e: string) => {
        setSearchStr(e);
        setPage(1);
    }

    const editList: editList = [
        { label: '详情', color: 'info', onClick: setDetailId },
        // { label: '编辑', color: 'info', onClick: setEditId },
        // { label: '删除', color: 'error', onClick: handleDelete, showConfirm: true },
    ];

    const selectedActions: Actions[] = [
        { name: '导出Excel', color: 'primary', onClick: handleExportExcel, icon: <i className="fa fa-solid fa-file-export" /> },
        // { name: '批量删除', color: 'error', showConfirm: true, onClick: handleDeleteList, icon: <i className="fa-solid fa-trash" /> },
    ];

    const nonSelectedActions: Actions[] = [
        // { name: '添加', color: 'primary', onClick: () => openEdit(0), icon: <i className='fa-solid fa-plus' /> },
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
                showSearch
                onSearch    = {handleSearch}
                searchStr   = {searchStr}
                searchLabel = '搜索客户'
                loading     = {Loading}
                error       = {error}
            />
            {/* {editId >= 0 ? <CustomerEditor
                handleClose = {handleEditorClose}
                id          = {editId}
            /> : null} */}
            {detailId > 0 ? <CustomerDetail
                handleClose = {()=>{setTimeout(()=>{setDetailId(0);}, 300); return true}}
                id          = {detailId}
            /> : null}
        </Card>);
}

export default List;