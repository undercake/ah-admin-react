interface Employee {
    id: number;
    EmployeeOID: string;
    ItemCode:string; // 编号
    FullName: string; // 姓名
    Sex: string;
    Tel: string;
    Birthday: string;
    Comment: string; // 说明
    Workday: string; //参工日期
    Department: string;
    Address: string;
    IDCode: string;
    HomeTel: string;
    WarrantorTel: string;
    ItemLevel: string; //员工等级
    BlameRecord: string; // 过失记录
    pym: string;
    DelFlag: number;
};

export interface EmployeeNew {
    id: number;
    avatar: string;
    name: string;
    gender: number;
    phone: string;
    birth_date: string;
    intro: string;
    note: string;
    address: string;
    create_time: string;
    deleted: number;
    grade: number;
    id_code: string;
    img: string;
    origin: string;
    pinyin: string;
    pym: string;
    work_date: string;
    workee: string;
};

export default Employee;