import service from '@/utils/axios'
interface ResponseData {
    code: number,
    data: any,
    message: string
}

function get(url: string, params?: any): Promise<ResponseData> {
    return service.get(url, { params })
}

function post(url: string, data?: any): Promise<ResponseData> {
    return service.post(url, data)
}

//export default  每个文件只能有一个 export default 导入时可以使用任意名称 不需要 {} 结构化导入
//export 可以导出多个变量/函数/类   导入时必须使用相同的名字  需要使用 {} 进行结构化导入
export { get, post }