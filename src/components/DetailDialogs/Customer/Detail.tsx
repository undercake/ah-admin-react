/*
 * @Author: Undercake
 * @Date: 2023-08-09 13:45:55
 * @LastEditTime: 2023-08-30 15:56:19
 * @FilePath: /ah-admin-react/src/components/DetailDialogs/Customer/Detail.tsx
 * @Description: customer detail dialog
 */
import ScrollView from '../../../components/ScrollView';
import Card from '../../../components/Card';
import FormInput from '../../../components/FormComponents/FormInput';
import { Highlight } from '../../ListTable'
import type Customer from "../../../pages/Customer/Customer.d";
import Box from "@mui/material/Box";
import { useEffect, useState } from 'react';
import Loading from '../../Status/Loading';
import axios from '../../../utils/Axios';
import { urls } from '../../../config';
import Error from '../../Status/Error';

interface TMapLocation {
    id: string;
    title: string;
    adcode: number;
    city: string;
    district: string;
    category: string;
    address: string;
    province: string;
    type: number;
    location:{
        lat: number;
        lng: number;
    }
}

const Dvd = () => <span style={{ display: 'inline-block', width: '1.5rem' }} />
let timer:number|NodeJS.Timeout = 0;

function Detail({ data, ...e }: { data: Customer, [key: string]: any }) {

    const [locations, setLocations] = useState<TMapLocation[]>([]);
    const [loadingLocation, setLoadingLocation] = useState(true);
    const [errorLocation, setErrorLocation] = useState(false);
    const [searchStr, setSearchStr] = useState('');

    const searchMaps = () => {
        clearTimeout(timer);
        timer = setTimeout(()=>{
            setErrorLocation(false);
            setLoadingLocation(true);
            axios.post(urls.customer_get_map, {
                addr: searchStr
                // @ts-ignore
            }).then((e: {
                count:number;
                message: string;
                data: TMapLocation[];
                request_id:string;
                status: number;
            }) => {
                if (e.status === 0) {
                    setLocations(e.data);
                } else {
                    setLocations([]);
                }
            }).catch(e=>
                setErrorLocation(true)
            ).finally(() => {
                setLoadingLocation(false);
            });
        }, 1000);
    }

    useEffect(searchMaps, [searchStr]);

    useEffect(() => {
        setSearchStr(data.Address.split(' ')[0].split('（')[0].split(/[0-9]/)[0]);
        searchMaps();
    }, []);
    return <ScrollView {...e}>
        <Card>
            <Box style={{ minWidth: '25rem' }}>
                <p className="text-center text-xl font-bold pd-2 mb-2 border-b">客户详情</p>
                <p>
                    合同编号：{data.ItemCode} <Dvd />
                    客户类型：{['暂无', '钟点', '包周', '包做', '年卡', '季卡', '月卡', '半月卡'][data.UserType]}
                </p>
                <p>姓名：{data.FullName}</p>
                <p>电话：{data.Tel1} {data.Tel2} {data.Tel3}</p>
                <p>剩余次数：{data.TotalCount} <Dvd /> 账户金额：{data.TotalMoney}</p>
                <p>合同期，从 {data.BeginDate} 到 {data.EndDate} <Dvd /> 住房面积：{data.HouseArea} </p>
                <p>一般服务时间：{data.NormalServiceTime}</p>
                <p>特殊要求：{data.SpecialNeed}</p>
                <p>详细地址：{data.Address}</p>
                <p>区域：{data.fRegion} <Dvd /> 重要程度：{['普通客户', 'VIP', '重要领导'][data.F1]}</p>
            </Box>
        </Card>
        <Card>
            <Box style={{ minWidth: '25rem' }}>
                <p className="text-center text-xl font-bold pd-2 mb-2 border-b">地址搜索：</p>
                <div>
                    <FormInput
                        id='search_maps'
                        name='search_maps'
                        label='地址搜索'
                        placeholder='请输入地址'
                        value={searchStr}
                        onChange={(e) => {
                            setSearchStr(e.target.value);
                        }}
                    />
                </div>
                {
                loadingLocation ?
                <div className='text-center'>
                    <Loading />
                </div> :
                errorLocation ?
                <div className='text-center'>
                    <Error />
                    ┗|｀O′|┛ 嗷~~ 出错啦！！
                </div> :
                locations.length === 0 ?
                <p className="text-center">暂无</p> :
                locations.map((m, i)=><p key={i} style={{marginTop: '1rem'}}><Highlight text={m.address} searchStr={searchStr}></Highlight></p>)
                }
            </Box>
        </Card>
    </ScrollView>;
}

export default Detail;