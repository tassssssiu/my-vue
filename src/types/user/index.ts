//这里定义一些全局会用到的数据类型
interface MenuItemType {
    name: string;
    icon: string;
    url: string;
    //MenuItemType[],表示该属性的类型是 ​由相同类型（MenuItemType）组成的数组，形成递归结构
    children?: MenuItemType[]
}

export type { MenuItemType }