/*
 * @Author: Undercake
 * @Date: 2023-08-07 13:41:03
 * @LastEditTime: 2023-08-09 16:53:46
 * @FilePath: /ah-admin-react/src/components/DetailDialogs/Customer/index.tsx
 * @Description: 
 */
import Core from '@/components/DetailDialogs/Core';
import Error from '@/components/Status/Error';
import Loading from '@/components/Status/Loading';
import Detail from './Detail';
import HistoryList from './HistoryList';
import { urls } from '@/config';
import axios, {type resData, type resListData} from '@/utils/Axios';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import type Customer from '@/pages/Customer/Customer.d';

export interface HistoryList{
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
    const [detail, setDetail] = useState<Customer>({});
    const [history, setHistory] = useState<HistoryList[]>([]);
    const [page, setPage] = useState(1);
    const [pageLoading, setPageLoading] = useState(true);
    const [pageError, setPageError] = useState(false);

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
            .then((res: resListData<HistoryList>) => {
                console.log({res});
                setHistory(res.data);
                console.log({history})
            })
            .catch((e) => {
                console.log(e);
                setPageError(true);
            }).finally(() => {
                setPageLoading(false);
            });
    }

    useEffect(() => {
        // console.log('CustomerEditor');
        setOpen(true);
        getDetail();
        getHistory();
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
        <Box component='div' className={loading || error ? 'text-center pt-8' : ''}>
            {loading ? <Loading /> : error ? <Error /> :
            <>
                <Detail data={detail} />
                <HistoryList
                // @ts-ignore
                    list={history}
                    page={page}
                    setPage={setPage}
                    pageError={pageError}
                    pageLoading={pageLoading}
                />
            </>}
        </Box>
    </Core>;
}

export default Customer;