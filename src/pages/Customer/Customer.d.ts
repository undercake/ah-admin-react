export default interface Customer {
    id               : number,
    ClientInfoOID    : string;
    Address          : string;
    BeginDate        : string;
    BlackFlag        : 0 | 1;
    CreateDate       : string;
    DelFlag          : number
    EndDate          : string;
    F1               : 0 | 1 | 2                       // 0普通 1VIP 2重要领导
    FullName         : string;
    HouseArea        : number;
    ItemCode         : string;
    LastModiDate     : string;
    NormalServiceTime: string;
    SpecialNeed      : string;
    Tel1             : string;
    Tel2             : string;
    Tel3             : string;
    TotalCount       : number;
    TotalMoney       : string
    UserType         : 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;  //7半月卡6月卡5季卡4年卡3包做2包周1钟点0暂无
    fRegion          : string
    pym              : string
}


export interface CustomerNew {
    id         : number,
    name       : string,
    mobile     : string,
    black      : number,
    pym        : string,
    pinyin     : string,
    del        : number,
    create_time: string,
    last_modify: string,
    remark     : string,
    total_money: string,
    total_count: number,
    type       : number,
}
