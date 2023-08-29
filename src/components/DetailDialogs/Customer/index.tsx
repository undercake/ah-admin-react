/*
 * @Author: Undercake
 * @Date: 2023-08-07 13:41:03
 * @LastEditTime: 2023-08-29 12:13:36
 * @FilePath: /ah-admin-react/src/components/DetailDialogs/Customer/index.tsx
 * @Description: 
 */
import Core from '../../../components/DetailDialogs/Core';
import Error from '../../../components/Status/Error';
import Loading from '../../../components/Status/Loading';
import ScrollView from '../../../components/ScrollView';
import Detail from './Detail';
import HistoryList from './HistoryList';
import { urls } from '../../../config';
import axios, {type resData, type resListData} from '../../../utils/Axios';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import type CustomerType from '../../../pages/Customer/Customer.d';

export interface HistoryData{
    id: number;
    NeedServiceTime: string;
    ServiceContentName: string;
    Comment: string;
    TaskStatus: number;
    PhoneDate: string;
}

function Customer({
    handleClose,
    id
}: {
    handleClose: any;
    id: number;
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    // @ts-ignore
    const [detail, setDetail] = useState<CustomerType>({});
    const [history, setHistory] = useState<HistoryData[]>([]);
    const [page, setPage] = useState(1);
    const [pageLoading, setPageLoading] = useState(true);
    const [pageError, setPageError] = useState(false);
    const [total, setTotal] = useState(0);

    const onClose = (e: Event, reason: string) => {
        const is_close = handleClose(e, reason);
        is_close && setOpen(false);
    }

    const getDetail = () => {
        setLoading(true);
        setError(false);
        axios
            .get(`${urls.customer_detail}/id/${id}`)
            // @ts-ignore
            .then((res: resData<Customer>) => {
                console.log(res);
                setDetail(res.data);
                console.log({detail})
            })
            .catch((e) => {
                console.log(e);
                setError(true);
            }).finally(() => {
                setLoading(false);
            });
    }
    const getHistory = () => {
        setPageLoading(true);
        setPageError(false);
        axios
            .get(`${urls.customer_history}/id/${id}/page/${page}`)
            // @ts-ignore
            .then((res: resListData<HistoryData>) => {
                console.log({'0':1,res});
                setHistory(res.data);
                console.log({'1':2,history})
                // @ts-ignore
                setTotal(res.total);
            })
            .catch((e) => {
                console.log(e);
                setPageError(true);
            }).finally(() => {
                setPageLoading(false);
            });
    }

    const loadMapScript = () => {
        const hasScript = document.getElementById("mapScript");
        if (hasScript) return;
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.id = "mapScript";
        script.src = "https://map.qq.com/api/gljs?v=1.exp&key=DMGBZ-6GSKU-TTHVU-B54EM-QVHZJ-VUFNZ&callback=initMap";
        document.body.appendChild(script);
    }

    useEffect(() => {
        // console.log('CustomerEditor');
        setOpen(true);
        getDetail();
        getHistory();
        loadMapScript();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        getHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return <Core
        onClose={onClose}
        onOpen={console.log}
        open={open}
    >
        <Box component='div' className={(loading || error ? 'text-center pt-8' : '') + 'w-full h-full overflow-hidden'}>
            {loading ? <Loading /> : error ? <Error /> :
            <div className='flex flex-wrap gap-5 h-full overflow-hidden'>
                <Detail
                    className='flex-1'
                    data={detail}
                    sx={{
                        height: '35rem'
                    }}
                />
                <HistoryList
                    className='flex-1'
                // @ts-ignore
                    list={history}
                    page={page}
                    setPage={setPage}
                    pageError={pageError}
                    pageLoading={pageLoading}
                    total={total}
                    sx={{
                        height: '35rem'
                    }}
                />
            </div>}
        </Box>
    </Core>;
}

export default Customer;