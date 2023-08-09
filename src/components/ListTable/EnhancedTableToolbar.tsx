import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
// import LoadingButton from '@mui/lab/LoadingButton';
import LoadingButton from '@/components/LoadingButton';

import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import { type ReactNode, useState, useEffect, Fragment } from 'react';

export interface Actions {
    name        : string;
    onClick     : (a: number[]) => void;
    icon       ?: ReactNode | string;
    color      ?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
    showConfirm?: boolean;
}
interface EnhancedTableToolbarProps {
    numSelected        : number;
    selectedActions   ?: Actions[];
    nonSelectedActions?: Actions[];
    selected          ?: number[];
    showSearch        ?: boolean;
    onSearch          ?: (s: string) => void;
    searchLabel       ?: string;
    searchStr         ?: string;
    loading           ?: boolean;
}

let timer: NodeJS.Timeout | 0 = 0;

export default function EnhancedTableToolbar({
    numSelected,
    selectedActions,
    nonSelectedActions,
    selected,
    showSearch = false,
    loading = false,
    onSearch = () => { },
    searchLabel = '搜索',
    searchStr=''
}: EnhancedTableToolbarProps) {
    const [search, setSearch] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [popIndex, setPopIndex] = useState(-1);

    const handleOnSearch      = () => {
        clearTimeout(timer);
        onSearch(search);
    }

    const handleClose         = () => {
        setAnchorEl(null);
        setPopIndex(-1);
    };

    const handleSearch        = (e: any) => {
        setSearch(e.target.value);
        clearTimeout(timer);
        timer = setTimeout(() => {
            handleOnSearch();
        }, 3000);
    }

    useEffect(() => {
        setSearch(searchStr);
    }, [searchStr]);

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx        = {{ flex: '1 1 100%' }}
                    color     = "inherit"
                    variant   = "subtitle1"
                    component = "div"
                >
                    已选择 {numSelected} 项
                </Typography>
            ) : (
                <Typography
                    sx        = {{ flex: '1 1 100%' }}
                    variant   = "h6"
                    id        = "tableTitle"
                    component = "div"
                >
                    {nonSelectedActions?.map(({
                        color = 'primary',
                        name,
                        icon,
                        onClick
                        }, index) => (
                            <LoadingButton
                                key={index}
                                color={color}
                                variant="contained"
                                onClick={() => onClick(selected as number[])}
                                sx={{marginRight: '.5rem'}}
                                loading={loading}
                                loadingPosition="start"
                                startIcon={<span style={{ marginRight: '.3rem' }}>{icon}</span>}
                            >
                                {name}
                            </LoadingButton>
                        ))}
                    {showSearch && <TextField
                        sx={{
                            marginLeft: '1rem',
                            '.dark & label': {
                                color: '#eee'
                            },
                            '.dark & input': {
                                color: '#eee'
                            },
                            '.dark &': {
                                color: '#eee'
                            },
                            '.dark & .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#fff',
                                    color: '#eee'
                                },
                                '&:hover fieldset': {
                                    borderColor: '#fff',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#fff',
                                },
                            },
                        }}
                        id="standard-basic"
                        label={searchLabel}
                        value={search}
                        onChange={handleSearch}
                        size="small"
                        variant="outlined"
                        onKeyDown={e => e.key == 'Enter' && handleOnSearch()}
                    />}
                </Typography>
            )}
            {numSelected > 0 && (
                <Typography
                    sx        = {{ flex: '0 1 100%', justifyContent: 'flex-end', display: 'flex' }}
                    variant   = "h6"
                    id        = "tableTitle"
                    component = "div"
                >
                        {selectedActions?.map(({ color = 'primary', name, icon, onClick, showConfirm }, index) =>
                            showConfirm ?
                            <Fragment key={index}>
                                <Button variant="contained" color={color} onClick={(e) => {setPopIndex(index); setAnchorEl(e.target as HTMLElement)}} sx={{marginRight: '.5rem'}}><span style={{ marginRight: '.3rem' }}>{icon}</span> {name}</Button>
                                <Popover
                                    open={popIndex === index}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                    }}
                                >
                                    <Typography sx={{ p: 2 }}>确定要 {name} {numSelected}条数据吗？</Typography>
                                    <Button color='error' size='small' variant="text" onClick={() => onClick(selected as number[])}>确定</Button>
                                    <Button color='info' size='small' variant="text" onClick={handleClose}>取消</Button>
                                </Popover>
                            </Fragment> :
                            <Button key={index} variant="contained" color={color} onClick={() => onClick(selected as number[])} sx={{marginRight: '.5rem'}}><span style={{ marginRight: '.3rem' }}>{icon}</span> {name}</Button>
                            )}
                </Typography>)}
        </Toolbar>
    );
}