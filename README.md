# 阿惠家政后台管理系统

## 1. 功能列表

- [ ] 首页数据看板
- [x] 管理人员登录
- [x] 管理人员扫码登录登录
- [x] 基于管理组的权限管理
- [ ] 员工端手机登录
- 客户管理
- [x] 客户信息导出为excel
- [x] 客户信息搜索
- [x] 客户信息查看
- [ ] 客户信息修改
- [ ] 客户信息添加
- [ ] 客户信息删除
- [x] 客户信息分类展示，合并地址搜索功能
- [x] 客户服务历史展示
- [ ] 客户信息同步到小程序
- 员工管理
- [x] 员工信息导出为excel
- [x] 员工信息搜索
- [x] 员工信息查看
- [ ] 员工信息修改
- [ ] 员工信息添加
- [ ] 员工信息删除
- [ ] 派工客户短信提醒功能
- [ ] 员工信息同步到小程序
- 管理员管理
- [ ] 添加管理员
- [ ] 修改管理员信息、密码
- [x] 管理组管理
- [x] 管理组权限管理
- 派单管理
- [ ] 派单信息查看
- [ ] 派工
- [ ] 员工端抢单
- [ ] 员工端推送派工信息
- [ ] 员工工资结算
- [ ] 打印派工单
- 多门店管理
- [ ] 门店添加
- [ ] 门店信息修改
- [ ] 删除门店信息
## 2. 技术栈

    前端：

    基础：
    react: 18.2.0
    react-device-detect: 2.2.3
    react-dom: 18.2.0
    react-icons: 4.10.1
    react-router-dom: 6.15.0
    react-scripts: 5.0.1

    UI：
    @emotion/styled: 11.11.0
    @mui/icons-material: 5.14.3
    @mui/lab: 5.0.0-alpha.140
    @mui/material: 5.14.5
    @mui/x-date-pickers: 6.11.2

    通讯：
    mitt: 3.0.1
    axios: 1.4.0
    筛选：
    match-sorter: 6.3.1
    sort-by: 1.2.0
    日期：dayjs: 1.11.9
    本地缓存：localforage: 1.10.0
    加密：md5: 2.3.0
    拼音解析：pinyin-pro: 3.16.3
    样式：sass: 1.66.1
    数据验证：yup: 1.2.0
    url: 0.11.1
    web-vitals: 2.1.4
    xlsx: 0.20.0

## 1. Functions

- [ ] homepage data display
- [x] login for administrators
- [x] login for administrators based on QRcode
- [x] permissions based administrators group
- [ ] login for employee
- Customer
- [x] customer export excel
- [x] customer search
- [x] customer display
- [ ] alter customer information
- [ ] add customer
- [ ] delete customer
- [x] categories for customer, address search
- [x] services history
- [ ] sync to WeChat mini program
- Employee
- [x] employee export to excel
- [x] search employee
- [x] list employee
- [ ] alter employee
- [ ] add employee
- [ ] delete employee
- [ ] notice through SMS
- [ ] sync to WeChat mini program
- Admins
- [ ] add administrator
- [ ] alter administrator & change password
- [x] admin group
- [x] permissions
- dispatch
- [ ] dispatch lists
- [ ] sync dispatch
- [ ] by employee
- [ ] to employee
- [ ] salary
- [ ] print dispatch details
- Stores
- [ ] add store
- [ ] alter store
- [ ] delete store

## 2. Architecture

    FrontEnd：
    react: 18.2.0
    react-device-detect: 2.2.3
    react-dom: 18.2.0
    react-icons: 4.10.1
    react-router-dom: 6.15.0
    react-scripts: 5.0.1
    @emotion/styled: 11.11.0
    @mui/icons-material: 5.14.3
    @mui/lab: 5.0.0-alpha.140
    @mui/material: 5.14.5
    @mui/x-date-pickers: 6.11.2
    axios: 1.4.0
    dayjs: 1.11.9
    localforage: 1.10.0
    match-sorter: 6.3.1
    md5: 2.3.0
    mitt: 3.0.1
    next-routes: 1.4.2
    pinyin-pro: 3.16.3
    sass: 1.66.1
    sort-by: 1.2.0
    url: 0.11.1
    web-vitals: 2.1.4
    xlsx: 0.20.0
    yup: 1.2.0