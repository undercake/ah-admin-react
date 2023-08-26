import { useState, useEffect, Fragment, type ChangeEvent, MouseEventHandler } from 'react';
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
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
// import Image from 'next/image';
import Card from '../../components/Card';
import Loading from '../../components/Status/Loading';
import Empty from '../../components/Status/Empty';
import Error from '../../components/Status/Error';

import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar, { type Actions as Action } from './EnhancedTableToolbar';

export interface Actions extends Action { };
export interface tableData {
    id           : number;
    [key: string]: any;
}

export type editList =
    {
        label         : string,
        color         : 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined,
        showConfirm  ?: boolean,
        onClick       : (id: number) => void,
        [key: string] : any
    }[];

export interface itemInRows {
        type  : 'string' | 'options' | 'avatar' | 'image';
        name  : string;
        value?: any;
}

export interface rows {
    [key: string]: itemInRows;
}

export interface editGroupList {
    [key: string]: {
        label        : string;
        color        : 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined;
        onClick      : (ids: number[]) => void,
        [key: string]: any
    };
}

interface EnhancedTableProps {
    data                : readonly tableData[];
    count               : number;
    page                : number;
    rows                : rows;
    rowsPerPage         : number;
    editList            : editList;
    onChangePage        : (newPage: number) => void;
    onChangeRowsPerPage : (count: number) => void;
    selectedActions    ?: Actions[];
    nonSelectedActions ?: Actions[];
    showSearch         ?: boolean;
    onSearch           ?: (s: string) => void;
    searchLabel        ?: string;
    searchStr          ?: string;
    loading            ?: boolean;
    error              ?: boolean;
}

const Highlight = ({ text, searchStr }: { text: string, searchStr: string }) => {
    const index = text.toLowerCase().indexOf(searchStr.toLowerCase());
    if (searchStr.trim() === '' || index === -1) {
        return <>{text}</>;
    }
    return (
        <>
            {text.substring(0, index)}
            <span className = "bg-yellow-500 dark:bg-yellow-200 text-gray-800 rounded border-solid p-0.5">{text.substring(index, index + searchStr.length)}</span>
            {text.substring(index + searchStr.length)}
        </>
    );
}

const ComponentByType = ({ type, data, rowVal, searchStr }: { type: 'string' | 'options' | 'avatar' | 'image'; data: any, rowVal: any, searchStr: string }) => {
    switch (type) {
        case 'string': 
            return <><Highlight text={data} searchStr={searchStr} /></>;
        case 'options': 
            return <><Highlight text={rowVal[data]} searchStr={searchStr} /></>;
        case 'avatar': 
            return <Avatar alt = {data} src = {data} variant = "rounded" />
        case 'image': 
            return <img src = {data} alt = "" className = 'w-10 h-10' />;
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
    selectedActions    = [],
    nonSelectedActions = [],
    rows,
    showSearch  = false,
    loading     = false,
    error       = false,
    onSearch    = () => { },
    searchStr   = '',
    searchLabel = '搜索'
}: EnhancedTableProps) {
    const [selected, setSelected]       = useState<Set<number>>(new Set());
    const [currentPage, setCurrentPage] = useState<number>(page);
    const [anchorEl, setAnchorEl]       = useState<null | HTMLElement>(null);
    const [popIndex, setPopIndex]       = useState<string>('');
    const maxPage                       = count % rowsPerPage == 0 ? count / rowsPerPage : Math.ceil(count / rowsPerPage);

    useEffect(() => {
        setCurrentPage(page);
        console.log(page);
    }, [page]);


    const handlePopOver = (e:MouseEvent, index:string) => {
        setAnchorEl(e.currentTarget as HTMLElement);
        setPopIndex(index);
        console.log({anchorEl});
    }

    const handleClose = () => {
        setTimeout(() => setAnchorEl(null), 20);
        setPopIndex('');
    }

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
        newSelected.has(id) ? newSelected.delete(id): newSelected.add(id);
        setSelected(newSelected);
    };

    const isSelected      = (id: number) => selected.has(id);
    const length          = data.length;
    const inputChangePage = (e: ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        setCurrentPage(val > maxPage ? maxPage : (val < 1 ? 1 : val));
    };

    const tableSize = 'medium';

    return (
        <>
            <Card>
                <EnhancedTableToolbar
                    numSelected        = {selected.size}
                    selected           = {Array.from(selected)}
                    selectedActions    = {selectedActions}
                    nonSelectedActions = {nonSelectedActions}
                    showSearch         = {showSearch}
                    onSearch           = {onSearch}
                    searchLabel        = {searchLabel}
                    searchStr          = {searchStr}
                    loading            = {loading}
                />
                <TableContainer>
                    <Table
                        sx              = {{ minWidth: 750 }}
                        aria-labelledby = "tableTitle"
                        size            = {tableSize}
                    >
                        <EnhancedTableHead
                            numSelected      = {selected.size}
                            onSelectAllClick = {handleSelectAllClick}
                            rowCount         = {length}
                            titles           = {rows}
                            loading          = {loading || data.length === 0}
                        />
                        <TableBody>
                            {loading ?

                            <tr style={{width: '100%'}}>
                                <td colSpan={Object.keys(rows).length + 1}>
                                    <Loading />
                                    </td>
                                </tr>
                                :
                                data.length === 0 ?
                                    <tr style={{width: '100%'}}>
                                        <td colSpan={Object.keys(rows).length + 1} className='text-center'>
                                            <Empty />
                                            什么都没有了
                                        </td>
                                    </tr>
                                    :
                                    error ?
                                        <tr style={{width: '100%'}}>
                                            <td colSpan={Object.keys(rows).length + 1} className='text-center'>
                                                <Error />
                                                出错了
                                            </td>
                                        </tr>
                                        :
                                data.map((row, ind) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId        = `enhanced-table-checkbox-${ind}`;
                                const borderBottom   = length == ind + 1 ? 'none' : '1px solid rgba(224, 224, 224, 1)';
                                return (
                                    <TableRow
                                        hover
                                        role         = "checkbox"
                                        aria-checked = {isItemSelected}
                                        tabIndex     = {-1}
                                        key          = {row.id}
                                        selected     = {isItemSelected}
                                    >
                                        <TableCell sx = {{ borderBottom, cursor: 'pointer' }} padding = "checkbox" onClick = {(event) => handleSelect(row.id)}>
                                            <Checkbox
                                                color      = "primary"
                                                checked    = {isItemSelected}
                                                inputProps = {{
                                                    'aria-labelledby': labelId,
                                                }}
                                                sx={{
                                                    '.dark & svg': {color: '#ccc'}
                                                }}
                                            />
                                        </TableCell>
                                        {Object.keys(rows).map((key, index) => {
                                            const { type, value } = rows[key];
                                            const val             = row[key] === undefined || row[key] === null ? '' : row[key];
                                            return (
                                                <TableCell
                                                    sx        = {{ borderBottom, padding: '1rem 0' }}
                                                    className = 'text-gray-500 dark:text-gray-200'
                                                    component = "td"
                                                    scope     = "row"
                                                    padding   = "none"
                                                    key       = {index}
                                                >
                                                    <ComponentByType
                                                        type   = {type}
                                                        data   = {val}
                                                        rowVal = {value}
                                                        searchStr = {searchStr}
                                                    />
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell
                                            sx        = {{ borderBottom }}
                                            component = "th"
                                            scope     = "row"
                                            padding   = "none"
                                        >
                                            <ButtonGroup size = "small" aria-label = "small button group">
                                                {editList.map(({ label, onClick, color = 'primary', showConfirm, ...e }, ed_index) => {
                                                    // const { label, onClick, color = 'primary', showConfirm, ...e } = editList[ed_key];
                                                    // console.log({ed_key, ed_index});
                                                    const colors = {
                                                        primary: {
                                                            backgroundColor: 'rgba(25, 141, 255, 0.04)',
                                                            color: 'rgb(25, 141, 255)',
                                                            border: '1px solid rgb(25, 141, 255)',
                                                            '&:hover': {backgroundColor: 'rgba(25, 141, 255, 0.2)'}
                                                        },
                                                        secondary: {
                                                            backgroundColor: 'rgba(218, 54, 246, 0.04)',
                                                            color: 'rgb(218, 54, 246)',
                                                            border: '1px solid rgb(218, 54, 246)',
                                                            '&:hover': {backgroundColor: 'rgba(218, 54, 246, 0.2)'}
                                                        },
                                                        warning: {
                                                            backgroundColor: 'rgba(255, 135, 40, 0.04)',
                                                            color: 'rgb(255, 135, 40)',
                                                            border: '1px solid rgb(255, 135, 40)',
                                                            '&:hover': {backgroundColor: 'rgba(255, 135, 40, 0.2)'}
                                                        },
                                                        error: {
                                                            backgroundColor: 'rgba(240, 83, 83, 0.04)',
                                                            border: '1px solid rgb(240, 83, 83)',
                                                            color: 'rgb(240, 83, 83)',
                                                            '&:hover': {backgroundColor: 'rgba(240, 83, 83, 0.2)'}
                                                        },
                                                        success: {
                                                            backgroundColor: 'rgba(94, 203, 100, 0.04)',
                                                            border: '1px solid rgb(94, 203, 100)',
                                                            color: 'rgb(94, 203, 100)',
                                                            '&:hover': {backgroundColor: 'rgba(94, 203, 100, 0.2)'}
                                                        },
                                                        info: {
                                                            backgroundColor: 'rgba(92, 197, 255, 0.04)',
                                                            border: '1px solid rgb(92, 197, 255)',
                                                            color: 'rgb(92, 197, 255)',
                                                            '&:hover': {backgroundColor: 'rgba(92, 197, 255, 0.2)'}
                                                        },
                                                    }
                                                    const sx = { '.dark &':colors[color]};
                                                    if (showConfirm)
                                                        return (
                                                            <Fragment key={ed_index}>
                                                                <Button
                                                                    key       = {ed_index}
                                                                    // className = 'bg-purple-dark hover:bg-purple-lighter text-white font-bold py-2 px-4 rounded'
                                                                    // @ts-ignore
                                                                    onClick   = {(e)=>handlePopOver(e, `${ind}-${ed_index}`)}
                                                                    // variant="contained"
                                                                    color={color}
                                                                    sx={sx}
                                                                    {...e}
                                                                >
                                                                    {label}
                                                                </Button>
                                                                <Popover
                                                                    open={popIndex === `${ind}-${ed_index}`}
                                                                    anchorEl={anchorEl}
                                                                    onClose={handleClose}
                                                                    anchorOrigin={{
                                                                    vertical: 'bottom',
                                                                    horizontal: 'left',
                                                                    }}
                                                                >
                                                                    <Typography sx={{ p: 2 }}>确定要{label}吗？</Typography>
                                                                    <Button color='error' size='small' variant="text" onClick={() => {onClick(row.id); handleClose()}}>确定</Button>
                                                                    <Button color='info' size='small' variant="text" onClick={handleClose}>取消</Button>
                                                                </Popover>
                                                            </Fragment>
                                                        );
                                                    return (
                                                        <Button
                                                            key       = {ed_index}
                                                            // className = 'bg-purple-dark hover:bg-purple-lighter text-white font-bold py-2 px-4 rounded'
                                                            // @ts-ignore
                                                            onClick   = {() => onClick(row.id)}
                                                              // variant="contained"
                                                            color={color}
                                                            sx={sx}
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
            <div        className = "flex">
            <div        className = "flex-initial w-auto">
            <Pagination count     = {maxPage} onChange = {(e, n) => onChangePage(n)} page = {page} color = "secondary" sx={{'.dark & button': {color: '#eee'}}} />
                </div>
                <div className = "flex-none w-14 leading-10 text-right pr-2">
                    每页
                </div>
                <div className = "flex-none w-20">
                    <Select
                        labelId  = "demo-simple-select-autowidth-label"
                        id       = "demo-simple-select-autowidth"
                        value    = {rowsPerPage}
                        onChange = {(e) => onChangeRowsPerPage(e.target.value as unknown as number)}
                        autoWidth
                        label = ""
                        size  = 'small'
                        sx={{
                            '.dark & svg': {color: '#eee'},
                            '.dark &': {color: '#eee'},
                            '.dark & fieldset': {borderColor: '#aaa'},
                            '.dark &:hover fieldset': {borderColor: '#eee'},
                            '.dark & .MuiSelect-root': {color: '#eee'},
                            '.dark & .MuiSelect-icon': {color: '#eee'},
                            '.dark & .MuiInputBase-root': {color: '#eee'},
                            '.dark & .MuiInput-underline:before': {borderBottomColor: '#eee'},
                            '.dark & .MuiInput-underline:after': {borderBottomColor: '#eee'},
                        }}
                    >
                        <MenuItem value = {10}>10</MenuItem>
                        <MenuItem value = {25}>25</MenuItem>
                        <MenuItem value = {50}>50</MenuItem>
                        <MenuItem value = {100}>100</MenuItem>
                        <MenuItem value = {150}>150</MenuItem>
                        <MenuItem value = {200}>200</MenuItem>
                        <MenuItem value = {400}>400</MenuItem>
                        <MenuItem value = {800}>800</MenuItem>
                        <MenuItem value = {8000}>8000</MenuItem>
                    </Select>
                </div>
                <div className = "flex-initial w-10 leading-10">
                    条
                </div>
                <div className = "flex-initial w-20 leading-10 text-right pr-2">
                    转到第
                </div>
                <div className = "flex-initial w-20">
                    <TextField
                        type       = "number"
                        value      = {currentPage}
                        onChange   = {inputChangePage}
                        inputProps = {{ inputMode: 'numeric', pattern: '[0-9]*', min: 1, max: maxPage }}
                        size       = 'small'
                        onKeyDown  = {e => e.key == 'Enter' && onChangePage(currentPage)}
                        sx={{
                            '.dark & .MuiInputBase-root': {color: '#eee'},
                            '.dark & .MuiInput-underline:before': {borderBottomColor: '#aaa'},
                            '.dark & .MuiInput-underline:after': {borderBottomColor: '#aaa'},
                            '.dark &:hover .MuiInput-underline:before': {borderBottomColor: '#eee'},
                            '.dark &:hover .MuiInput-underline:after': {borderBottomColor: '#eee'},
                            '.dark & fieldset': {borderColor: '#aaa'},
                            '.dark &:hover fieldset': {borderColor: '#eee'},
                        }}
                    />
                </div>
                <div className = "flex-initial w-20 leading-10 pl-2">
                    页
                </div>
                <div className = "flex-initial w-24 leading-10 pl-2">
                    共{count}条
                </div>
            </div>
        </>
    );
}