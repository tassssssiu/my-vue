// 中英文对应表
const fieldLabelMap: Record<string, string> = {
    description: '故障描述',
    address: '设备地址',
    equNo: '设备号',
    status: '当前状态',
    time: '故障时间',
    level: '告警级别',
    code: '故障代码',
    // 其他字段映射
};
// fieldLabelMap[key] 就是在访问对象 fieldLabelMap 中 键名为 key 的属性值。


const getLabel = (key: string): string => {
    return fieldLabelMap[key] || key
}
export { getLabel }