"use client";
/*
 * @Author: Undercake
 * @Date: 2023-04-26 13:48:36
 * @LastEditTime: 2023-10-08 14:30:26
 * @FilePath: /ah-admin-react/src/Layout/Side.tsx
 * @Description: side menu
 */
import { useState, useEffect, MouseEvent, Fragment } from 'react';
import { Link, useLocation } from "react-router-dom";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Popover from '@mui/material/Popover';
import ScrollView from '../components/ScrollView';
import { getLists, right } from '../utils/Rights';
import MittBus from '../utils/MittBus';
import './styles/side.scss';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { get, push } from '../utils/Router';
import { urls, version } from '../config';
import axios from '../utils/Axios';

const activeMenu = 'text-purple-dark dark:text-purple-light bg-purple-light dark:bg-purple-dark';
const activeSubMenu = 'text-purple-dark dark:text-purple-lighter';

const handleChildMap = ({
    child,
    path,
    index,
    open,
    type = '0',
    // push
}: {
    child: right[];
    path: string;
    index: number;
    open: boolean;
    type?: string;
    // push?:any
}): JSX.Element => (
    <List component="div" disablePadding>
        {child.map((child: right, ind: number) => (
            <ListItem
                className={
                    (path === child.path ? activeSubMenu : 'hover:text-purple-lighter dark:hover:text-purple-light') + ' cursor-pointer'
                }
                sx={{ paddingLeft: type === 'pop' ? '0' : '3.1rem' }}
                key={`${index}-${ind}`}
            >
                <Link to={child.path} style={{display: 'flex'}}>
                    <ListItemIcon sx={{ minWidth: '1.5rem' }}>
                        {type === '0' ? (
                            <FiberManualRecordIcon
                                sx={{
                                    '.dark &':{
                                        color: path === child.path ? '#b185ff' : '#ccc',
                                    },
                                    color: path === child.path ? '#673ab7' : '#666',
                                    ...(path === child.path ?
                                    { width: '8px', height: '2rem' } :
                                    { width: '6px', height: '2rem' })
                                }}
                            />
                        ) : null}
                    </ListItemIcon>
                    {open ?
                        <ListItemText primary={<Typography sx={{
                            fontWeight: path === child.path ? 600 : 400,
                            color: path === child.path ? '#673ab7' : '#666',
                            '.dark &': {color: path === child.path ? '#b185ff' : '#ccc'}
                            }}>
                            {child.name}
                            </Typography>} /> :
                        type === 'pop' ?
                            <ListItemText primary={<Typography sx={{ fontWeight: path === child.path ? 600 : 400 }}>{child.name}</Typography>} /> :
                            null}
                </Link>
            </ListItem>
        ))}
    </List>
);

const Tips = ({ index, tipsEl, tips, item }: { index: number; tipsEl: HTMLElement | null; tips: string; item: right }) => (
    <Popover
        key={`tips-${index}`}
        className="ml-6"
        sx={{ pointerEvents: 'none' }}
        anchorEl={tipsEl}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
        }}
        open={tips === item.path}
    >
        <Typography className="p-4" sx={{ p: 1 }}>
            {item.name}
        </Typography>
    </Popover>
);

function Side({ open }: { open: boolean }) {
    const [path, setPath] = useState<string>('');
    const [tips, setTips] = useState<string>('');
    const [tipsEl, setTipsEl] = useState<HTMLElement | null>(null);
    const [menuList, setMenuList] = useState<right[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [currentTarget, setCurrentTarget] = useState<string>('');
    const [popoverCondition, setPopoverCondition] = useState<string>('');

    let location = useLocation();

    const findHoverTarget = (e: HTMLElement): HTMLElement | null => {
        const className = 'MuiButtonBase-root';
        if (e === null) return null;
        if (e.classList.contains(className)) return e;
        else return findHoverTarget(e.parentElement as HTMLElement);
    };

    const showTips = (e: any, path: string) => {
        setTipsEl(findHoverTarget(e.target));
        setTips(path);
    };

    const closeTips = () => {
        setTips('');
    };

    const handlePopoverOpen = (e: MouseEvent, path: string) => {
        setTimeout(() => {
            const curTarget = findHoverTarget(e.target as HTMLElement);
            setAnchorEl(curTarget);
            setPopoverCondition(path);
        }, 100);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setPopoverCondition('');
    };

    const tongleCol = (target: string) => (currentTarget === target ? setCurrentTarget('') : setCurrentTarget(target));

    const path2target = (path: string) => {
        let target = '';
        path === '/' || path === '' ? (target = '/index') : (target = '/' + get().split('/')[1]);
        return target;
    };

    const handleExit = () => {
        axios.get(urls.logout).then(() => {
            push('/');
            MittBus.emit('is_login', false);
            MittBus.emit('msgEmit', { type: 'success', msg: '退出成功' });
        });
    }

    const hashRouteChange = (path: string)=>{
        setPath(path);
        tongleCol(path2target(path));
    }

    useEffect(() => {
        hashRouteChange(get());
    // 
    }, [location]);

    useEffect(() => {
        getLists(setMenuList);
        // onPathChange((path: string) => {
        // });
        window && window.addEventListener('click', handlePopoverClose);
        tongleCol(path2target(get()));
        setPath(get());
        MittBus.on('getLists', () => getLists(setMenuList, true));
    }, []);

    return (
        <Drawer
            className={
                'main-layout transition-width duration-400' +
                (open ? (menuList.length > 0 ? 'open w-62' : 'w-0') : 'closed w-16')
            }
            // style={{...(open ? {} : {width: '3.5rem'})}}
            sx={{
                '&, &>div' :{marginTop: '5.6rem'},
                '.dark &,.dark &>div':{
                    backgroundColor: 'rgb(36 36 36)'
                },
                '.dark & .MuiListItemText-primary, .dark & .css-i4bv87-MuiSvgIcon-root':{
                    color: '#ccc',
                },
            }}
            variant="permanent"
        >
            {menuList.length > 0 ?
            <ScrollView
                style={{
                    height: 'calc(100vh - 5.6rem)',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    minWidth: '2rem',
                    // ...(open ? {} : {width: '3.5rem'})
                }}
            >
                <List className={'mt-16 ' + (open ? (menuList.length > 0 ? 'open w-56' : 'w-0') : 'closed w-12')} sx={{ paddingLeft: '.5rem' }}>
                    {menuList.map((item: right, index: number) => item.children.length > 0 ?
                        <Fragment key={index}>
                            <ListItemButton
                                onClick={(e) => {
                                    handlePopoverOpen(e, item.path);
                                    tongleCol(item.path);
                                }}
                                onMouseEnter={(e) => showTips(e, item.path)}
                                onMouseLeave={closeTips}
                                className={
                                    (path.startsWith(item.path) || path === item.path || currentTarget === item.path
                                        ? activeMenu
                                        : 'hover:bg-purple-light dark:hover:bg-purple-darkest') + ' h-12 rounded-xl mb-2'
                                }
                                tabIndex={0}
                                sx={{
                                    paddingLeft: open ? '1rem' : 0,
                                    marginBottom: '.5rem',
                                    borderRadius: '.75rem',
                                    backgroundColor: path.startsWith(item.path) || path === item.path || currentTarget === item.path ? 'rgb(237 231 246)' : '',
                                    color: path.startsWith(item.path) || path === item.path || currentTarget === item.path ? 'rgb(103 58 183)' : '',
                                    '.dark &:hover': { backgroundColor: 'rgba(94, 53, 177, .5)' },
                                    '&:hover': { backgroundColor: 'rgb(237 231 246)' }
                                }}
                            >
                                <ListItemIcon sx={{ paddingLeft: '.6rem' }}>
                                    <i
                                        className={
                                            item.icon +
                                            ' dark:text-white ' +
                                            (path.startsWith(item.path) || path === item.path || currentTarget === item.path
                                                ? activeMenu
                                                : '')
                                        }
                                    />
                                </ListItemIcon>
                                {open ? <ListItemText primary={item.name} /> : null}
                                {open ? currentTarget === item.path || currentTarget.startsWith(item.path) ? <ExpandLess /> : <ExpandMore sx={{'.dark &': {color: '#ccc'}}} /> : null}
                            </ListItemButton>
                            {open ? (
                                <Collapse key={`col-${index}`} in={currentTarget === item.path || currentTarget.startsWith(item.path)}  className='transition-height duration-300' timeout={200}>
                                    {handleChildMap({ child: item.children, path, index, open })}
                                </Collapse>
                            ) : (<>
                                <Tips key={`tips-1-${index}`} index={index} tipsEl={tipsEl} tips={tips} item={item} />
                                <Popover
                                    key={`pop-${index}`}
                                    sx={{
                                        marginLeft: '3.5rem',
                                        '.dark &':{
                                            backgroundColor: 'rgb(36 36 36)',
                                            color: '#ccc',
                                        }
                                    }}
                                    anchorEl={anchorEl}
                                    open={popoverCondition === item.path}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right'
                                    }}
                                    transformOrigin={{
                                        vertical: 'center',
                                        horizontal: 'right'
                                    }}
                                    onClose={handlePopoverClose}
                                    disableRestoreFocus
                                >
                                    {handleChildMap({ child: item.children, type: 'pop', path, index, open })}
                                </Popover>
                            </>)
                            }
                        </Fragment>
                        :
                        <Fragment key={index}>
                            <Link to={item.path}>
                            <ListItemButton
                                key={index}
                                className={
                                    (path.startsWith(item.path) || path === item.path ? activeMenu : '') + ' h-12 rounded-xl mb-2'
                                }
                                // onClick={() => push(item.path)}
                                onMouseEnter={(e) => showTips(e, item.path)}
                                onMouseLeave={closeTips}
                                sx={{
                                    paddingLeft: open ? '1rem' : 0,
                                    marginBottom: '.5rem',
                                    borderRadius: '.75rem',
                                    backgroundColor: path.startsWith(item.path) || path === item.path || currentTarget === item.path ? 'rgb(237 231 246)' : '',
                                    color: path.startsWith(item.path) || path === item.path || currentTarget === item.path ? 'rgb(103 58 183)' : '',
                                    '.dark &:hover': { backgroundColor: 'rgba(94, 53, 177, .5)' },
                                    '&:hover': { backgroundColor: 'rgb(237 231 246)' }
                                }}
                            >
                                <ListItemIcon sx={{ paddingLeft: '.6rem' }}>
                                    <i
                                        className={
                                            item.icon +
                                            ' dark:text-white ' +
                                            (path.startsWith(item.path) || path === item.path ? activeMenu : '')
                                        }
                                    />
                                </ListItemIcon>
                                {open ? <ListItemText primary={item.name} /> : null}
                            </ListItemButton>
                            {open ? null : <Tips key={`tips-1-${index}`} index={index} tipsEl={tipsEl} tips={tips} item={item} />}
                        </Link>
                        </Fragment>)
                    }

                    <ListItemButton
                        onMouseEnter={(e) => showTips(e, '/exit')}
                        onMouseLeave={closeTips}
                        onClick={handleExit}
                        className='hover:bg-purple-light dark:hover:bg-purple-darkest h-12 rounded-xl mb-2'
                        tabIndex={0}
                        sx={{
                            paddingLeft: open ? '1rem' : 0,
                            marginBottom: '.5rem',
                            borderRadius: '.75rem',
                            '.dark &:hover': { backgroundColor: 'rgba(94, 53, 177, .5)' },
                            '&:hover': { backgroundColor: 'rgb(237 231 246)' }
                        }}
                    >
                        <ListItemIcon sx={{ paddingLeft: '.6rem' }}>
                            <i
                                className={
                                    'fa-solid fa-sign-out' +
                                    ' dark:text-white'
                                }
                            />
                        </ListItemIcon>
                        {open ? <ListItemText primary="退出登录" /> : null}
                    </ListItemButton>
                    {open ? null : <Tips index={9999} tipsEl={tipsEl} tips={tips} item={{name: '退出登录', path: '/exit',detail:'', icon:'', id:0,sort:0, type:0, parent:0, children:[]}} />}
                </List>
                <Box sx={{textAlign:'center'}}><Chip sx={{'.dark &': {background: '#bdbdbd'}}} label={version} /></Box>

            </ScrollView> : null}
        </Drawer>
    );
}

export default Side;
