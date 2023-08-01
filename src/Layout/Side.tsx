"use client";
/*
 * @Author: Undercake
 * @Date: 2023-04-26 13:48:36
 * @LastEditTime: 2023-07-31 17:51:52
 * @FilePath: /ah-admin-react/src/Layout/Side.tsx
 * @Description: side menu
 */
import { useState, useEffect, MouseEvent, Fragment } from 'react';
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
import ScrollView from '@/components/ScrollView';
import { getLists, right } from '@/utils/Rights';
import MittBus from '@/utils/MittBus';
import './styles/side.scss';
import { onPathChange, get, push } from '@/utils/Router';

const activeMenu = 'text-purple-dark dark:text-purple-light bg-purple-light dark:bg-purple-dark';
const activeSubMenu = 'text-purple-dark dark:text-purple-lighter';

const handleChildMap = ({
    child,
    path,
    index,
    open,
    type = '0'
}: {
    child: right[];
    path: string;
    index: number;
    open: boolean;
    type?: string;
}): JSX.Element => (
    <List component="div" disablePadding>
        {child.map((child: right, ind: number) => (
            <ListItem
                className={
                    (path == child.path ? activeSubMenu : 'hover:text-purple-lighter dark:hover:text-purple-light') + ' cursor-pointer'
                }
                sx={{ paddingLeft: type == 'pop' ? '0' : '3.1rem' }}
                key={`${index}-${ind}`}
                onClick={() => {
                    push(child.path);
                }}
            >
                <ListItemIcon sx={{ minWidth: '1.5rem' }}>
                    {type == '0' ? (
                        <FiberManualRecordIcon
                            className=" dark:text-white"
                            sx={path == child.path ? { width: '8px', height: '8px' } : { width: '6px', height: '6px' }}
                        />
                    ) : null}
                </ListItemIcon>
                {open ?
                    <ListItemText primary={<span style={{ fontWeight: path == child.path ? 600 : 400 }}>{child.name}</span>} /> :
                    type == 'pop' ?
                        <ListItemText primary={<span style={{ fontWeight: path == child.path ? 600 : 400 }}>{child.name}</span>} /> :
                        null}
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
        open={tips == item.path}
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

    const tongleCol = (target: string) => (currentTarget == target ? setCurrentTarget('') : setCurrentTarget(target));

    const path2target = (path: string) => {
        let target = '';
        path == '/' || path == '' ? (target = '/index') : (target = '/' + get().split('/')[1]);
        return target;
    };

    useEffect(() => {
        getLists(setMenuList);
        onPathChange((path: string) => {
            setPath(path);
            tongleCol(path2target(path));
        });
        window && window.addEventListener('click', handlePopoverClose);
        tongleCol(path2target(get()));
        setPath(get());
        MittBus.on('getLists', () => getLists(setMenuList, true));
    }, []);

    return (
        <Drawer
            className={
                'main-layout transition-width duration-400 ' +
                (open ? (menuList.length > 0 ? 'open w-62' : 'w-0') : 'closed w-16')
            }
            sx={{
                paddingTop: '5.6rem',
            }}
            variant="permanent"
        >
            <ScrollView
                style={{
                    height: 'calc(100vh - 5.6rem)',
                    paddingLeft: '10px',
                    paddingRight: '10px'
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
                                    (path.indexOf(item.path) > -1 || path == item.path || currentTarget == item.path
                                        ? activeMenu
                                        : 'hover:bg-purple-light dark:hover:bg-purple-darkest') + ' h-12 rounded-xl mb-2'
                                }
                                tabIndex={0}
                                sx={{
                                    paddingLeft: open ? '1rem' : 0,
                                    marginBottom: '.5rem',
                                    borderRadius: '.75rem',
                                    backgroundColor: path.indexOf(item.path) > -1 || path == item.path || currentTarget == item.path ? 'rgb(237 231 246)' : '',
                                    color: path.indexOf(item.path) > -1 || path == item.path || currentTarget == item.path ? 'rgb(103 58 183)' : '',
                                    '.dark &:hover': { backgroundColor: 'rgba(94, 53, 177, .5)' },
                                    '&:hover': { backgroundColor: 'rgb(237 231 246)' }
                                }}
                            >
                                <ListItemIcon sx={{ paddingLeft: '.6rem' }}>
                                    <i
                                        className={
                                            item.icon +
                                            ' dark:text-white ' +
                                            (path.indexOf(item.path) > -1 || path == item.path || currentTarget == item.path
                                                ? activeMenu
                                                : '')
                                        }
                                    />
                                </ListItemIcon>
                                <ListItemText primary={item.name} />
                                {open ? currentTarget == item.path || currentTarget.indexOf(item.path) == 0 ? <ExpandLess /> : <ExpandMore /> : null}
                            </ListItemButton>
                            {open ? (
                                <Collapse key={`col-${index}`} in={currentTarget == item.path || currentTarget.indexOf(item.path) == 0} className='transition-height duration-300' timeout={200}>
                                    {handleChildMap({ child: item.children, path, index, open })}
                                </Collapse>
                            ) : (<>
                                <Tips key={`tips-1-${index}`} index={index} tipsEl={tipsEl} tips={tips} item={item} />
                                <Popover
                                    key={`pop-${index}`}
                                    sx={{
                                        marginLeft: '3.5rem'
                                    }}
                                    anchorEl={anchorEl}
                                    open={popoverCondition == item.path}
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
                            <ListItemButton
                                key={index}
                                className={
                                    (path.indexOf(item.path) == 0 || path == item.path ? activeMenu : '') + ' h-12 rounded-xl mb-2'
                                }
                                onClick={() => push(item.path)}
                                onMouseEnter={(e) => showTips(e, item.path)}
                                onMouseLeave={closeTips}
                                sx={{
                                    paddingLeft: open ? '1rem' : 0,
                                    marginBottom: '.5rem',
                                    borderRadius: '.75rem',
                                    backgroundColor: path.indexOf(item.path) > -1 || path == item.path || currentTarget == item.path ? 'rgb(237 231 246)' : '',
                                    color: path.indexOf(item.path) > -1 || path == item.path || currentTarget == item.path ? 'rgb(103 58 183)' : '',
                                    '.dark &:hover': { backgroundColor: 'rgba(94, 53, 177, .5)' },
                                    '&:hover': { backgroundColor: 'rgb(237 231 246)' }
                                }}
                            >
                                <ListItemIcon sx={{ paddingLeft: '.6rem' }}>
                                    <i
                                        className={
                                            item.icon +
                                            ' dark:text-white ' +
                                            (path.indexOf(item.path) == 0 || path == item.path ? activeMenu : '')
                                        }
                                    />
                                </ListItemIcon>
                                <ListItemText primary={item.name} />
                            </ListItemButton>
                            {open ? null : <Tips key={`tips-1-${index}`} index={index} tipsEl={tipsEl} tips={tips} item={item} />}
                        </Fragment>)
                    }

                    <ListItemButton
                        onClick={(e) => {}}
                        onMouseEnter={(e) => showTips(e, '/exit')}
                        onMouseLeave={closeTips}
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
                        <ListItemText primary="退出登录" />
                    </ListItemButton>
                    {open ? <Tips index={9999} tipsEl={tipsEl} tips={tips} item={{name: '退出登录', path: '/exit'}} />: null}
                </List>
            </ScrollView>
        </Drawer>
    );
}

export default Side;
