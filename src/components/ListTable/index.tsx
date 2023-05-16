import { useState, useEffect, type ChangeEvent } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import TableRow from '@mui/material/TableRow';
import Pagination from '@mui/material/Pagination';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Avatar from '@mui/material/Avatar';
import Image from 'next/image';
import Card from '../Card';

import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';

export interface tableData {
    id: number;
    [key: string]: any;
}

export interface editList {
    [key: string]: {
        label: string;
        color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined;
        onClick: (id: number) => void,
        [key: string]: any
    };
}

export interface rows {
    [key: string]: {
        type: 'string' | 'options' | 'avatar' | 'image';
        name: string;
        value?: any;
    }
}

export interface editGroupList {
    [key: string]: {
        label: string;
        color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined;
        onClick: (ids: number[]) => void,
        [key: string]: any
    };
}

interface EnhancedTableProps {
    data: readonly tableData[];
    count: number;
    page: number;
    rows: rows;
    rowsPerPage: number;
    editList: editList;
    editGroupList: editGroupList;
    onChangePage: (newPage: number) => void;
    onChangeRowsPerPage: (count: number) => void;
}

const ComponentByType = ({ type, data, rowVal }: { type: 'string' | 'options' | 'avatar' | 'image'; data: any, rowVal: any }) => {
    switch (type) {
        case 'string':
            return <>{data}</>;
        case 'options':
            return <>{rowVal[data]}</>;
        case 'avatar':
            return <Avatar alt={data} src={data} variant="rounded" />
        case 'image':
            return <Image src={data} alt="" className='w-10 h-10' />;
        default:
            return <></>;
    }
};

export default function ListTable({
    data,
    count,
    page,
    rowsPerPage,
    editList,
    onChangePage,
    onChangeRowsPerPage,
    rows
}: EnhancedTableProps) {
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [currentPage, setCurrentPage] = useState<number>(page);
    const maxPage = count % rowsPerPage == 0 ? count / rowsPerPage : Math.ceil(count / rowsPerPage);

    useEffect(() => {
        onChangePage(page);
        console.log(page);
    });

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = data.map((n) => n.id);
            setSelected(new Set(newSelected));
            return;
        }
        setSelected(new Set());
    };

    const handleSelect = (id: number) => {
        const newSelected = new Set(selected);
        newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
        setSelected(newSelected);
    };

    const isSelected = (id: number) => selected.has(id);
    const length = data.length;
    const inputChangePage = (e: ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        setCurrentPage(val > maxPage ? maxPage : (val < 1 ? 1 : val));
    };

    const tableSize = 'medium';

    return (
        <>
            <Card>
                <EnhancedTableToolbar numSelected={selected.size} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={tableSize}
                    >
                        <EnhancedTableHead
                            numSelected={selected.size}
                            onSelectAllClick={handleSelectAllClick}
                            rowCount={length}
                            titles={rows}
                        />
                        <TableBody>
                            {data.map((row, ind) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${ind}`;
                                const borderBottom = length == ind + 1 ? 'none' : '1px solid rgba(224, 224, 224, 1)';
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                    >
                                        <TableCell sx={{ borderBottom, cursor: 'pointer' }} padding="checkbox" onClick={(event) => handleSelect(row.id)}>
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                            />
                                        </TableCell>
                                        {Object.keys(rows).map((key, index) => {
                                            const { type, value } = rows[key];
                                            const val = row[key] === undefined || row[key] === null ? '' : row[key];
                                            return (
                                                <TableCell
                                                    sx={{ borderBottom, padding: '1rem 0' }}
                                                    className='text-gray-500 dark:text-gray-400'
                                                    component="td"
                                                    scope="row"
                                                    padding="none"
                                                    key={index}
                                                >
                                                    <ComponentByType type={type} data={val} rowVal={value} />
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell
                                            sx={{ borderBottom }}
                                            component="th"
                                            scope="row"
                                            padding="none"
                                        >
                                            <ButtonGroup size="small" aria-label="small button group">
                                                {Object.keys(editList).map((ed_key, ed_index) => {
                                                    const { label, onClick, ...e } = editList[ed_key];
                                                    return (
                                                        <Button
                                                            key={ed_index}
                                                            className='bg-purple-dark hover:bg-purple-lighter text-white font-bold py-2 px-4 rounded'
                                                            onClick={() => onClick(row.id)}
                                                            {...e}
                                                        >
                                                            {label}
                                                        </Button>
                                                    );
                                                })
                                                }
                                            </ButtonGroup>
                                        </TableCell>
                                    </TableRow>);
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
            <div className="flex">
                <div className="flex-initial w-auto">
                    <Pagination count={maxPage} onChange={(e, n) => onChangePage(n)} page={page} color="secondary" />
                </div>
                <div className="flex-none w-14 leading-10 text-right pr-2">
                    每页
                </div>
                <div className="flex-none w-20">
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={rowsPerPage}
                        onChange={(e) => onChangeRowsPerPage(e.target.value as unknown as number)}
                        autoWidth
                        label=""
                        size='small'
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                        <MenuItem value={150}>150</MenuItem>
                        <MenuItem value={200}>200</MenuItem>
                    </Select>
                </div>
                <div className="flex-initial w-10 leading-10">
                    条
                </div>
                <div className="flex-initial w-20 leading-10 text-right pr-2">
                    转到第
                </div>
                <div className="flex-initial w-20">
                    <TextField type="number" value={currentPage} onChange={inputChangePage} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 1, max: maxPage}} size='small' onKeyDown={console.log} />
                </div>
                <div className="flex-initial w-20 leading-10 pl-2">
                    页
                </div>
                <div className="flex-initial w-20 leading-10 pl-2">
                    共{count}条
                </div>
            </div>
        </>
    );
}