import * as XLSX from 'xlsx';
import mittBus from './MittBus';

export default function exportXlsx(exportData: (string | number)[][], name: string, cb=()=>{}) {
    const worksheet = XLSX.utils.aoa_to_sheet(exportData, {});
    let widths: any[] = [];
    exportData.forEach(w => w.forEach((o, i) => {
        let valueWidth = 10;
        if (/.*[\u4e00-\u9fa5]+.*$/.test(`${o}`)) {
            valueWidth = parseFloat('' + `${o}`.length * 2.15);
        } else {
            valueWidth = parseFloat('' + `${o}`.length * 1.15);
        }
        let oldWdith = 0;
        if (widths[i]?.wch)
            oldWdith = widths[i].wch;
        widths[i] = { wch: Math.max(valueWidth, oldWdith) };
    }));
    worksheet["!cols"] = widths;
    const border = {
        top: {
            style: 'thin',
        },
        bottom: {
            style: 'thin',
        },
        left: {
            style: 'thin',
        },
        right: {
            style: 'thin',
        }
    }

    const alpha = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1', 'M1', 'N1', 'O1', 'P1', 'Q1', 'R1', 'S1', 'T1'];

    for (const key in worksheet) {
        const o = worksheet[key].v;
        if (key.indexOf('!') > -1) continue;
        let s:{[key:string]: any} = { border }
        if (alpha.includes(key))
        s = {
            border, font: { bold: true }, alignment: {
                horizontal: 'center',
                vertical: 'center'
            },o
        }
        worksheet[key] = { ...worksheet[key], s };
    }

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, '0');
    // XLSX.writeFileAsync( name, workbook, cb);
    mittBus.emit('msgEmit', {type: 'success', msg: '文件准备中，将在稍后自动下载'});
    const f = XLSX.writeFile(workbook, name, {type: 'string'});
    // console.log({f});
    cb();
}