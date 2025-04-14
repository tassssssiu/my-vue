// 系统设置页面 将menu数据转化为treedata数据 因为reeData数据格式要求 label表示数据名称，children表示子节点
function transformMenu(nodes: any) {
    // map() 是数组的一个方法，用于创建一个新数组
    return nodes.map((node: any) => {
        const newNode: any = {
            label: node.name,
            // url要当做node-key的唯一标识来进行使用
            url: node.url
        }
        if (node.children) {
            newNode.children = transformMenu(node.children)
        }
        return newNode
    })
}
export { transformMenu }