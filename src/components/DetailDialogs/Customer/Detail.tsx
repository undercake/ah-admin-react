/*
 * @Author: Undercake
 * @Date: 2023-08-09 13:45:55
 * @LastEditTime: 2023-08-11 15:24:03
 * @FilePath: /ah-admin-react/src/components/DetailDialogs/Customer/Detail.tsx
 * @Description: customer detail dialog
 */
import ScrollView from '@/components/ScrollView';
import Card from '@/components/Card';
import type Customer from "@/pages/Customer/Customer.d";
import Box from "@mui/material/Box";

const Dvd = () => <span style={{ display: 'inline-block', width: '1.5rem' }} />

function Detail({ data, ...e }: { data: Customer, [key: string]: any }) {
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
    </ScrollView>;
}

export default Detail;