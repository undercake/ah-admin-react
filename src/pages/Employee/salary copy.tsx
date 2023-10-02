/*
 * @Author: Undercake
 * @Date: 2023-09-19 17:18:23
 * @LastEditTime: 2023-09-29 16:29:31
 * @FilePath: /ah-admin-react/src/pages/Employee/salary copy.tsx
 * @Description: 8月营业额计算
 */
import { useState, useEffect, type CSSProperties, type ChangeEventHandler } from 'react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as XLSX from 'xlsx';
import Card from '../../components/Card';
import { FormatColorTextSharp } from '@mui/icons-material';

interface booking {
    关联订单: string;
    备注: string;
    手机号码: string;
    提交时间: string;
    服务人员: string;
    服务地址: string;
    状态: string;
    联系人: string;
    联系人手机: string;
    预约人姓名: string;
    预约时间: string;
    预约码: string;
    预约项目: string;
}

interface order {
    优惠券抵扣: string;
    优惠后订单金额: string;
    关联预约码: string;
    商品金额: string;
    备注: string;
    开单员工: string;
    扣除余额: string;
    收款人: string;
    收款方式: string;
    收款时间: string;
    收款金额: string;
    收费项目: string;
    服务人员: string;
    状态: string;
    类型: '服务' | '产品' | '开卡' | '产品' | '快速收款';
    订单合计: string;
    订单类型: string;
    订单编号: string;
    说明: string;
    销售: string;
    顾客姓名: string;
    顾客手机: string;
}

function Salary() {
    const [isFileReaded, setIsFileReaded] = useState<boolean>(false);
    const [bookingListCount, setBookingListCount] = useState<number>(0);
    const [errBookingListCount, setErrBookingListCount] = useState<number>(0);
    const styled: CSSProperties = {
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    };

    let workbook: null | XLSX.WorkBook = null;

    let orderList: any[] = [];
    let errList: order[] = [];
    let order: order[] = [];
    let booking: booking[] = [];

    const fileUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files && e.target.files[0];
        console.log({ e: e.target.files });
        const reader = new FileReader();
        reader.onload = f => {
            // @ts-ignore
            workbook = XLSX.read(f.target.result);
            setIsFileReaded(true);
            order = XLSX.utils.sheet_to_json(workbook.Sheets.订单列表);
            booking = XLSX.utils.sheet_to_json(workbook.Sheets.预约单);
            console.log({ f, workbook, order, booking });
            processData();
        }
        reader.readAsArrayBuffer(file as Blob);
        // console.log({workbook});
    }

    const processData = () => {
        orderList = [];
        order.forEach(o => {
            if (!['服务','快速收款' ].includes(o.类型) || o.备注.includes('老客转新卡') || o.服务人员 === '无' ) return;
            // @ts-ignore
            const 预约码 = o.关联预约码 === '无' ? o.备注.match(/B\d{11}/) ? o.备注.match(/B\d{11}/)[0] : '' : o.关联预约码;
            if (预约码 === '') return errList.push(o);
            // const {预约项目, 预约时间, 联系人, 服务地址, 备注} = booking.find(b => ) as booking;
            booking.forEach(b => {
                const { 预约项目, 预约时间, 联系人, 服务地址, 备注, 联系人手机 } = b;
                if (b.预约码 === 预约码) {
                    // @ts-ignore
                    let 金额: RegExpMatchArray | null | string = 备注.match(/\d+元/g);
                    金额 = 金额 && 金额.length === 1 ? 金额[0].replace('元', '') : '';
                    if (备注.match(/\/元\/时/g) || 备注.match(/元\/人\/时/g) || 备注.match(/元\/人\/时/g) || 备注.match(/\/小时\/人/g) || 金额 === '' || !金额) 金额 = o.收款金额;
                    orderList.push(
                        {
                            预约码,
                            订单编号: o.订单编号,
                            预约时间: 预约时间.match(/\d+-\d+-\d+ \d+:\d+/)![0],
                            预约项目,
                            联系人,
                            联系人手机,
                            金额: parseInt(金额),
                            收款: o.收款金额,
                            服务人员: o.服务人员,
                            服务地址,
                            备注
                        }
                    );
                    console.log({ 预约项目, 预约时间, 联系人, 服务地址, 备注 });
                }
            });
        });
        console.log({ orderList, errList });
        setBookingListCount(orderList.length);
        setErrBookingListCount(errList.length);
        const orderListSheet = XLSX.utils.json_to_sheet(orderList, {});
        const errListSheet = XLSX.utils.json_to_sheet(errList, {});
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, orderListSheet, "订单");
        XLSX.utils.book_append_sheet(workbook, errListSheet, "错单");
        XLSX.writeFile(workbook, '8月订单.xlsx');
        console.log({ orderListSheet, errListSheet, workbook, orderList, errList });
    }

    const exportXls = () => {
    }

    return (<><Card variant="outlined" sx={{ minWidth: 275 }} className='p-10 dark:bg-gray-1080 dark:color dark:text-gray-100'>
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Upload FileReader
            {/* @ts:ignore */}
            <input type="file" style={styled} onChange={fileUpload} />
        </Button>
    </Card>
        {isFileReaded && <Card>
            订单数：{bookingListCount} 错单数：{errBookingListCount}
            <br />
            <Button variant="contained" onClick={exportXls}>导出excel</Button>
        </Card>}
    </>);
}

export default Salary;