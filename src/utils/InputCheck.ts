  /*
 * @Author      : Undercake
 * @Date        : 2023-10-05 11: 51: 49
 * @LastEditTime: 2023-10-05 14:59:51
 * @FilePath: /ah-admin-react/src/utils/InputCheck.ts
 * @Description : 校验输入的工具函数
 */
type returnCode = [boolean, string];

export function CheckIDCode(idCode: string): returnCode {
    if (idCode.match(/(^\d{18}$)|(^\d{17}(\d|X|x)$)/) === null) {
        return [false, '格式不正确'];
    }

    const v_city: { [key: number]: string } = {
        11: '北京',
        12: '天津',
        13: '河北',
        14: '山西',
        15: '内蒙古',
        21: '辽宁',
        22: '吉林',
        23: '黑龙江',
        31: '上海',
        32: '江苏',
        33: '浙江',
        34: '安徽',
        35: '福建',
        36: '江西',
        37: '山东',
        41: '河南',
        42: '湖北',
        43: '湖南',
        44: '广东',
        45: '广西',
        46: '海南',
        50: '重庆',
        51: '四川',
        52: '贵州',
        53: '云南',
        54: '西藏',
        61: '陕西',
        62: '甘肃',
        63: '青海',
        64: '宁夏',
        65: '新疆',
        71: '台湾',
        81: '香港',
        82: '澳门',
        91: '国外'
    };
      //取身份证前两位,校验省份
    if (v_city[parseInt(idCode.slice(0, 2))] === undefined) {
        console.log(parseInt(idCode.slice(0, 2)), v_city[parseInt(idCode.slice(0, 2))]);
        return [false, '省份格式不正确'];
    }

    const _date = idCode.match(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
      // @ts-ignore
    const new_date = new Date(_date[2] + '/' + _date[3] + '/' + _date[4]);
      // @ts-ignore
    if (!(new_date.getFullYear() == _date[2] && new_date.getMonth() + 1 == _date[3] && new_date.getDate() == _date[4]))
        return [false, '日期格式不正确'];
      // 校验位

    const intArr  = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const intCh   = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let   val_sum = 0;
    idCode.split('').forEach((d, i) => {
        if (i >= 17) return;
        val_sum += intArr[i] * parseInt(d);
    });
    if (intCh[val_sum % 11] != idCode.slice(17, 18)) return [false, '校验位不正确'];

    return [true, '校验成功'];
}

export function CheckMobile(mobile: string): returnCode {
    if (mobile.match(/^1[3-9]\d{9}$/) === null) {
        return [false, '格式不正确'];
    }
    return [true, '校验成功'];
}

export function CheckEmail(email: string): returnCode {
    if (email.match(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/) === null) {
        return [false, '格式不正确'];
    }
    return [true, '校验成功'];
}

export function CheckUserName(userName: string): returnCode {
    if (userName.match(/^[a-zA-Z0-9_-]{4,16}$/) === null) {
        return [false, '格式不正确'];
    }
    return [true, '校验成功'];
}

export function checkTel (tel: string): returnCode {
    if (tel.match(/^(0\d{2,3})?(-)?\d{7,8}$/) === null) {
        return [false, '格式不正确'];
    }
    return [true, '校验成功']
}