export function localGet(key: string, _default: any = undefined) {
    key = '__midas__' + key;
    const value = window.localStorage.getItem(key);
    if (value === null) return _default;
    try {
        // @ts-ignore
        return JSON.parse(window.localStorage.getItem(key));
    } catch (error) {
        return value;
    }
}

export function localSet(key: string, value: any) {
    key = '__midas__' + key;
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, JSON.stringify(value));
}

export function localRemove(key: string) {
    key = '__midas__' + key;
    window.localStorage.removeItem(key);
}

export function localClearAll() {
    localStorage.clear();
}

// 判断内容是否含有表情字符，现有数据库不支持。
export function hasEmoji(str = '') {
    const reg =
        /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
        // @ts-ignore
    return str.match(reg) && str.match(reg).length;
}
