/*
 * @Author: Undercake
 * @Date: 2023-04-27 10:16:57
 * @LastEditTime: 2023-08-26 11:48:07
 * @FilePath: /ah-admin-react-from-next/src/pages/_404/index.tsx
 * @Description:
 */
import Empty from "../../components/Status/Empty";
function _404() {
    return <div className="dark:text-grey-50 w-100 h-100 text-center">
        <Empty />
        这里什么都没有哦！
    </div>;
}

export default _404;