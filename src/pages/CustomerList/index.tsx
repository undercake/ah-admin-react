  /*
* @Author      : Undercake
* @Date        : 2023-05-14 02: 47: 35
 * @LastEditTime: 2023-06-01 08:22:18
 * @FilePath: /ah-admin-react/src/pages/CustomerList/index.tsx
* @Description : employee list page
*/
import Card from '@/components/Card';
import ListTable, { type editList, type rows, type editGroupList, type Actions } from "@/components/ListTable";
import { useEffect, useState } from 'react';
import axios, { type resListData } from '@/utils/Axios';
import ExportExcel from '@/utils/ExportExcel';
import { urls } from '@/config';
  // import EmployeeEditor from '@/components/EditDialogs/Employee';

interface Customer {
    Address          : string;
    BeginDate        : string;
    BlackFlag        : 0 | 1;
    ClientInfoOID    : string;
    CreateDate       : string;
    DelFlag          : number
    EndDate          : string;
    F1               : 0 | 1 | 2                       // 0普通 1VIP 2重要领导
    FullName         : string;
    HouseArea        : string;
    ItemCode         : string;
    LastModiDate     : string;
    NormalServiceTime: string;
    SpecialNeed      : string;
    Tel1             : string;
    Tel2             : string;
    Tel3             : string;
    TotalCount       : number;
    TotalMoney       : string
    UserType         : 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;  //7半月卡6月卡5季卡4年卡3包做2包周1钟点0暂无
    fRegion          : string
    id               : number;
    pym              : string
}

const rows: rows = {
    FullName  : { type: 'string', name: '顾客姓名' },
    HouseArea: { type: 'string', name: '住房面积' },
    Tel1:{type: 'string',name: ''},
    Tel2:{type: 'string',name: '电话'},
    Tel3:{type: 'string',name: ''},
    Address: { type: 'string', name: '地址' },
    BeginDate: { type: 'string', name: '开始时间' },
    EndDate: { type: 'string', name: '到期时间' },
}

const current_date = new Date();

function CustomerList() {
    const [data, setData]               = useState<Customer[]>([]);
    const [page, setPage]               = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [count, setCount]             = useState(0);
    const [editId, setEditId]           = useState(-1);
    const [searchStr, setSearchStr]     = useState('');

    const getData = () => {
        const url = urls.customer_list + (page > 0 ? `/page/${page}` : '') + (rowsPerPage > 10 ? `/item/${rowsPerPage}` : '');
          // @ts-ignore
        const $axios = searchStr.trim() == "" ? axios.get(url) : axios.post(url, { search: searchStr });
          // @ts-ignore
        $axios.then((res: resListData<Customer>) => {
              // @ts-ignore
            setData(res.data.map((d: Customer) => ({ ...d, age: parseInt((current_date - new Date(d.birth_date)) / 31557600000) })));
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
        axios.delete(urls.customer_delete + `/id/${id}`).then(getData);
    }

    const handleDeleteList = (ids: number[]) => {
        axios.post(urls.customer_delete, { ids }).then(getData);
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
        <Card variant = "outlined" sx = {{ minWidth: 275 }} className = 'p-10 dark:bg-gray-900 dark:color dark:text-gray-100'>
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
            />
            {/* {editId >= 0 ? <CustomerEditor
                handleClose = {handleEditorClose}
                id          = {editId}
            /> : null} */}
        </Card>);
}

export default CustomerList;